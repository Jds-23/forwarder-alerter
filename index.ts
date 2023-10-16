// import {
//     ChainGrpcWasmApi,
//     getNetworkInfo,
//     getNetworkType,
//     toUtf8,
// } from "@routerprotocol/router-chain-sdk-ts";
// import { ethers } from "ethers";
// import { Contract } from "near-api-js";
// import * as path from 'path';

// const fetch = require("node-fetch");
// const nearAPI = require("near-api-js");
// const TronWeb = require('tronweb');
// require("dotenv").config({ path: path.resolve(__dirname, '../.env') });


// const { keyStores, connect } = nearAPI;
// const CREDENTIALS_PATH = "/Users/joydeepsingha/.near-credentials/testnet/joydeeeep.testnet.json"
// const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(CREDENTIALS_PATH);

// const connectionConfig = {
//     networkId: "testnet",
//     keyStore: myKeyStore, // first create a key store 
//     nodeUrl: "https://rpc.testnet.near.org",
//     walletUrl: "https://wallet.testnet.near.org",
//     helperUrl: "https://helper.testnet.near.org",
//     explorerUrl: "https://explorer.testnet.near.org",
// };

// function getRpcFromEnv(): Rpc {

//     const data = {
//         "80001": {
//             "rpc": process.env.MATIC_RPC,
//         },
//         "43113": {
//             "rpc": process.env.FUJI_RPC,
//         },
//         "5": {
//             "rpc": process.env.GOERLI_RPC,
//         },
//         "2494104990": {
//             "rpc": process.env.TRON_RPC,
//         }
//     };
//     return data;
// }



// const QUERY_URL = "https://api.iswap-explorer-testnet.routerprotocol.com/graphql";
// // const QUERY_URL = "https://api.iswap-explorer-testnet.routerprotocol.com/graphql";

// const SLACK_WEBHOOK_URL =
//     "https://hooks.slack.com/services/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";
// const TRANSACTION_URL = `https://d2apf6ujtzwln8.cloudfront.net/swap/tx/`;
// const LCD_URL = `https://lcd.testnet.routerchain.dev/router-protocol/router-chain/multichain/chain_config`;
// const LCD_URL_CONTRACT_CONFIG = `https://lcd.testnet.routerchain.dev/router-protocol/router-chain/multichain/contract_config`;
// const ROUTER_CHAIN_EXPLORER_ENVIRONMENT = `testnet-eu`;
// const VOYAGER_MIDDLEWARE_ADDRESS = `router17hlelrccxutnpe6u0gw2tk52f6ekrwenmz9amyhhfsq2v24mhkzquuwu99`;
// const ROUTER_MULTICALLER = `router1wr6vc3g4caz9aclgjacxewr0pjlre9wl2uhq73rp8mawwmqaczsq08nnup`;
// const abi = [
//     {
//         inputs: [
//             {
//                 internalType: "bytes32",
//                 name: "",
//                 type: "bytes32",
//             },
//         ],
//         name: "executeRecord",
//         outputs: [
//             {
//                 internalType: "bool",
//                 name: "",
//                 type: "bool",
//             },
//         ],
//         stateMutability: "view",
//         type: "function",
//     },
// ];

// interface Transaction {
//     _id: string;
//     created_timestamp: string;
//     forwarder_address: string;
//     src_tx_hash: string;
//     dest_tx_hash: string;
//     src_chain_id: string;
//     src_symbol: string;
//     src_amount: string;
//     dest_chain_id: string;
//     src_stable_address: string;
//     dest_symbol: string;
//     dest_amount: string;
//     deposit_id: string;
//     dest_stable_amount: string;
//     recipient_address: string;
//     sender_address: string;
//     src_address: string;
//     status: string;
//     message: string;
//     message_hash: string;
//     depositor_address: string;
// }



// interface Rpc {
//     [chainId: string]: {
//         rpc: string;
//     };
// }

// interface ChainConfig {
//     chainId: string;
//     chainName: string;
//     symbol: string;
//     native_decimals: string;
//     chainType: string;
//     confirmationsRequired: string;
//     lastObservedValsetNonce: string;
//     chain_enabled: boolean;
// }

