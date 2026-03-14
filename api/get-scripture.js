// api/get-scripture.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const { topic } = req.query; // Get the topic from the URL (e.g., ?topic=Peace)

  const prompt = `Provide a Bible verse about ${topic || 'faith'}. 
                  Return ONLY a JSON object with keys: "reference", "text", and "context". 
                  No markdown formatting.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text());
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scripture" });
  }
}
