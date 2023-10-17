import { ChainGrpcWasmApi, ChainInfo, NetworkEndpoints, getNetworkInfo, getNetworkType, toUtf8, } from "@routerprotocol/router-chain-sdk-ts";
import { ROUTER_CHAIN_EXPLORER_ENVIRONMENT } from "../constant";
import ChainClient from ".";


export default class RouterChainClient extends ChainClient {
    network: ChainInfo & NetworkEndpoints;
    wasmClient: ChainGrpcWasmApi;
    contractAddress: string;
    cachedTokensConfig: any;
    constructor(contractAddress: string, networkType: string = ROUTER_CHAIN_EXPLORER_ENVIRONMENT) {
        super();
        this.network = getNetworkInfo(
            getNetworkType(networkType)
        );
        this.wasmClient = new ChainGrpcWasmApi(this.network.grpcEndpoint);
        this.contractAddress = contractAddress;
        this.cachedTokensConfig = {};
    }
    async handleQueryContract(
        queryObj: Record<string, unknown>
    ): Promise<any> {
        try {
            const queryResult = await this.wasmClient.fetchSmartContractState(
                this.contractAddress,
                toUtf8(JSON.stringify(queryObj))
            )
            return queryResult;
        } catch (e: any) {
            return e.hasOwnProperty("message") ? e.message : JSON.stringify(e);
        }
    }
    async getExecuteRecord(claimId: string): Promise<any> {
        const queryObj = {
            get_execute_record: {
                message_hash: claimId,
            },
        };
        const result = await this.handleQueryContract(
            queryObj
        );
        return result;
    }
    // fetch_tokens_config
    async fetchTokensConfig(): Promise<any> {
        const queryObj = {
            fetch_tokens_config: {},
        };
        const result = await this.handleQueryContract(
            queryObj
        );
        return result;
    }
    // fetch_token_config
    async fetchDestToken(srcChainId: string, destChainId: string, srcToken: string): Promise<any> {
        if (this.cachedTokensConfig[srcChainId + "-" + destChainId + "-" + srcToken.toLowerCase()]) {
            return this.cachedTokensConfig[srcChainId + "-" + destChainId + "-" + srcToken.toLowerCase()];
        }
        const queryObj = {
            fetch_dest_token: {
                src_chain_id: srcChainId,
                dest_chain_id: destChainId,
                src_token: srcToken.toLowerCase(),
            },
        };
        const result = await this.handleQueryContract(
            queryObj
        );
        this.cachedTokensConfig[srcChainId + "-" + destChainId + "-" + srcToken.toLowerCase()] = result;
        return result;
    }
    getContractAddress(): string {
        return this.contractAddress;
    }
    getChainName(): string {
        return "router";
    }
}