// interface ContractConfig {
//     chainId: string;
//     contractAddress: string;
//     contract_enabled: boolean;
//     contractType: string;
// }
// interface ChainClients {
//     [chainId: string]: ChainClient;
// }

// function getTokenMappingMsg(
//     srcChainId: string,
//     destChainId: string,
//     srcToken: string
// ): Record<string, unknown> {
//     const queryMsg = {
//         fetch_dest_token: {
//             src_chain_id: srcChainId,
//             dest_chain_id: destChainId,
//             src_token: srcToken.toLowerCase(),
//         },
//     };
//     return queryMsg;
// }

// class ChainClient {
//     chainConfig: ChainConfig;
//     contractAddress: string;
//     client: ethers.Contract;

//     constructor(chainConfig: ChainConfig, rpc: string, contractAddress: string) {
//         this.chainConfig = chainConfig;
//         const provider = new ethers.providers.JsonRpcProvider(rpc);
//         this.contractAddress = contractAddress;
//         this.client = new ethers.Contract(contractAddress, abi, provider);
//     }

//     async getEventLogs(transactionHash: string) {
//         try {
//             const result = await this.client.provider.getLogs({
//                 fromBlock: 0,
//                 toBlock: "latest",
//                 address: this.client.address,
//                 topics: [transactionHash],
//             });
//             return result;
//         } catch (e: any) {
//             console.log(this.chainConfig.chainId);
//             return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
//         }
//     }

//     async callExecuteRecord(bytes32: string) {
//         try {
//             const result = await this.client.executeRecord(bytes32);
//             return result;
//         } catch (e: any) {
//             return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
//         }
//     }
// }

// const handleQueryContract = async (
//     contractAddress: string,
//     queryObj: Record<string, unknown>
// ): Promise<any> => {
//     try {
//         const network = getNetworkInfo(
//             getNetworkType(ROUTER_CHAIN_EXPLORER_ENVIRONMENT)
//         );
//         const wasmClient = new ChainGrpcWasmApi(network.grpcEndpoint);
//         const queryResult = await wasmClient.fetchSmartContractState(
//             contractAddress,
//             toUtf8(JSON.stringify(queryObj))
//         )
//         return queryResult;
//     } catch (e: any) {
//         return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
//     }
// };

// const HEADERS = {
//     "Content-Type": "application/json",
// };


// const ONE_HOUR_IN_MS = 3600000;

// async function fetchGraphQLTransactions(): Promise<any> {
//     const requestBody = {
//         query: `
//             query Query {
//                 transactions(filter:{depositor_address:{ne:null},status:{eq:"pending"}}) {
//                     data {
//                         _id
//                         created_timestamp
//                         src_chain_id
//                         dest_chain_id
//                         src_stable_address
//                         dest_stable_amount
//                         deposit_id
//                         recipient_address
//                         depositor_address
//                         message
//                         dest_chain_id
//                     }
//                 }
//             }
//         `,
//     };

//     const response = await fetch(QUERY_URL, {
//         method: "POST",
//         headers: HEADERS,
//         body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//         throw new Error('Failed to fetch transactions');
//     }

//     const data = await response.json();
//     return data?.data?.transactions?.data || [];
// }

// async function getTransactionsOver1hr(transactions: Transaction[]): Promise<Transaction[]> {
//     const currentTime = Date.now();
//     return transactions.filter(transaction => currentTime - new Date(transaction.created_timestamp).getTime() > ONE_HOUR_IN_MS);
// }


// async function fetchTransactions(): Promise<Transaction[]> {
//     try {
//         const transactions = await fetchGraphQLTransactions();
//         console.log(transactions.length, "transactions found of pending status");

//         const transactionsOver1hr = await getTransactionsOver1hr(transactions);

//         const tokenConfigResult = await handleQueryContract(VOYAGER_MIDDLEWARE_ADDRESS, { fetch_tokens_config: {} });
//         const tokenConfig = tokenConfigResult?.data;

//         const results = await Promise.all(transactionsOver1hr.map(transaction => processTransaction(transaction, tokenConfig)));

