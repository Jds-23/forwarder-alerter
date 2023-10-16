import express, { Request, Response } from 'express';
import main from "../main"
import cors from 'cors';

const app = express();
const PORT = 3000;


// Enable CORS for all routes
app.use(cors());

app.get('/pending-transactions', async (req: Request, res: Response) => {
    try {
        const transactions = await main();
        console.log(transactions);
        res.json({ success: true, data: transactions });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});