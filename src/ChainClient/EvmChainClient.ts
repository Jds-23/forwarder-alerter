import ChainClient from ".";
import { ChainConfig } from "../types";
import { ethers } from "ethers";
import { stringToBytes32 } from "../utils";

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
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "srcChainId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "depositId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "destToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "depositor",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct IAssetForwarder.RelayData",
                "name": "relayData",
                "type": "tuple"
            },
            {
                "internalType": "string",
                "name": "forwarderRouterAddress",
                "type": "string"
            }
        ],
        "name": "iRelay",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "srcChainId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "depositId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "destToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "depositor",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "message",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct IAssetForwarder.RelayDataMessage",
                "name": "relayData",
                "type": "tuple"
            },
            {
                "internalType": "string",
                "name": "forwarderRouterAddress",
                "type": "string"
            }
        ],
        "name": "iRelayMessage",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
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

    async estimateGas(
        amount: string,
        srcChainId: string,
        depositId: string,
        destToken: string,
        recipient: string,
        depositor: string,
        message: string | null = null
    ): Promise<any> {
        try {
            if (message) {
                const result = await this.client.provider.estimateGas({
                    data: this.client.interface.encodeFunctionData("iRelayMessage", [
                        {
                            "amount": amount,
                            "srcChainId": stringToBytes32(srcChainId),
                            "depositId": depositId,
                            "destToken": destToken,
                            "recipient": recipient,
                            "depositor": depositor,
                            "message": message
                        },
                        "0x69696280f79F118451F04BFd432bFA588fc25462"
                    ]),
                    to: this.contractAddress,
                    value: "0x0",
                    from: "0x69696280f79F118451F04BFd432bFA588fc25462"
                })
                return [result.toString(), undefined];
            } else {
                const result = await this.client.provider.estimateGas({
                    data: this.client.interface.encodeFunctionData("iRelay", [
                        {
                            "amount": amount,
                            "srcChainId": stringToBytes32(srcChainId),
                            "depositId": depositId,
                            "destToken": destToken,
                            "recipient": recipient,
                            "depositor": depositor
                        },
                        "0x69696280f79F118451F04BFd432bFA588fc25462"
                    ]),
                    to: this.contractAddress,
                    value: "0x0",
                    from: "0x69696280f79F118451F04BFd432bFA588fc25462"
                })
                return [result.toString(), undefined];
            }
        } catch (e: any) {
            console.error(e);
            return [undefined, e.hasOwnProperty("reason") ? e.reason : "Unknown error check logs"];
        }
    }

    getContractAddress(): string {
        return this.contractAddress;
    }
    getChainName(): string {
        return this.chainConfig.chainName;
    }
}