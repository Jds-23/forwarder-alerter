import { Contract } from "near-api-js";
import { NEAR_ACCOUNT_ID } from "../constant";
import ChainClient from ".";
import { bytes32ToUint8Array } from "../utils";
import { ChainConfig } from "../types";
const nearAPI = require("near-api-js");

const { connect } = nearAPI;
// const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(NEAR_CREDENTIALS_PATH);

export class NearChainClient extends ChainClient {
    chainConfig: ChainConfig;
    rpc: string;
    contract: Contract | null;
    contractAddress: string;
    constructor(chainConfig: ChainConfig, rpc: string, contractAddress: string) {
        super();
        this.contract = null;
        this.contractAddress = contractAddress;
        this.chainConfig = chainConfig;
        this.rpc = rpc;
        this.init(contractAddress);
    }

    private async init(contractAddress: string): Promise<void> {
        // near setup
        const connectionConfig = {
            networkId: "testnet",
            // networkId: this.chainConfig.chainId,
            // keyStore: myKeyStore, // first create a key store 
            nodeUrl: this.rpc,
            // walletUrl: "https://wallet.testnet.near.org",
            // helperUrl: "https://helper.testnet.near.org",
            // explorerUrl: "https://explorer.testnet.near.org",
        };
        const nearConnection = await connect(connectionConfig);
        const account = await nearConnection.account(NEAR_ACCOUNT_ID);

        this.contract = new Contract(
            account,
            contractAddress,
            {
                viewMethods: ["get_execute_record"],
                changeMethods: [],
            }
        );
    }

    async getExecuteRecord(claimId: string): Promise<any> {
        try {
            if (!this.contract) {
                await this.init(this.contractAddress);
            }
            if (!this.contract) {
                throw new Error("Contract not initialized");
            }
            // @ts-ignore
            const result = await this.contract.get_execute_record({ message_hash: bytes32ToUint8Array(claimId) });
            return result;
        } catch (e: any) {
            return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
        }
    }
    async estimateGas(): Promise<any> {
        try {
            return [undefined, "Estimate not available"];
        } catch (e: any) {
            return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
        }
    }
    getContractAddress(): string {
        return this.contractAddress;
    }
    getChainName(): string {
        return this.chainConfig.chainName;
    }
}
