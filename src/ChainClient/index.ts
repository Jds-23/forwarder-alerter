export interface ChainClients {
    [chainId: string]: ChainClient;
}

export default abstract class ChainClient {
    chainId: string;
    contractAddress: string;
    abstract getExecuteRecord(claimId: string): Promise<any>;  // Abstract method
}