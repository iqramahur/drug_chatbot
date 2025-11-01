// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // serves index.html, script.js, etc.

const PORT = 3000;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// ✅ FIXED: Using the standard, stable model for fast text-based chat.
const MODEL = "gemini-2.5-flash"; 

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful pharmacist chatbot. Give safe, clear answers about medicines and interactions. 
                         Always remind users to consult a healthcare professional.\n\nUser: ${userMessage}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("🔹 Gemini API response:", JSON.stringify(data, null, 2));

    // Extract bot’s text response safely
    const botReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Sorry, I couldn’t generate a response.";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ reply: "⚠️ Something went wrong with the Gemini API." });
  }
});

app.listen(PORT, () => console.log(`✅ Gemini bot running on http://localhost:${PORT}`));