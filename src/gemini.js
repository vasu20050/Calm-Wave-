const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini
// Ensure API key is present
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Vision Analysis (Look at webcam frame)
async function analyzeImage(base64Image) {
    try {
        // Use the latest flash model which is faster and cheaper
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        
        // Clean the base64 string
        const imageParts = [
            {
                inlineData: {
                    data: base64Image.split(',')[1],
                    mimeType: "image/jpeg",
                },
            },
        ];

        const prompt = `
            Analyze the facial expression and environment in this webcam frame. 
            Return ONLY a raw JSON object (no markdown formatting, no backticks) with this structure:
            {
                "vibe": "A short 1-2 word mood description with an emoji",
                "focusScore": A number between 0-100 based on eye contact,
                "feedback": "A single sentence insightful observation."
            }
        `;

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = result.response;
        let text = response.text();
        
        // Clean up markdown if Gemini adds it (e.g. ```json ... ```)
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(text);

    } catch (error) {
        console.error("AI Vision Error:", error);
        // Return fallback data so the app doesn't crash
        return { vibe: "Neutral 😐", focusScore: 50, feedback: "AI is calibrating (Check Server Logs)" };
    }
}

// 2. Chat Logic
async function chatWithAI(userMessage, currentVibe) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        
        const systemContext = `
            You are MoodLift, a helpful wellness AI.
            The user currently appears to be: ${currentVibe}.
            Keep your response short (under 2 sentences), empathetic, and friendly.
        `;
        
        const result = await model.generateContent(`${systemContext}\nUser says: ${userMessage}`);
        return result.response.text();
    } catch (error) {
        console.error("AI Chat Error:", error);
        return "I'm having trouble connecting to the AI model right now. Please check the server logs.";
    }
}

module.exports = { analyzeImage, chatWithAI };