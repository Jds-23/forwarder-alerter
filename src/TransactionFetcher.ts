import { ChainClients } from "./ChainClient";
import RouterChainClient from "./ChainClient/RouterChainClient";
import { ROUTER_CHAIN_EXPLORER_ENVIRONMENT, VOYAGER_MIDDLEWARE_ADDRESS } from "./constant";
import { GasPrices, TokenPrices, Transaction } from "./types";
import { getIRelayClaimId, normalizeAmount, stringToBytes32 } from "./utils";
import fetchGraphQLTransactions from "./utils/fetchGraphQLTransaction";
import { ethers } from "ethers";

export default class TransactionFetcher {
    chainClients: ChainClients;
    voyagerMiddleware: RouterChainClient;
    TIME_DIFFERENCE: number;
    tokenPrices: TokenPrices;
    gasPrices: GasPrices;
    constructor(chainClients: ChainClients, _tokenPrices: TokenPrices, _gasPrices: GasPrices, timeDifference: number = 300000) {
        this.chainClients = chainClients;
        this.voyagerMiddleware = new RouterChainClient(VOYAGER_MIDDLEWARE_ADDRESS, ROUTER_CHAIN_EXPLORER_ENVIRONMENT);
        this.TIME_DIFFERENCE = timeDifference;
        this.tokenPrices = _tokenPrices;
        this.gasPrices = _gasPrices;
    }
    async fetchTransactions(): Promise<Transaction[]> {
        try {
            const transactions: Transaction[] = await fetchGraphQLTransactions();
            console.log(transactions.length, "transactions found of pending status");

            const currentTime = Date.now();

            const transactionsOverTimeDifference = transactions.filter(transaction => currentTime - new Date(transaction.created_timestamp).getTime() > this.TIME_DIFFERENCE);

            const tokenConfigResult = await this.voyagerMiddleware.handleQueryContract({ fetch_tokens_config: {} });
            const tokenConfig = tokenConfigResult?.data;

            const results = await Promise.all(transactionsOverTimeDifference.map(transaction => {
                return this.processTransaction(transaction, tokenConfig)
            }));

            // @ts-ignore
            const transactionsToAlert: Transaction[] = results.filter(result => result !== undefined);
            console.log(transactionsToAlert.length, "transactions found of pending status for more than 5 min");

            return transactionsToAlert.map(transaction => {
                return {
                    ...transaction,
                    src_chain_name: this.chainClients[transaction.src_chain_id]?.getChainName(),
                    dest_chain_name: this.chainClients[transaction.dest_chain_id]?.getChainName(),
                }
            });
        } catch (error) {
            throw new Error("Error fetching transactions:" + error);
        }
    }

    async processTransaction(transaction: Transaction, tokenConfig: any): Promise<Transaction | undefined> {
        try {
            const queryResult = await this.voyagerMiddleware.fetchDestToken(transaction.src_chain_id, transaction.dest_chain_id, transaction.src_stable_address.toLowerCase());

            if (!queryResult?.data) return undefined;
            const depositor_address = transaction?.src_chain_id === "near-testnet" ? stringToBytes32(transaction?.depositor_address) : transaction?.depositor_address
            const normalizedDestAmount = normalizeAmount(transaction.dest_stable_amount, transaction.dest_chain_id, queryResult.data.toLowerCase(), tokenConfig)
            const normalizedSrcAmount = normalizeAmount(transaction.src_stable_amount, transaction.src_chain_id, transaction.src_stable_address.toLowerCase(), tokenConfig)
            const claimId = getIRelayClaimId({
                Amount: normalizedDestAmount.toString(),
                SrcChainId: transaction?.src_chain_id,
                DepositId: transaction?.deposit_id?.toLowerCase(),
                DestToken: queryResult?.data?.toLowerCase(),
                Recipient: transaction?.recipient_address?.toLowerCase(),
                Depositor: depositor_address?.toLowerCase(),
            }, this.chainClients[transaction.dest_chain_id]?.getContractAddress(), transaction.message?.toLowerCase() ?? null);
            if (!claimId) return undefined;
            const result = await this.chainClients[transaction.dest_chain_id].getExecuteRecord(claimId);
            if (result === false) {
                const [gasLimit, err] = await this.chainClients[transaction.dest_chain_id]?.estimateGas(
                    normalizedDestAmount.toString(),
                    transaction.src_chain_id,
                    transaction.deposit_id,
                    queryResult?.data?.toLowerCase(),
                    transaction.recipient_address,
                    depositor_address?.toLowerCase(),
                    transaction.message?.toLowerCase() ?? null
                );
                if (gasLimit) {
                    const gasPrice = ethers.utils.parseUnits(this.gasPrices[transaction.dest_chain_id]?.price ?? "0", this.gasPrices[transaction.dest_chain_id]?.decimals ?? "0");
                    const nativeTokenPriceInUsd = ethers.utils.parseUnits(this.tokenPrices[transaction.dest_chain_id]?.price ?? "0", this.tokenPrices[transaction.dest_chain_id]?.decimals ?? "0");
                    const gasPriceInUsd = gasPrice.mul(nativeTokenPriceInUsd)
                    const gasFeeInUsd = gasPriceInUsd.mul(gasLimit)
                    const providedGasFee = normalizedSrcAmount.sub(normalizedDestAmount)
                    if (providedGasFee.gte(gasFeeInUsd)) {
                        return transaction
                    } else {
                        return { ...transaction, error: "Gas fee is less than estimated gas fee" }
                    }
                } else {
                    return { ...transaction, error: err }
                }
            } else {
                console.log("Transaction already executed")
                return undefined
            }
        } catch (error) {
            throw new Error("Error verifying transaction:" + error);
        }
    }
}