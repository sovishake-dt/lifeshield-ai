import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { analyzeMessageWithGemini } from './services/gemini.js';
import { analyzeThreatHeuristically, PRESET_ANALYSES } from './services/threatAnalyzer.js';
import { AnalyzeRequest } from './types.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health and Status check
app.get('/api/health', (_req, res) => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    !process.env.GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY') &&
    !process.env.GEMINI_API_KEY.includes('your_gemini_api_key')
  );

  res.json({
    status: 'healthy',
    product: 'LifeShield AI',
    version: '1.0.0',
    engine: hasGeminiKey ? 'Gemini 1.5/2.5 Flash' : 'Built-in Threat Analysis Engine (Demo Mode)',
    hasGeminiKey,
    timestamp: new Date().toISOString(),
  });
});

// Verify API Key endpoint
app.post('/api/verify-key', async (req, res) => {
  const { apiKey } = req.body;
  const keyToTest = apiKey || process.env.GEMINI_API_KEY;

  if (!keyToTest || keyToTest.trim() === '' || keyToTest.includes('YOUR_GEMINI_API_KEY')) {
    return res.status(400).json({ valid: false, error: 'No API key provided.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(keyToTest.trim());
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    await model.generateContent('ping');
    return res.json({ valid: true, message: 'Gemini API connection successful!' });
  } catch (error: any) {
    return res.status(400).json({
      valid: false,
      error: error.message || 'Invalid API key or network error.',
    });
  }
});

// Presets metadata endpoint
app.get('/api/presets', (_req, res) => {
  res.json({
    presets: Object.keys(PRESET_ANALYSES),
  });
});

// Main Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { text, forceDemo, apiKey } = req.body as AnalyzeRequest;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing text to analyze',
        message: 'Please provide a message string in the request body.',
      });
    }

    const trimmedText = text.trim();

    if (forceDemo) {
      const demoResult = analyzeThreatHeuristically(trimmedText);
      return res.json(demoResult);
    }

    const result = await analyzeMessageWithGemini(trimmedText, apiKey);
    return res.json(result);
  } catch (error: any) {
    console.error('Analysis error:', error);
    try {
      const fallbackResult = analyzeThreatHeuristically(req.body?.text || '');
      return res.json(fallbackResult);
    } catch {
      return res.status(500).json({
        error: 'Analysis Failed',
        message: error?.message || 'An unexpected error occurred during message analysis.',
      });
    }
  }
});

app.listen(PORT, () => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    !process.env.GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY') &&
    !process.env.GEMINI_API_KEY.includes('your_gemini_api_key')
  );

  console.log(`🛡️  LifeShield AI Backend Server running on http://localhost:${PORT}`);
  console.log(`🔒  AI Engine: ${hasGeminiKey ? 'Google Gemini (Active)' : 'Threat Engine v2.4 (Demo Mode)'}`);
});
