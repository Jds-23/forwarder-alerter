"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var router_chain_sdk_ts_1 = require("@routerprotocol/router-chain-sdk-ts");
var ethers_1 = require("ethers");
var fs = __importStar(require("fs"));
var near_api_js_1 = require("near-api-js");
var path = __importStar(require("path"));
var fetch = require("node-fetch");
var nearAPI = require("near-api-js");
var TronWeb = require('tronweb');
var keyStores = nearAPI.keyStores, connect = nearAPI.connect;
var CREDENTIALS_PATH = "/Users/joydeepsingha/.near-credentials/testnet/joydeeeep.testnet.json";
var myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(CREDENTIALS_PATH);
var connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};
function getRpc() {
    var filePath = path.join(__dirname, './rpcAndContractAddress.json');
    var rawData = fs.readFileSync(filePath, 'utf-8');
    var data = JSON.parse(rawData);
    return data;
}
var QUERY_URL = "https://api.iswap-explorer-testnet.routerprotocol.com/graphql";
// const QUERY_URL = "https://api.iswap-explorer-testnet.routerprotocol.com/graphql";
var SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";
var TRANSACTION_URL = "https://d2apf6ujtzwln8.cloudfront.net/swap/tx/";
var LCD_URL = "https://lcd.testnet.routerchain.dev/router-protocol/router-chain/multichain/chain_config";
var LCD_URL_CONTRACT_CONFIG = "https://lcd.testnet.routerchain.dev/router-protocol/router-chain/multichain/contract_config";
var ROUTER_CHAIN_EXPLORER_ENVIRONMENT = "testnet-eu";
var VOYAGER_MIDDLEWARE_ADDRESS = "router17hlelrccxutnpe6u0gw2tk52f6ekrwenmz9amyhhfsq2v24mhkzquuwu99";
var ROUTER_MULTICALLER = "router1wr6vc3g4caz9aclgjacxewr0pjlre9wl2uhq73rp8mawwmqaczsq08nnup";
var abi = [
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
function getTokenMappingMsg(srcChainId, destChainId, srcToken) {
    var queryMsg = {
        fetch_dest_token: {
            src_chain_id: srcChainId,
            dest_chain_id: destChainId,
            src_token: srcToken.toLowerCase(),
        },
    };
    return queryMsg;
}
var ChainClient = /** @class */ (function () {
    function ChainClient(chainConfig, rpc, contractAddress) {
        this.chainConfig = chainConfig;
        var provider = new ethers_1.ethers.providers.JsonRpcProvider(rpc);
        this.contractAddress = contractAddress;
        this.client = new ethers_1.ethers.Contract(contractAddress, abi, provider);
    }
    ChainClient.prototype.getEventLogs = function (transactionHash) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.provider.getLogs({
                                fromBlock: 0,
                                toBlock: "latest",
                                address: this.client.address,
                                topics: [transactionHash],
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        e_1 = _a.sent();
                        console.log(this.chainConfig.chainId);
                        return [2 /*return*/, e_1.hasOwnProperty("message") ? e_1.message : JSON.stringify(e_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChainClient.prototype.callExecuteRecord = function (bytes32) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.executeRecord(bytes32)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        e_2 = _a.sent();
                        return [2 /*return*/, e_2.hasOwnProperty("message") ? e_2.message : JSON.stringify(e_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ChainClient;
}());
var handleQueryContract = function (contractAddress, queryObj) { return __awaiter(void 0, void 0, void 0, function () {
    var network, wasmClient, queryResult, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                network = (0, router_chain_sdk_ts_1.getNetworkInfo)((0, router_chain_sdk_ts_1.getNetworkType)(ROUTER_CHAIN_EXPLORER_ENVIRONMENT));
                wasmClient = new router_chain_sdk_ts_1.ChainGrpcWasmApi(network.grpcEndpoint);
                return [4 /*yield*/, wasmClient.fetchSmartContractState(contractAddress, (0, router_chain_sdk_ts_1.toUtf8)(JSON.stringify(queryObj)))];
            case 1:
                queryResult = _a.sent();
                return [2 /*return*/, queryResult];
            case 2:
                e_3 = _a.sent();
                return [2 /*return*/, e_3.hasOwnProperty("message") ? e_3.message : JSON.stringify(e_3)];
            case 3: return [2 /*return*/];
        }
    });
}); };
var HEADERS = {
    "Content-Type": "application/json",
};
var ONE_HOUR_IN_MS = 3600000;
function fetchGraphQLTransactions() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var requestBody, response, data;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    requestBody = {
                        query: "\n            query Query {\n                transactions(filter:{depositor_address:{ne:null},status:{eq:\"pending\"}}) {\n                    data {\n                        _id\n                        created_timestamp\n                        src_chain_id\n                        dest_chain_id\n                        src_stable_address\n                        dest_stable_amount\n                        deposit_id\n                        recipient_address\n                        depositor_address\n                        message\n                        dest_chain_id\n                    }\n                }\n            }\n        ",
                    };
                    return [4 /*yield*/, fetch(QUERY_URL, {
                            method: "POST",
                            headers: HEADERS,
                            body: JSON.stringify(requestBody),
                        })];
                case 1:
                    response = _c.sent();
                    if (!response.ok) {
                        throw new Error('Failed to fetch transactions');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _c.sent();
                    return [2 /*return*/, ((_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.transactions) === null || _b === void 0 ? void 0 : _b.data) || []];
            }
        });
    });
}
function getTransactionsOver1hr(transactions) {
    return __awaiter(this, void 0, void 0, function () {
        var currentTime;
        return __generator(this, function (_a) {
            currentTime = Date.now();
            return [2 /*return*/, transactions.filter(function (transaction) { return currentTime - new Date(transaction.created_timestamp).getTime() > ONE_HOUR_IN_MS; })];
        });
    });
}
function fetchTransactions() {
    return __awaiter(this, void 0, void 0, function () {
        var transactions, transactionsOver1hr, tokenConfigResult, tokenConfig_1, results, transactionsToAlert, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetchGraphQLTransactions()];
                case 1:
                    transactions = _a.sent();
                    console.log(transactions.length, "transactions found of pending status");
                    return [4 /*yield*/, getTransactionsOver1hr(transactions)];
                case 2:
                    transactionsOver1hr = _a.sent();
                    return [4 /*yield*/, handleQueryContract(VOYAGER_MIDDLEWARE_ADDRESS, { fetch_tokens_config: {} })];
                case 3:
                    tokenConfigResult = _a.sent();
                    tokenConfig_1 = tokenConfigResult === null || tokenConfigResult === void 0 ? void 0 : tokenConfigResult.data;
                    return [4 /*yield*/, Promise.all(transactionsOver1hr.map(function (transaction) { return processTransaction(transaction, tokenConfig_1); }))];
                case 4:
                    results = _a.sent();
                    transactionsToAlert = results.filter(function (result) { return result !== undefined; });
                    console.log(transactionsToAlert.length, "transactions found of pending status for more than 1hr");
                    return [2 /*return*/, transactionsToAlert];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error fetching transactions:", error_1);
                    return [2 /*return*/, []];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function processTransaction(transaction, tokenConfig) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function () {
        var queryMsg, queryResult, claimId, result, error_2;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 7, , 8]);
                    queryMsg = getTokenMappingMsg(transaction.src_chain_id, transaction.dest_chain_id, transaction.src_stable_address.toLowerCase());
                    return [4 /*yield*/, handleQueryContract(VOYAGER_MIDDLEWARE_ADDRESS, queryMsg)];
                case 1:
                    queryResult = _h.sent();
                    if (!(queryResult === null || queryResult === void 0 ? void 0 : queryResult.data))
                        return [2 /*return*/, undefined];
                    return [4 /*yield*/, getIRelayClaimId({
                            Amount: normalizeAmount(transaction.dest_stable_amount, transaction.dest_chain_id, (_a = queryResult === null || queryResult === void 0 ? void 0 : queryResult.data) === null || _a === void 0 ? void 0 : _a.toLowerCase(), tokenConfig),
                            SrcChainId: transaction.src_chain_id,
                            DepositId: (_b = transaction.deposit_id) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
                            DestToken: (_c = queryResult === null || queryResult === void 0 ? void 0 : queryResult.data) === null || _c === void 0 ? void 0 : _c.toLowerCase(),
                            Recipient: (_d = transaction.recipient_address) === null || _d === void 0 ? void 0 : _d.toLowerCase(),
                            Depositor: transaction.depositor_address.toLowerCase(),
                        }, getVoyagerAddress(transaction), (_f = (_e = transaction.message) === null || _e === void 0 ? void 0 : _e.toLowerCase()) !== null && _f !== void 0 ? _f : null)];
                case 2:
                    claimId = _h.sent();
                    result = void 0;
                    if (!(transaction.dest_chain_id === "near-testnet")) return [3 /*break*/, 4];
                    return [4 /*yield*/, nearContract.get_execute_record({ message_hash: bytes32ToUint8Array(claimId) })];
                case 3:
                    // @ts-ignore
                    result = _h.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, ((_g = chainClients[transaction.dest_chain_id]) === null || _g === void 0 ? void 0 : _g.callExecuteRecord(claimId))];
                case 5:
                    result = _h.sent();
                    _h.label = 6;
                case 6: return [2 /*return*/, result ? undefined : transaction];
                case 7:
                    error_2 = _h.sent();
                    console.error("Error processing transaction:", error_2);
                    return [2 /*return*/, undefined];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function getVoyagerAddress(transaction) {
    var _a;
    return transaction.dest_chain_id === "near-testnet" ? "asset_forwarder_testnet.router_protocol.testnet" : (_a = chainClients[transaction.dest_chain_id]) === null || _a === void 0 ? void 0 : _a.contractAddress;
}
function normalizeAmount(amount, chainId, tokenAddress, tokenConfigs) {
    var tokenConfig = tokenConfigs.find(function (tokenConfig) {
        // @ts-ignore
        return tokenConfig[0].toLowerCase() === chainId && tokenConfig[1].toLowerCase() === tokenAddress.toLowerCase();
    });
    // @ts-ignore
    return typeof (tokenConfig[2]) === "number" ? ethers_1.ethers.utils.parseUnits(amount, tokenConfig[2]).toString() : amount;
}
function getIRelayClaimId(msg, voyagerGateway, message) {
    if (message === void 0) { message = null; }
    return __awaiter(this, void 0, void 0, function () {
        var IRELAY_ABI_INTERFACE, types, values, data, hash;
        return __generator(this, function (_a) {
            // check all are defined
            if (!msg.Amount ||
                !msg.SrcChainId ||
                !msg.DepositId ||
                !msg.DestToken ||
                !msg.Recipient ||
                !msg.Depositor ||
                !voyagerGateway) {
                console.log(msg, voyagerGateway);
                throw new Error("Missing parameter");
            }
            IRELAY_ABI_INTERFACE = new ethers_1.ethers.utils.AbiCoder();
            if (voyagerGateway === "asset_forwarder_testnet.router_protocol.testnet") {
                types = [
                    "uint256",
                    "bytes32",
                    "uint256",
                    "string",
                    "bytes",
                    "bytes",
                    "string",
                ];
                values = [
                    msg.Amount,
                    stringToBytes32(msg.SrcChainId),
                    msg.DepositId,
                    msg.DestToken,
                    msg.Recipient,
                    msg.Depositor,
                    voyagerGateway
                ];
                if (message) {
                    types.push("bytes");
                    values.push(message);
                }
            }
            else {
                types = [
                    "uint256",
                    "bytes32",
                    "uint256",
                    "address",
                    "address",
                    "bytes",
                    "address",
                ];
                values = [
                    msg.Amount,
                    stringToBytes32(msg.SrcChainId),
                    msg.DepositId,
                    msg.DestToken,
                    msg.Recipient,
                    msg.Depositor,
                    voyagerGateway
                ];
                if (message) {
                    types.push("bytes");
                    values.push(message);
                }
            }
            data = IRELAY_ABI_INTERFACE.encode(types, values);
            hash = ethers_1.ethers.utils.keccak256(data);
            return [2 /*return*/, hash];
        });
    });
}
function stringToBytes32(str) {
    var strBytes = ethers_1.ethers.utils.toUtf8Bytes(str);
    var paddedBytes = ethers_1.ethers.utils.hexlify(ethers_1.ethers.utils.concat([
        strBytes,
        ethers_1.ethers.constants.HashZero,
    ]).slice(0, 32));
    return paddedBytes;
}
function bytes32ToUint8Array(bytes32) {
    var hexString = bytes32.slice(2); // remove the '0x' prefix
    var uint8Array = new Array(32);
    for (var i = 0; i < 32; i++) {
        var hexByte = hexString.slice(i * 2, i * 2 + 2);
        uint8Array[i] = parseInt(hexByte, 16);
    }
    console.log(uint8Array);
    return uint8Array;
}
function getChainConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var response, chainConfig, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(LCD_URL)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    chainConfig = _a.sent();
                    return [2 /*return*/, chainConfig.chainConfig];
                case 3:
                    e_4 = _a.sent();
                    return [2 /*return*/, e_4.hasOwnProperty("message") ? e_4.message : JSON.stringify(e_4)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getContractConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var response, chainConfig, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(LCD_URL_CONTRACT_CONFIG)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    chainConfig = _a.sent();
                    return [2 /*return*/, chainConfig.contractConfig];
                case 3:
                    e_5 = _a.sent();
                    return [2 /*return*/, e_5.hasOwnProperty("message") ? e_5.message : JSON.stringify(e_5)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var chainClients = {};
var nearContract;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var nearConnection, account, chainConfig, rpcAndContractAddress, contractConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connect(connectionConfig)];
                case 1:
                    nearConnection = _a.sent();
                    return [4 /*yield*/, nearConnection.account("joydeeeep.testnet")];
                case 2:
                    account = _a.sent();
                    nearContract = new near_api_js_1.Contract(account, "asset_forwarder_testnet.router_protocol.testnet", {
                        viewMethods: ["get_execute_record"],
                        changeMethods: ["method_name"],
                    });
                    return [4 /*yield*/, getChainConfig()];
                case 3:
                    chainConfig = _a.sent();
                    rpcAndContractAddress = getRpc();
                    return [4 /*yield*/, getContractConfig()];
                case 4:
                    contractConfig = _a.sent();
                    contractConfig = contractConfig.filter(function (config) { return config.contract_enabled && config.contractType === "VOYAGER"; });
                    chainConfig.forEach(function (chainConfig) {
                        var _a, _b;
                        var rpc = (_a = rpcAndContractAddress[chainConfig.chainId]) === null || _a === void 0 ? void 0 : _a.rpc;
                        var contractAddress = (_b = contractConfig.find(function (config) { return config.chainId === chainConfig.chainId; })) === null || _b === void 0 ? void 0 : _b.contractAddress;
                        if (chainConfig.chainId === "2494104990") {
                            contractAddress = TronWeb.address.toHex(contractAddress);
                            // replace "41" in start with "0x"
                            contractAddress = "0x" + contractAddress.slice(2);
                        }
                        if (!rpc || !contractAddress) {
                            console.error("Rpc and contract address not found for chainId: ".concat(chainConfig.chainId));
                            return [];
                        }
                        var chainClient = new ChainClient(chainConfig, rpc, contractAddress);
                        chainClients[chainConfig.chainId] = chainClient;
                    });
                    return [4 /*yield*/, fetchTransactions()];
                case 5: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.main = main;
// main();
function sendAlertToSlack(message) {
    var payload = {
        text: message,
    };
    fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then(function (response) {
        if (!response.ok) {
            throw new Error("Failed to send alert to Slack");
        }
        else {
            console.log("Sent alert to slack!");
        }
    })
        .catch(function (error) {
        console.error("Error sending alert to Slack:", error);
    });
}
main();
