import {
    ChainGrpcWasmApi,
    getNetworkInfo,
    getNetworkType,
    toBase64,
    toUtf8,
} from "@routerprotocol/router-chain-sdk-ts";
import { ethers } from "ethers";
import * as fs from 'fs';
import * as path from 'path';

const fetch = require("node-fetch");


function getRpcAndContractAddress(): RpcAndContractAddress {
    const filePath = path.join(__dirname, './rpcAndContractAddress.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data: RpcAndContractAddress = JSON.parse(rawData);
    return data;
}



const QUERY_URL = "https://api.iswap-explorer-testnet.routerprotocol.com/graphql";
// const QUERY_URL = "https://api.iswap-explorer-testnet.routerprotocol.com/graphql";

const SLACK_WEBHOOK_URL =
    "https://hooks.slack.com/services/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";
const TRANSACTION_URL = `https://d2apf6ujtzwln8.cloudfront.net/swap/tx/`;
const LCD_URL = `https://lcd.testnet.routerchain.dev/router-protocol/router-chain/multichain/chain_config`;
const ROUTER_CHAIN_EXPLORER_ENVIRONMENT = `testnet-eu`;
const VOYAGER_MIDDLEWARE_ADDRESS = `router17hlelrccxutnpe6u0gw2tk52f6ekrwenmz9amyhhfsq2v24mhkzquuwu99`;
const ROUTER_MULTICALLER = `router1wr6vc3g4caz9aclgjacxewr0pjlre9wl2uhq73rp8mawwmqaczsq08nnup`;
const abi = [
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

interface Transaction {
    _id: string;
    created_timestamp: string;
    forwarder_address: string;
    src_tx_hash: string;
    dest_tx_hash: string;
    src_chain_id: string;
    src_symbol: string;
    src_amount: string;
    dest_chain_id: string;
    src_stable_address: string;
    dest_symbol: string;
    dest_amount: string;
    deposit_id: string;
    dest_stable_amount: string;
    recipient_address: string;
    sender_address: string;
    src_address: string;
    status: string;
    message: string;
    message_hash: string;
}



interface RpcAndContractAddress {
    [chainId: string]: {
        rpc: string;
        contractAddress: string;
        dexSpan: string;
    };
}

interface ChainConfig {
    chainId: string;
    chainName: string;
    symbol: string;
    native_decimals: string;
    chainType: string;
    confirmationsRequired: string;
    lastObservedValsetNonce: string;
    chain_enabled: boolean;
}

interface ChainClients {
    [chainId: string]: ChainClient;
}

function getTokenMappingMsg(
    srcChainId: string,
    destChainId: string,
    srcToken: string
): Record<string, unknown> {
    const queryMsg = {
        fetch_dest_token: {
            src_chain_id: srcChainId,
            dest_chain_id: destChainId,
            src_token: srcToken.toLowerCase(),
        },
    };
    const byteQueryMsg = JSON.stringify(queryMsg);
    return queryMsg;
}

class ChainClient {
    chainConfig: ChainConfig;
    contractAddress: string;
    dexSpan: string;
    client: ethers.Contract;

    constructor(chainConfig: ChainConfig, rpc: string, contractAddress: string, dexSpan: string) {
        this.chainConfig = chainConfig;
        const provider = new ethers.providers.JsonRpcProvider(rpc);
        this.contractAddress = contractAddress;
        this.client = new ethers.Contract(contractAddress, abi, provider);
        this.dexSpan = dexSpan;
    }

    async getEventLogs(transactionHash: string) {
        try {
            const result = await this.client.provider.getLogs({
                fromBlock: 0,
                toBlock: "latest",
                address: this.client.address,
                topics: [transactionHash],
            });
            return result;
        } catch (e: any) {
            return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
        }
    }

    async callExecuteRecord(bytes32: string) {
        try {
            const result = await this.client.executeRecord(bytes32);
            return result;
        } catch (e: any) {
            return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
        }
    }
}

const handleQueryContract = async (
    contractAddress: string,
    queryObj: Record<string, unknown>
): Promise<any> => {
    try {
        const network = getNetworkInfo(
            getNetworkType(ROUTER_CHAIN_EXPLORER_ENVIRONMENT)
        );
        const wasmClient = new ChainGrpcWasmApi(network.grpcEndpoint);
        const queryResult = await wasmClient.fetchSmartContractState(
            contractAddress,
            toUtf8(JSON.stringify(queryObj))
        )
        return queryResult;
    } catch (e: any) {
        return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
    }
};

const HEADERS = {
    "Content-Type": "application/json",
};

const CHAIN_ID_CHAIN_NAME_MAP = {
    "80001": "Mumbai",
    "43113": "Fuji",
};

async function fetchTransactions() {
    const requestBody = {
        query: `
            query Query {
                transactions(where: {status:"pending"}) {
                    data {
                        _id
                        created_timestamp
                        forwarder_address
                        src_tx_hash
                        dest_tx_hash
                        src_chain_id
                        src_symbol
                        src_amount
                        dest_chain_id
                        dest_symbol
                        dest_amount
                        deposit_id
                        dest_stable_amount
                        src_stable_address
                        recipient_address
                        sender_address
                        src_address
                        status
                        message
                        message_hash
                    }
                }
            }
        `,
    };

    try {
        const response = await fetch(QUERY_URL, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(requestBody),
        });
        const data = await response.json();
        const transactions: Transaction[] = data?.data?.transactions?.data || [];
        console.log(transactions.length, "transactions found of pending status");
        const currentTime = Date.now();

        const transactionsOver1hr = transactions.filter((transaction) => {
            if (
                currentTime - new Date(transaction.created_timestamp).getTime() >
                3600000
            ) {
                return true;
            }
            return false;
        });

        const tokenConfigResult = await handleQueryContract(
            VOYAGER_MIDDLEWARE_ADDRESS,
            {
                fetch_tokens_config: {},
            }
        );
        const tokenConfig = tokenConfigResult?.data;

        const results = await Promise.all(
            transactionsOver1hr.map(async (transaction) => {
                const queryMsg = getTokenMappingMsg(
                    transaction.src_chain_id,
                    transaction.dest_chain_id,
                    transaction.src_stable_address.toLowerCase()
                );

                const queryResult = await handleQueryContract(
                    VOYAGER_MIDDLEWARE_ADDRESS,
                    queryMsg
                );
                if (!queryResult?.data)
                    return;

                const Depositor = transaction.src_address === transaction.src_stable_address ? transaction.sender_address?.toLowerCase() : chainClients[transaction.src_chain_id]?.dexSpan;
                const claimId = await getIRelayClaimId(
                    {
                        Amount: normalizeAmount(transaction.dest_stable_amount, transaction.dest_chain_id, queryResult?.data?.toLowerCase(), tokenConfig),
                        SrcChainId: transaction.src_chain_id,
                        DepositId: transaction.deposit_id?.toLowerCase(),
                        DestToken: queryResult?.data?.toLowerCase(),
                        Recipient: transaction.recipient_address?.toLowerCase(),
                        Depositor: Depositor.toLowerCase(),
                    },
                    chainClients[transaction.dest_chain_id]?.contractAddress,
                    transaction.message?.toLowerCase() ?? null
                );
                // console.log({
                //     Amount: normalizeAmount(transaction.dest_stable_amount, transaction.dest_chain_id, queryResult?.data?.toLowerCase(), tokenConfig),
                //     SrcChainId: transaction.src_chain_id,
                //     DepositId: transaction.deposit_id?.toLowerCase(),
                //     DestToken: queryResult?.data?.toLowerCase(),
                //     Recipient: transaction.recipient_address?.toLowerCase(),
                //     Depositor: Depositor.toLowerCase(),
                // },
                //     chainClients[transaction.dest_chain_id]?.contractAddress,
                //     transaction.message?.toLowerCase() ?? null)
                const result = await chainClients[
                    transaction.dest_chain_id
                ]?.callExecuteRecord(claimId);
                console.log("result", transaction.status, claimId, result);
                return result;
            })
        );

        // const transactionURL = `${TRANSACTION_URL}${transaction.src_tx_hash}`;
        //         const message = `Transaction with ID: <${transactionURL}|${transaction._id}> has not been picked by a forwarder yet, was created from ${CHAIN_ID_CHAIN_NAME_MAP[transaction.src_chain_id] ?? transaction.src_chain_id} more than 1 minutes ago for ${CHAIN_ID_CHAIN_NAME_MAP[transaction.dest_chain_id] ?? transaction.dest_chain_id}. `;

        //         // sendAlertToSlack(message);
        //         console.log(`Transaction with ID: ${transaction._id} has a null forwarder_address and was created more than 1 minute ago.`);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

function normalizeAmount(amount: string, chainId: string, tokenAddress: string,
    tokenConfigs: [][]
): string {
    const tokenConfig = tokenConfigs.find((tokenConfig) => {
        // @ts-ignore
        return tokenConfig[0].toLowerCase() === chainId && tokenConfig[1].toLowerCase() === tokenAddress.toLowerCase();
    });
    // @ts-ignore
    return typeof (tokenConfig[2]) === "number" ? ethers.utils.parseUnits(amount, tokenConfig[2]).toString() : amount;
}
function sendAlertToSlack(message: string) {
    const payload = {
        text: message,
    };

    fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then((response: any) => {
            if (!response.ok) {
                throw new Error("Failed to send alert to Slack");
            } else {
                console.log("Sent alert to slack!");
            }
        })
        .catch((error: any) => {
            console.error("Error sending alert to Slack:", error);
        });
}

async function getIRelayClaimId(
    msg: {
        Amount: string;
        SrcChainId: string;
        DepositId: string;
        DestToken: string;
        Recipient: string;
        Depositor: string;
    },
    voyagerGateway: string,
    message: string | null = null,
): Promise<string> {
    // check all are defined
    if (
        !msg.Amount ||
        !msg.SrcChainId ||
        !msg.DepositId ||
        !msg.DestToken ||
        !msg.Recipient ||
        !msg.Depositor ||
        !voyagerGateway
    ) {
        console.log(msg, voyagerGateway);
        throw new Error("Missing parameter");
    }
    const IRELAY_ABI_INTERFACE = new ethers.utils.AbiCoder();
    let data;
    if (message) {
        data = IRELAY_ABI_INTERFACE.encode(
            ["uint256", "bytes32", "uint256", "address", "address", "bytes", "address", "bytes"],
            [
                msg.Amount,
                stringToBytes32(msg.SrcChainId),
                msg.DepositId,
                msg.DestToken,
                msg.Recipient,
                msg.Depositor,
                voyagerGateway,
                message,
            ]
        );
    } else {
        data = IRELAY_ABI_INTERFACE.encode(
            ["uint256", "bytes32", "uint256", "address", "address", "bytes", "address"],
            [
                msg.Amount,
                stringToBytes32(msg.SrcChainId),
                msg.DepositId,
                msg.DestToken,
                msg.Recipient,
                msg.Depositor,
                voyagerGateway,
            ]
        );
    }
    const hash = ethers.utils.keccak256(data);
    return hash;
}

function stringToBytes32(str: string): string {
    const strBytes = ethers.utils.toUtf8Bytes(str);
    const paddedBytes = ethers.utils.hexlify(
        ethers.utils.concat([
            strBytes,
            ethers.constants.HashZero,
        ]).slice(0, 32)
    );
    return paddedBytes;
}


async function getChainConfig(): Promise<ChainConfig[]> {
    try {
        const response = await fetch(LCD_URL);
        const chainConfig = await response.json();
        return chainConfig.chainConfig;
    } catch (e: any) {
        return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
    }
}


let chainClients: ChainClients = {};
async function main() {
    let chainConfig: ChainConfig[];
    chainConfig = await getChainConfig();
    const rpcAndContractAddress: RpcAndContractAddress =
        getRpcAndContractAddress();
    chainConfig.forEach((chainConfig) => {
        const rpc = rpcAndContractAddress[chainConfig.chainId]?.rpc;
        const contractAddress =
            rpcAndContractAddress[chainConfig.chainId]?.contractAddress;
        const dexSpan =
            rpcAndContractAddress[chainConfig.chainId]?.dexSpan;
        if (!rpc || !contractAddress) {
            console.error(
                `Rpc and contract address not found for chainId: ${chainConfig.chainId}`
            );
            return;
        }
        const chainClient = new ChainClient(chainConfig, rpc, contractAddress, dexSpan);
        chainClients[chainConfig.chainId] = chainClient;
    });
    fetchTransactions();
    // setInterval(fetchTransactions, 60000);
}

main();