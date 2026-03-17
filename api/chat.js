// api/chat.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function handler(req, res) {
  // Only allow POST requests so we can securely send the chat history
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "API key is missing." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    // Grab the history and the new message from the frontend
    const { history, message } = req.body; 

    // Start a chat session using the past messages
    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
};
