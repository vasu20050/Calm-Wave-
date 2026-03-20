# 🌊 Calm Wave (MoodLift)
**AURA CORE v2.5 // NEURAL_LINK**

Calm Wave is a real-time, AI-driven biometric feedback and intelligent chatbot web application. Built with a stunning dark-mode "hacker/cyberpunk" aesthetic, the app taps into your webcam to track your facial expressions, analyze your current cognitive load/focus, and chat with you in a highly personalized manner using Google's powerful Gemini Vision and Language models.

---

## ✨ Features

- **Real-Time Emotion Detection:** Analyzes your face using MediaPipe Face Mesh and Google's Gemini Vision API to instantly determine your "Vibe" and Focus Score (e.g., *Calm & Focused 😌*, *Stressed 😟*).
- **Intelligent Personality Chatbot:** An embedded "AURA CORE" chatbot tailored exactly to your current emotional state. Talk via text or dictate naturally with your voice!
- **Voice Sensor Dictation:** Hands-free communication utilizing robust in-browser Web Speech Recognition. 
- **Biometric Dashboard:** Simulates heart rate and cognitive load trends based on the AI's visual analysis.
- **Wellness Directives:** Built-in tools to help regulate your mood, including a 4-7-8 Breathing guide and an embedded Lo-Fi "Focus Beats" Spotify player.
- **Image Context:** Drag, drop, or upload images directly into the chat to provide visual context for AURA.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, TailwindCSS (via CDN), Vanilla JavaScript.
- **Computer Vision:** MediaPipe Face Mesh (`@mediapipe/face_mesh`)
- **Backend Server:** Node.js, Express.js
- **Artificial Intelligence:** Google Generative AI (`@google/generative-ai` package using the Gemini Flash and Pro models).

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need Node.js installed on your computer. You also need a free API key from Google AI Studio.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vasu20050/Calm-Wave-.git
   cd Calm-Wave-
   ```

2. **Install Server Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a new `.env` file in the root directory and add your Google Gemini API key:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: The `.env` file is heavily protected and completely ignored by git to keep your private keys safe!)*

4. **Start the Application!**
   Run the following command to start the Express backend server:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:3000` (or whichever port you specified in `.env`) in your web browser!

---

## 📸 Usage

- **Camera Calibration:** Make sure to click `Allow` when your browser asks for Camera permissions. The app performs an immediate neural-scan to establish your baseline vibe.
- **Forcing a Scan:** Stuck? Click `Re-Calibrate Visuals` to manually snap a frame and re-analyze your mood right away.
- **Chatting:** Type a message or click the 🎤 Mic icon to speak to AURA. The AI will respond in a witty, high-tech persona considering how you're feeling right now.

---

## 🔒 Security

*The codebase natively supports hiding keys from GitHub using `.gitignore`. Never upload or share your `.env` file publicly.*
