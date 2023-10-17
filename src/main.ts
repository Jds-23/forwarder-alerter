import ChainClient, { ChainClients } from "./ChainClient";
import { EvmChainClient } from "./ChainClient/EvmChainClient";
import { NearChainClient } from "./ChainClient/NearChainClient";
import RouterChainClient from "./ChainClient/RouterChainClient";
import TransactionFetcher from "./TransactionFetcher";
import { ROUTER_CHAIN_EXPLORER_ENVIRONMENT } from "./constant";
import { ChainConfig, Transaction } from "./types";
import { TronAddressToHex, getChainConfig, getContractConfig, getRpcFromEnv } from "./utils";

export default async function main(): Promise<Transaction[]> {
    let chainConfig: ChainConfig[];
    chainConfig = await getChainConfig();
    const rpcs = getRpcFromEnv();
    const contractConfig = await getContractConfig();
    let chainClients: ChainClients = {};
    chainConfig.forEach((chainConfig) => {
        let chainClient: ChainClient;
        const rpc = rpcs[chainConfig.chainId]?.rpc;
        const contractAddress =
            contractConfig.find((config) => config.chainId === chainConfig.chainId)?.contractAddress;
        if (chainConfig.chainType === "CHAIN_TYPE_NEAR") {
            if (!contractAddress) {
                console.error(
                    `Contract address not found for chainId: ${chainConfig.chainId}`
                );
                return;
            }
            chainClient = new NearChainClient(chainConfig, rpc, contractAddress);
        } else if (chainConfig.chainType === "CHAIN_TYPE_ROUTER") {
            if (!contractAddress) {
                console.error(
                    `Contract address not found for chainId: ${chainConfig.chainId}`
                );
                return;
            }
            chainClient = new RouterChainClient(contractAddress, ROUTER_CHAIN_EXPLORER_ENVIRONMENT);
        } else if (chainConfig.chainType === "CHAIN_TYPE_EVM") {
            if (!rpc || !contractAddress) {
                console.error(
                    `Rpc and contract address not found for chainId: ${chainConfig.chainId}`
                );
                return;
            }
            if (chainConfig.chainId === "2494104990") {
                // contractAddress = ;
                chainClient = new EvmChainClient(chainConfig, rpc, TronAddressToHex(contractAddress));
            } else {
                chainClient = new EvmChainClient(chainConfig, rpc, contractAddress);
            }
        } else {
            console.error(
                `Unsupported chain type ${chainConfig.chainType}`
            );
            return;
        }
        chainClients[chainConfig.chainId] = chainClient;
    });
    const transactionFetcher = new TransactionFetcher(chainClients);
    return await transactionFetcher.fetchTransactions();
}