//         const transactionsToAlert = results.filter(result => result !== undefined);
//         console.log(transactionsToAlert.length, "transactions found of pending status for more than 1hr");

//         return transactionsToAlert;
//     } catch (error) {
//         console.error("Error fetching transactions:", error);
//         return [];
//     }
// }

// async function processTransaction(transaction: Transaction, tokenConfig: any): Promise<Transaction | undefined> {
//     try {
//         const queryMsg = getTokenMappingMsg(transaction.src_chain_id, transaction.dest_chain_id, transaction.src_stable_address.toLowerCase());
//         const queryResult = await handleQueryContract(VOYAGER_MIDDLEWARE_ADDRESS, queryMsg);

//         if (!queryResult?.data) return undefined;

//         const claimId = await getIRelayClaimId({
//             Amount: normalizeAmount(transaction.dest_stable_amount, transaction.dest_chain_id, queryResult?.data?.toLowerCase(), tokenConfig),
//             SrcChainId: transaction.src_chain_id,
//             DepositId: transaction.deposit_id?.toLowerCase(),
//             DestToken: queryResult?.data?.toLowerCase(),
//             Recipient: transaction.recipient_address?.toLowerCase(),
//             Depositor: transaction.depositor_address.toLowerCase(),
//         }, getVoyagerAddress(transaction), transaction.message?.toLowerCase() ?? null);

//         let result;
//         if (transaction.dest_chain_id === "near-testnet") {
//             // @ts-ignore
//             result = await nearContract.get_execute_record({ message_hash: bytes32ToUint8Array(claimId) });
//         } else {
//             result = await chainClients[transaction.dest_chain_id]?.callExecuteRecord(claimId);
//         }

//         return result ? undefined : transaction;
//     } catch (error) {
//         console.error("Error processing transaction:", error);
//         return undefined;
//     }
// }

// function getVoyagerAddress(transaction: Transaction): string {
//     return transaction.dest_chain_id === "near-testnet" ? "asset_forwarder_testnet.router_protocol.testnet" : chainClients[transaction.dest_chain_id]?.contractAddress;
// }


// function normalizeAmount(amount: string, chainId: string, tokenAddress: string,
//     tokenConfigs: [][]
// ): string {
//     const tokenConfig = tokenConfigs.find((tokenConfig) => {
//         // @ts-ignore
//         return tokenConfig[0].toLowerCase() === chainId && tokenConfig[1].toLowerCase() === tokenAddress.toLowerCase();
//     });
//     // @ts-ignore
//     return typeof (tokenConfig[2]) === "number" ? ethers.utils.parseUnits(amount, tokenConfig[2]).toString() : amount;
// }


// async function getIRelayClaimId(
//     msg: {
//         Amount: string;
//         SrcChainId: string;
//         DepositId: string;
//         DestToken: string;
//         Recipient: string;
//         Depositor: string;
//     },
//     voyagerGateway: string,
//     message: string | null = null,
// ): Promise<string> {
//     // check all are defined
//     if (
//         !msg.Amount ||
//         !msg.SrcChainId ||
//         !msg.DepositId ||
//         !msg.DestToken ||
//         !msg.Recipient ||
//         !msg.Depositor ||
//         !voyagerGateway
//     ) {
//         console.log(msg, voyagerGateway);
//         throw new Error("Missing parameter");
//     }
//     const IRELAY_ABI_INTERFACE = new ethers.utils.AbiCoder();
//     let types: string[];
//     let values: string[];
//     if (voyagerGateway === "asset_forwarder_testnet.router_protocol.testnet") {

