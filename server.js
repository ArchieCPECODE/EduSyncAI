import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const cohere = new CohereClient({ apiKey: process.env.COHERE_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await cohere.generate({
            model: 'command-r',
            prompt: message,
        });
        res.json({ reply: response.generations[0].text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: 'Error connecting to AI.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
