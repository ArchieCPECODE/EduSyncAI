const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch").default;
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ Allow requests only from your Vercel frontend
const allowedOrigins = ["https://edu-sync-archiecpecodes-projects.vercel.app"];
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const COHERE_API_KEY = process.env.COHERE_API_KEY;

if (!COHERE_API_KEY) {
    console.error("⚠️ ERROR: Missing Cohere API Key in .env file!");
    process.exit(1);
}

// ✅ Root route to confirm the backend is live
app.get("/", (req, res) => {
    res.send("EduSync AI backend is live! Use the /chat endpoint for AI responses.");
});

// ✅ AI Chat Endpoint
app.post("/chat", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
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

        // ✅ Handle missing response cases
        const aiResponse = data.generations?.[0]?.text?.trim() || "Sorry, I couldn't process that request.";
        
        res.json({ response: aiResponse });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "AI request failed", details: error.message });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
