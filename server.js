require('dotenv').config();  // Load .env variables

const express = require('express');
const axios = require('axios');
const path = require('path');  // To serve static HTML files
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());  // For parsing JSON requests

const API_KEY = process.env.API_KEY;  // Google API Key from .env
const MODEL_NAME = "gemini-pro";  // Using Gemini model

if (!API_KEY) {
  console.error("❌ Missing API_KEY in .env file");
  process.exit(1);
}

// Serve the index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));  // Serve the HTML page
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body. Provide { userInput: "your text" }' });
    }

    console.log('📩 Incoming user message:', userInput);

    // Send the user input to Google Gemini AI API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateText?key=${API_KEY}`,
      {
        prompt: { text: userInput },
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    );

    const aiResponse = response.data?.candidates?.[0]?.output || "Sorry, I couldn't generate a response.";
    console.log('🤖 AI Response:', aiResponse);

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('❌ Error in chat:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
