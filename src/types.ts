export interface Transaction {
    _id: string;
    created_timestamp: string;
    forwarder_address: string;
    src_tx_hash: string;
    dest_tx_hash: string;
    src_chain_id: string;
    src_symbol: string;
    src_amount: string;
    dest_chain_id: string;
    src_stable_address: string;
    dest_symbol: string;
    dest_amount: string;
    deposit_id: string;
    dest_stable_amount: string;
    src_stable_amount: string;
    recipient_address: string;
    sender_address: string;
    src_address: string;
    status: string;
    message: string;
    message_hash: string;
    depositor_address: string;
    src_stable_symbol: string;
    src_chain_name: string;
    error?: string;
}
export interface Rpc {
    [chainId: string]: {
        rpc: string;
    };
}
export interface ChainConfig {
    chainId: string;
    chainName: string;
    symbol: string;
    native_decimals: string;
    chainType: string;
    confirmationsRequired: string;
    lastObservedValsetNonce: string;
    chain_enabled: boolean;
}

export interface ContractConfig {
    chainId: string;
    contractAddress: string;
    contract_enabled: boolean;
    contractType: string;
}

export interface GasPrice {
    price: string;
    decimals: string;
}
export interface GasPrices {
    [chainId: string]: GasPrice;
}
export interface TokenPrice {
    price: string;
    decimals: string;
}
export interface TokenPrices {
    [symbol: string]: TokenPrice;
}