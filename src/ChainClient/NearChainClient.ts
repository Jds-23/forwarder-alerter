import nearAPI, { Contract } from "near-api-js";
import { NEAR_CREDENTIALS_PATH, NEAR_RPC_URL, NEAR_ACCOUNT_ID } from "../constant";
import ChainClient from ".";

const { keyStores, connect } = nearAPI;
const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(NEAR_CREDENTIALS_PATH);

const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore, // first create a key store 
    nodeUrl: NEAR_RPC_URL,
};

export class NearChainClient extends ChainClient {
    contract: Contract;
    contractAddress: string;
    constructor(contractAddress: string) {
        super();
        this.init(contractAddress);
    }

    private async init(contractAddress: string): Promise<void> {
        // near setup
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
            // @ts-ignore
            const result = await nearContract.get_execute_record({ message_hash: bytes32ToUint8Array(claimId) });
            return result;
        } catch (e: any) {
            return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
        }
    }

}
