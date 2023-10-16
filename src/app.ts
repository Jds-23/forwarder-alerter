import express, { Request, Response } from 'express';
import cors from 'cors';
import { routerFetchTransactions } from './routes';
import * as path from 'path';

require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 6900;


// Enable CORS for all routes
app.use(cors());

app.use('/', routerFetchTransactions);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Is this working?');
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});