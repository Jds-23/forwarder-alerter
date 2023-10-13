"use strict";
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
var router_chain_sdk_ts_1 = require("@routerprotocol/router-chain-sdk-ts");
var ethers_1 = require("ethers");
var fs = require("fs");
var path = require("path");
var fetch = require("node-fetch");
function getRpcAndContractAddress() {
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
    var byteQueryMsg = JSON.stringify(queryMsg);
    return queryMsg;
}
var ChainClient = /** @class */ (function () {
    function ChainClient(chainConfig, rpc, contractAddress, dexSpan) {
        this.chainConfig = chainConfig;
        var provider = new ethers_1.ethers.providers.JsonRpcProvider(rpc);
        this.contractAddress = contractAddress;
        this.client = new ethers_1.ethers.Contract(contractAddress, abi, provider);
        this.dexSpan = dexSpan;
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
var CHAIN_ID_CHAIN_NAME_MAP = {
    "80001": "Mumbai",
    "43113": "Fuji",
};
function fetchTransactions() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var requestBody, response, data, transactions, currentTime_1, transactionsOver1hr, tokenConfigResult, tokenConfig_1, results, error_1;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    requestBody = {
                        query: "\n            query Query {\n                transactions(where: {src_chain_id:\"80001\",dest_chain_id:\"43113\"}) {\n                    data {\n                        _id\n                        created_timestamp\n                        forwarder_address\n                        src_tx_hash\n                        dest_tx_hash\n                        src_chain_id\n                        src_symbol\n                        src_amount\n                        dest_chain_id\n                        dest_symbol\n                        dest_amount\n                        deposit_id\n                        dest_stable_amount\n                        src_stable_address\n                        recipient_address\n                        sender_address\n                        src_address\n                        status\n                        message\n                        message_hash\n                    }\n                }\n            }\n        ",
                    };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch(QUERY_URL, {
                            method: "POST",
                            headers: HEADERS,
                            body: JSON.stringify(requestBody),
                        })];
                case 2:
                    response = _c.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _c.sent();
                    transactions = ((_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.transactions) === null || _b === void 0 ? void 0 : _b.data) || [];
                    console.log(transactions.length, "transactions found of pending status");
                    currentTime_1 = Date.now();
                    transactionsOver1hr = transactions.filter(function (transaction) {
                        if (currentTime_1 - new Date(transaction.created_timestamp).getTime() >
                            3600000) {
                            return true;
                        }
                        return false;
                    });
                    return [4 /*yield*/, handleQueryContract(VOYAGER_MIDDLEWARE_ADDRESS, {
                            fetch_tokens_config: {},
                        })];
                case 4:
                    tokenConfigResult = _c.sent();
                    tokenConfig_1 = tokenConfigResult === null || tokenConfigResult === void 0 ? void 0 : tokenConfigResult.data;
                    return [4 /*yield*/, Promise.all(transactionsOver1hr.map(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
                            var queryMsg, queryResult, Depositor, claimId, result;
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            return __generator(this, function (_l) {
                                switch (_l.label) {
                                    case 0:
                                        queryMsg = getTokenMappingMsg(transaction.src_chain_id, transaction.dest_chain_id, transaction.src_stable_address.toLowerCase());
                                        return [4 /*yield*/, handleQueryContract(VOYAGER_MIDDLEWARE_ADDRESS, queryMsg)];
                                    case 1:
                                        queryResult = _l.sent();
                                        if (!(queryResult === null || queryResult === void 0 ? void 0 : queryResult.data))
                                            return [2 /*return*/];
                                        Depositor = transaction.src_address === transaction.src_stable_address ? (_a = transaction.sender_address) === null || _a === void 0 ? void 0 : _a.toLowerCase() : (_b = chainClients[transaction.src_chain_id]) === null || _b === void 0 ? void 0 : _b.dexSpan;
                                        return [4 /*yield*/, getIRelayClaimId({
                                                Amount: normalizeAmount(transaction.dest_stable_amount, transaction.dest_chain_id, (_c = queryResult === null || queryResult === void 0 ? void 0 : queryResult.data) === null || _c === void 0 ? void 0 : _c.toLowerCase(), tokenConfig_1),
                                                SrcChainId: transaction.src_chain_id,
                                                DepositId: (_d = transaction.deposit_id) === null || _d === void 0 ? void 0 : _d.toLowerCase(),
                                                DestToken: (_e = queryResult === null || queryResult === void 0 ? void 0 : queryResult.data) === null || _e === void 0 ? void 0 : _e.toLowerCase(),
                                                Recipient: (_f = transaction.recipient_address) === null || _f === void 0 ? void 0 : _f.toLowerCase(),
                                                Depositor: Depositor.toLowerCase(),
                                            }, (_g = chainClients[transaction.dest_chain_id]) === null || _g === void 0 ? void 0 : _g.contractAddress, (_j = (_h = transaction.message) === null || _h === void 0 ? void 0 : _h.toLowerCase()) !== null && _j !== void 0 ? _j : null)];
                                    case 2:
                                        claimId = _l.sent();
                                        return [4 /*yield*/, ((_k = chainClients[transaction.dest_chain_id]) === null || _k === void 0 ? void 0 : _k.callExecuteRecord(claimId))];
                                    case 3:
                                        result = _l.sent();
                                        console.log("result", transaction.status, claimId, result);
                                        return [2 /*return*/, result];
                                }
                            });
                        }); }))];
                case 5:
                    results = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _c.sent();
                    console.error("Error fetching transactions:", error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function normalizeAmount(amount, chainId, tokenAddress, tokenConfigs) {
    var tokenConfig = tokenConfigs.find(function (tokenConfig) {
        // @ts-ignore
        return tokenConfig[0].toLowerCase() === chainId && tokenConfig[1].toLowerCase() === tokenAddress.toLowerCase();
    });
    // @ts-ignore
    return typeof (tokenConfig[2]) === "number" ? ethers_1.ethers.utils.parseUnits(amount, tokenConfig[2]).toString() : amount;
}
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
function getIRelayClaimId(msg, voyagerGateway, message) {
    if (message === void 0) { message = null; }
    return __awaiter(this, void 0, void 0, function () {
        var IRELAY_ABI_INTERFACE, data, hash;
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
            if (message) {
                data = IRELAY_ABI_INTERFACE.encode(["uint256", "bytes32", "uint256", "address", "address", "bytes", "address", "bytes"], [
                    msg.Amount,
                    stringToBytes32(msg.SrcChainId),
                    msg.DepositId,
                    msg.DestToken,
                    msg.Recipient,
                    msg.Depositor,
                    voyagerGateway,
                    message,
                ]);
            }
            else {
                data = IRELAY_ABI_INTERFACE.encode(["uint256", "bytes32", "uint256", "address", "address", "bytes", "address"], [
                    msg.Amount,
                    stringToBytes32(msg.SrcChainId),
                    msg.DepositId,
                    msg.DestToken,
                    msg.Recipient,
                    msg.Depositor,
                    voyagerGateway,
                ]);
            }
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
var chainClients = {};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var chainConfig, rpcAndContractAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getChainConfig()];
                case 1:
                    chainConfig = _a.sent();
                    rpcAndContractAddress = getRpcAndContractAddress();
                    chainConfig.forEach(function (chainConfig) {
                        var _a, _b, _c;
                        var rpc = (_a = rpcAndContractAddress[chainConfig.chainId]) === null || _a === void 0 ? void 0 : _a.rpc;
                        var contractAddress = (_b = rpcAndContractAddress[chainConfig.chainId]) === null || _b === void 0 ? void 0 : _b.contractAddress;
                        var dexSpan = (_c = rpcAndContractAddress[chainConfig.chainId]) === null || _c === void 0 ? void 0 : _c.dexSpan;
                        if (!rpc || !contractAddress) {
                            console.error("Rpc and contract address not found for chainId: ".concat(chainConfig.chainId));
                            return;
                        }
                        var chainClient = new ChainClient(chainConfig, rpc, contractAddress, dexSpan);
                        chainClients[chainConfig.chainId] = chainClient;
                    });
                    fetchTransactions();
                    return [2 /*return*/];
            }
        });
    });
}
main();
