import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const COHERE_API_KEY = process.env.COHERE_API_KEY;

// Ensure API Key exists
if (!COHERE_API_KEY) {
  console.error("❌ Missing COHERE_API_KEY. Set it in your environment variables.");
  process.exit(1);
}

// ✅ Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// ✅ API Route for Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: req.body.message,
        max_tokens: 50
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    res.json({ reply: data.generations[0].text });
  } catch (error) {
    console.error("🔥 API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
