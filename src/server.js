const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. SMART CONFIGURATION ---

// Attempt to load .env file from the parent directory
const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: fs.existsSync(envPath) ? envPath : undefined });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// --- 2. SMART FOLDER DETECTION (The Fix) ---

// Check if 'public' is in the current folder (src/public) OR one level up (moodlift/public)
let publicPath;
const possiblePaths = [
    path.join(__dirname, 'public'),       // Check src/public
    path.join(__dirname, '../public')     // Check moodlift/public
];

// Loop through possible paths to find the one that exists
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        publicPath = p;
        break;
    }
}

// If no folder is found, stop the server with an error
if (!publicPath) {
    console.error("❌ CRITICAL ERROR: Could not find 'public' folder.");
    console.error("   Ensure you have a folder named 'public' with 'index.html' inside.");
    process.exit(1);
}

console.log(`📂 Serving files from: ${publicPath}`);

// --- 3. AI CONFIGURATION ---

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing. Check your .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the latest working Gemini model
const MODEL_NAME = "gemini-2.0-flash"; 
// Fallback model for text-only chat if primary fails
const FALLBACK_MODEL = "gemini-flash-latest";

// AI Function: Vision Analysis
async function analyzeImage(base64Image) {
    const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];
    const imageParts = [{ inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" }}];
    const prompt = `
        Analyze facial expression. 
        Return JSON: { "vibe": "Mood + Emoji", "focusScore": 0-100, "feedback": "One sentence." }
    `;

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent([prompt, ...imageParts]);
            let text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        } catch (error) {
            console.error(`AI Vision Error with ${modelName}:`, error.message);
        }
    }

    return { vibe: "Scanner Cool-down ⚠️", focusScore: 50, feedback: "API Quota reached. Halting scan momentarily." };
}

// AI Function: Chat Logic (With Fallback)
async function chatWithAI(userMessage, currentVibe, base64Image) {
    const systemContext = `You are AURA CORE, a sleek, highly intelligent, and witty AI assistant. 
    The user's current vibe is: ${currentVibe}. 
    CRITICAL INSTRUCTION: Respond in a conversational, friendly, but high-tech tone. 
    Keep all responses under 2-3 short sentences. Be helpful but brief, like JARVIS from Iron Man. 
    DO NOT just say 'System nominal'. Actually engage with the user's message thoughtfully.`;
    
    let contentParts = [
        `${systemContext}\n- USER_DATA: "${userMessage}"\n- GENERATE_SHORT_WITTY_RESPONSE:`
    ];

    if (base64Image) {
        // Extract base64 correctly
        const b64Data = base64Image.split(',')[1];
        if (b64Data) {
            contentParts.push({
                inlineData: { data: b64Data, mimeType: "image/jpeg" }
            });
        }
    }
    // Try the models in order until one works, spreading quota limit
    const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest", "gemini-pro-latest"];

    for (const modelName of models) {
        try {
            console.log(`🤖 Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(contentParts);
            const text = result.response.text();
            console.log(`✅ Chat success with ${modelName}`);
            return text;
        } catch (error) {
            console.warn(`⚠️ Model ${modelName} failed:`, error.message);
        }
    }

    return "AURA_SYSTEM_WARNING: Google Gemini API quota limit reached. My neural pathways are overloaded from scanning too frequently. Please wait 1 minute before sending another request.";
}

// --- 4. SERVER ROUTES ---

// Serve the website
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// API: Analyze Image
app.post('/api/analyze', async (req, res) => {
    const analysis = await analyzeImage(req.body.image);
    console.log("✅ Analysis:", analysis.vibe);
    res.json(analysis);
});

// API: Chat
app.post('/api/chat', async (req, res) => {
    const reply = await chatWithAI(req.body.message, req.body.vibe, req.body.image);
    res.json({ reply });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✨ MoodLift Server running at http://localhost:${PORT}`);
});