import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { hdfcWebhookValidationMiddleware } from './middlewares/hdfc-webhook-zod';
import { hdfcWebhookController } from './controllers/hdfc-webhook-controller';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors({
    credentials: true
}))

app.post('/api/hdfc-webhook', hdfcWebhookValidationMiddleware, hdfcWebhookController);

app.listen(PORT, () => {
    console.log("Server listening at port: " + PORT + "\nServer URL : http://localhost:" + PORT);
});