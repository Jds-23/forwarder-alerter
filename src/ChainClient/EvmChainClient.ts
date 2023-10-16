import ChainClient from ".";
import { ChainConfig } from "../types";
import { ethers } from "ethers";

export interface EvmChainClients {
    [chainId: string]: EvmChainClient;
}

const ABI = [
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        name: "executeRecord",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

export class EvmChainClient extends ChainClient {
    chainConfig: ChainConfig;
    contractAddress: string;
    client: ethers.Contract;

    constructor(chainConfig: ChainConfig, rpc: string, contractAddress: string) {
        super();
        this.chainConfig = chainConfig;
        const provider = new ethers.providers.JsonRpcProvider(rpc);
        this.contractAddress = contractAddress;
        this.client = new ethers.Contract(contractAddress, ABI, provider);
    }

    async getExecuteRecord(bytes32: string): Promise<any> {
        try {
            const result = await this.client.executeRecord(bytes32);
            return result;
        } catch (e: any) {
            return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
        }
    }
}