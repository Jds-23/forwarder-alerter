import { ChainConfig } from "../types";

export interface ChainClients {
    [chainId: string]: ChainClient;
}

export default abstract class ChainClient {
    abstract getExecuteRecord(claimId: string): Promise<any>;  // Abstract method
    abstract getContractAddress(): string;  // Abstract method
    abstract getChainName(): string;  // Abstract method
    abstract getChainConfig(): ChainConfig;  // Abstract method
    abstract estimateGas(amount: string, srcChainId: string, depositId: string, destToken: string, recipient: string, depositor: string, message?: string | null): Promise<[string | undefined, string | undefined]>
}