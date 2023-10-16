import { Router, Request, Response } from 'express';
import main from '../main';

const routerFetchTransactions = Router();

routerFetchTransactions.get('/pending-transactions', async (req: Request, res: Response) => {
    try {
        const transactions = await main();
        res.json({ success: true, data: transactions });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

export { routerFetchTransactions };