//         types = [
//             "uint256",
//             "bytes32",
//             "uint256",
//             "string",
//             "bytes",
//             "bytes",
//             "string",
//         ];
//         values = [
//             msg.Amount,
//             stringToBytes32(msg.SrcChainId),
//             msg.DepositId,
//             msg.DestToken,
//             msg.Recipient,
//             msg.Depositor,
//             voyagerGateway
//         ];
//         if (message) {
//             types.push("bytes");
//             values.push(message);
//         }
//     } else {
//         types = [
//             "uint256",
//             "bytes32",
//             "uint256",
//             "address",
//             "address",
//             "bytes",
//             "address",
//         ];
//         values = [
//             msg.Amount,
//             stringToBytes32(msg.SrcChainId),
//             msg.DepositId,
//             msg.DestToken,
//             msg.Recipient,
//             msg.Depositor,
//             voyagerGateway
//         ];
//         if (message) {
//             types.push("bytes");
//             values.push(message);
//         }
//     }
//     const data = IRELAY_ABI_INTERFACE.encode(
//         types, values)
//     const hash = ethers.utils.keccak256(data);
//     return hash;
// }

// function stringToBytes32(str: string): string {
//     const strBytes = ethers.utils.toUtf8Bytes(str);
//     const paddedBytes = ethers.utils.hexlify(
//         ethers.utils.concat([
//             strBytes,
//             ethers.constants.HashZero,
//         ]).slice(0, 32)
//     );
//     return paddedBytes;
// }

// function bytes32ToUint8Array(bytes32) {
//     const hexString = bytes32.slice(2); // remove the '0x' prefix
//     const uint8Array = new Array(32);
//     for (let i = 0; i < 32; i++) {
//         const hexByte = hexString.slice(i * 2, i * 2 + 2);
//         uint8Array[i] = parseInt(hexByte, 16);
//     }
//     console.log(uint8Array);
//     return uint8Array;

// }
// async function getChainConfig(): Promise<ChainConfig[]> {
//     try {
//         const response = await fetch(LCD_URL);
//         const chainConfig = await response.json();
//         return chainConfig.chainConfig;
//     } catch (e: any) {
//         return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
//     }
// }
// async function getContractConfig(): Promise<ContractConfig[]> {
//     try {
//         const response = await fetch(LCD_URL_CONTRACT_CONFIG);
//         const chainConfig = await response.json();
//         return chainConfig.contractConfig;
//     } catch (e: any) {
//         return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
//     }
// }


// let chainClients: ChainClients = {};
// let nearContract: Contract;
// export async function main(): Promise<Transaction[]> {
//     // near setup
//     const nearConnection = await connect(connectionConfig);
//     const account = await nearConnection.account("joydeeeep.testnet");

//     nearContract = new Contract(
//         account,
//         "asset_forwarder_testnet.router_protocol.testnet",
//         {
//             viewMethods: ["get_execute_record"],
//             changeMethods: ["method_name"],
//         }
//     );

//     let chainConfig: ChainConfig[];
//     chainConfig = await getChainConfig();
//     const rpcAndContractAddress: Rpc =
//         getRpcFromEnv();

//     let contractConfig: ContractConfig[] = await getContractConfig();
//     contractConfig = contractConfig.filter((config) => config.contract_enabled && config.contractType === "VOYAGER");
//     chainConfig.forEach((chainConfig) => {
//         const rpc = rpcAndContractAddress[chainConfig.chainId]?.rpc;
//         let contractAddress =
//             contractConfig.find((config) => config.chainId === chainConfig.chainId)?.contractAddress;
//         if (chainConfig.chainId === "2494104990") {
//             contractAddress = TronWeb.address.toHex(contractAddress);
//             // replace "41" in start with "0x"
//             contractAddress = "0x" + contractAddress.slice(2);
//         }
//         if (!rpc || !contractAddress) {
//             console.error(
//                 `Rpc and contract address not found for chainId: ${chainConfig.chainId}`
//             );
//             return [];
//         }
//         const chainClient = new ChainClient(chainConfig, rpc, contractAddress);
//         chainClients[chainConfig.chainId] = chainClient;
//     });
//     return await fetchTransactions();
// }
// // main();
// function sendAlertToSlack(message: string) {
//     const payload = {
//         text: message,
//     };

//     fetch(SLACK_WEBHOOK_URL, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//     })
//         .then((response: any) => {
//             if (!response.ok) {
//                 throw new Error("Failed to send alert to Slack");
//             } else {
//                 console.log("Sent alert to slack!");
//             }
//         })
//         .catch((error: any) => {
//             console.error("Error sending alert to Slack:", error);
//         });
// }
// main()