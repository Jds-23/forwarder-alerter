import { LCD_URL, LCD_URL_CONTRACT_CONFIG } from "../constant";
import { ChainConfig, ContractConfig, Rpc } from "../types";
import { ethers } from "ethers";
const TronWeb = require('tronweb');


export function getRpcFromEnv(): Rpc {
    const data = {
        "80001": {
            "rpc": process.env.MATIC_RPC ?? "",
        },
        "43113": {
            "rpc": process.env.FUJI_RPC ?? "",
        },
        "5": {
            "rpc": process.env.GOERLI_RPC ?? "",
        },
        "2494104990": {
            "rpc": process.env.TRON_RPC ?? "",
        },
        "near-testnet": {
            "rpc": process.env.NEAR_RPC_URL ?? "",
        },
    };
    return data;
}

export function normalizeAmount(amount: string, chainId: string, tokenAddress: string,
    tokenConfigs: [][]
): string {
    const tokenConfig = tokenConfigs.find((tokenConfig) => {
        // @ts-ignore
        return tokenConfig[0].toLowerCase() === chainId && tokenConfig[1].toLowerCase() === tokenAddress.toLowerCase();
    });
    // @ts-ignore
    return typeof (tokenConfig[2]) === "number" ? ethers.utils.parseUnits(trim_decimal_overflow(amount, tokenConfig[2]), tokenConfig[2]).toString() : "0";
}
function trim_decimal_overflow(n: string, decimals: number) {

    if (n.indexOf(".") === -1) return n

    const arr = n.split(".");
    const fraction = arr[1].substring(0, decimals);
    return arr[0] + "." + fraction;
}

export function getIRelayClaimId(
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
): string | undefined {
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
        console.error("Missing parameter", msg, voyagerGateway);
        return undefined;
    }
    const IRELAY_ABI_INTERFACE = new ethers.utils.AbiCoder();
    let types: string[];
    let values: string[];
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
    } else {
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
    const data = IRELAY_ABI_INTERFACE.encode(
        types, values)
    const hash = ethers.utils.keccak256(data);
    return hash;
}

export function stringToBytes32(str: string): string {
    const strBytes = ethers.utils.toUtf8Bytes(str);
    const paddedBytes = ethers.utils.hexlify(
        ethers.utils.concat([
            strBytes,
            ethers.constants.HashZero,
        ]).slice(0, 32)
    );
    return paddedBytes;
}

export function bytes32ToUint8Array(bytes32: string) {
    const hexString = bytes32.slice(2); // remove the '0x' prefix
    const uint8Array = new Array(32);
    for (let i = 0; i < 32; i++) {
        const hexByte = hexString.slice(i * 2, i * 2 + 2);
        uint8Array[i] = parseInt(hexByte, 16);
    }
    return uint8Array;
}
export async function getChainConfig(): Promise<ChainConfig[]> {
    try {
        const response = await fetch(LCD_URL);
        const chainConfig = await response.json();
        return chainConfig.chainConfig;
    } catch (e: any) {
        return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
    }
}
export async function getContractConfig(): Promise<ContractConfig[]> {
    try {
        const response = await fetch(LCD_URL_CONTRACT_CONFIG);
        const chainConfig: {
            contractConfig: ContractConfig[];
        } = await response.json();
        return chainConfig.contractConfig.filter((config) => config.contract_enabled && config.contractType === "VOYAGER");
    } catch (e: any) {
        return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
    }
}

export function TronAddressToHex(address: string): string {
    const contractAddress = TronWeb.address.toHex(address);
    // replace "41" in start with "0x"
    return "0x" + contractAddress.slice(2);
}