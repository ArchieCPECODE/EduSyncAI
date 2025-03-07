const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch").default;
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const COHERE_API_KEY = process.env.COHERE_API_KEY;

if (!COHERE_API_KEY) {
    console.error("⚠️ ERROR: Missing Cohere API Key in .env file!");
    process.exit(1);
}

// ✅ Fix: Add a root route to prevent "Cannot GET /" error
app.get("/", (req, res) => {
    res.send("EduSync AI backend is live! Use the /chat endpoint for AI responses.");
});

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    const userMessage = prompt.trim().toLowerCase();

    if (userMessage.includes("who are you") || userMessage.includes("what is edusync")) {
        return res.json({ response: "I am EduSync AI, created by Archie Abona and powered by Cohere." });
    }

    try {
        const response = await fetch("https://api.cohere.ai/v1/generate", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${COHERE_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "command",
                prompt: `Your name is EduSync AI, an assistant created by Archie Abona. Never refer to yourself as \"Coral\". Here is the user query: ${prompt}`,
                max_tokens: 100
            })
        });

        const data = await response.json();

        if (!data.generations || data.generations.length === 0) {
            return res.status(500).json({ error: "No AI response received" });
        }

        res.json({ response: data.generations[0].text.trim() });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "AI request failed", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
