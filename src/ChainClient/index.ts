export interface ChainClients {
    [chainId: string]: ChainClient;
}

export default abstract class ChainClient {
    abstract getExecuteRecord(claimId: string): Promise<any>;  // Abstract method
    abstract getContractAddress(): string;  // Abstract method
}