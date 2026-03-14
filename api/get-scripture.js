const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function handler(req, res) {
  // 1. Check if Vercel is successfully loading your key
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "API key is missing in Vercel environment variables." });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
 // 2. Force Gemini to output strict, machine-readable JSON
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", // <-- Update this line right here
    generationConfig: { responseMimeType: "application/json" }
  });

  const { ref } = req.query; 

  // 3. Update the prompt to provide a strict schema
  const prompt = `You are a devotional assistant. Provide the scripture text for ${ref} in the NIV version. 
                  Then, provide a brief, 2-3 sentence historical context for this passage.
                  Use this exact JSON schema: {"reference": "string", "text": "string", "context": "string"}`;

  try {
    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());
    
    res.status(200).json(data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch or parse scripture" });
  }
};
