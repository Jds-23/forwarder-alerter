import { ChainClients } from "./ChainClient";
import RouterChainClient from "./ChainClient/RouterChainClient";
import { ROUTER_CHAIN_EXPLORER_ENVIRONMENT, VOYAGER_MIDDLEWARE_ADDRESS } from "./constant";
import { Transaction } from "./types";
import { getIRelayClaimId, normalizeAmount, stringToBytes32 } from "./utils";
import fetchGraphQLTransactions from "./utils/fetchGraphQLTransaction";

export default class TransactionFetcher {
    chainClients: ChainClients;
    voyagerMiddleware: RouterChainClient;
    TIME_DIFFERENCE: number;
    constructor(chainClients: ChainClients, timeDifference: number = 300000) {
        this.chainClients = chainClients;
        this.voyagerMiddleware = new RouterChainClient(VOYAGER_MIDDLEWARE_ADDRESS, ROUTER_CHAIN_EXPLORER_ENVIRONMENT);
        this.TIME_DIFFERENCE = timeDifference;
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
            const claimId = getIRelayClaimId({
                Amount: normalizeAmount(transaction.dest_stable_amount, transaction.dest_chain_id, queryResult?.data?.toLowerCase(), tokenConfig),
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
                    normalizeAmount(transaction.dest_stable_amount, transaction.dest_chain_id, queryResult?.data?.toLowerCase(), tokenConfig),
                    transaction.src_chain_id,
                    transaction.deposit_id,
                    queryResult?.data?.toLowerCase(),
                    transaction.recipient_address,
                    depositor_address?.toLowerCase(),
                    transaction.message?.toLowerCase() ?? null
                );
                if (!err) {
                    this.chainClients[transaction.dest_chain_id]
                    return transaction
                } else {
                    return { ...transaction, error: err }
                }
            } else {
                return undefined
            }
        } catch (error) {
            throw new Error("Error verifying transaction:" + error);
        }
    }
}