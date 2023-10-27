import { QUERY_URL } from "../constant";
const HEADERS = {
    "Content-Type": "application/json",
};
export default async function fetchGraphQLTransactions(): Promise<any> {
    const now = new Date();
    const timestampBefore1Hour = new Date(now.getTime() - 60 * 60 * 1000);
    const timestampBefore1HourInSeconds = Math.floor(timestampBefore1Hour.getTime() / 1000);
    const requestBody = {
        query: `
            query Query {
                transactions(filter:{depositor_address:{ne:null},status:{eq:"pending"},created_timestamp:{gt:${timestampBefore1HourInSeconds}}}) {
                    data {
                        _id
                        created_timestamp
                        src_chain_id
                        dest_chain_id
                        src_stable_address
                        src_stable_amount
                        dest_stable_amount
                        deposit_id
                        recipient_address
                        depositor_address
                        message
                        dest_chain_id
                        src_stable_symbol
                        src_tx_hash
                    }
                }
            }
        `,
    };

    const response = await fetch(QUERY_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error(JSON.stringify(response));
    }

    const data = await response.json();
    return data?.data?.transactions?.data || [];
}