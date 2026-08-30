import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { analyzeMessageWithGemini } from './services/gemini.js';
import {
  analyzeThreatHeuristically,
  PRESET_ANALYSES,
} from './services/threatAnalyzer.js';
import { AnalyzeRequest } from './types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/*
 * ============================================================
 * CORS
 * ============================================================
 *
 * Frontend:
 * https://lifeshield-ai-02h.web.app
 *
 * Backend:
 * https://lifeshield-ai-api.onrender.com
 *
 * Allow Firebase Hosting to communicate with Render.
 */

const allowedOrigins = [
  'https://lifeshield-ai-02h.web.app',
  'https://lifeshield-ai-02h.firebaseapp.com',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (curl, Render health checks, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));

/*
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 */

app.get('/api/health', (_req, res) => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      !process.env.GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY') &&
      !process.env.GEMINI_API_KEY.includes('your_gemini_api_key')
  );

  res.status(200).json({
    status: 'healthy',
    product: 'LifeShield AI',
    version: '1.0.0',

    // This indicates whether Render has its own server-side key.
    // The frontend should NOT use this as the user's key status.
    engine: hasGeminiKey
      ? 'Gemini'
      : 'Built-in Threat Analysis Engine (Demo Mode)',

    hasGeminiKey,

    timestamp: new Date().toISOString(),
  });
});

/*
 * ============================================================
 * VERIFY USER GEMINI API KEY
 * ============================================================
 */

app.post('/api/verify-key', async (req, res) => {
  try {
    const { apiKey } = req.body ?? {};

    // IMPORTANT:
    // If the user sends an API key, test THAT key.
    // Otherwise use the server environment key.
    const keyToTest =
      typeof apiKey === 'string' && apiKey.trim().length > 0
        ? apiKey.trim()
        : process.env.GEMINI_API_KEY?.trim();

    if (!keyToTest) {
      return res.status(400).json({
        valid: false,
        error: 'No Gemini API key provided.',
      });
    }

    if (
      keyToTest.includes('YOUR_GEMINI_API_KEY') ||
      keyToTest.includes('your_gemini_api_key') ||
      keyToTest === 'your_api_keys'
    ) {
      return res.status(400).json({
        valid: false,
        error: 'Please enter a real Google Gemini API key.',
      });
    }

    /*
     * Create a Gemini client using the key being tested.
     */
    const genAI = new GoogleGenerativeAI(keyToTest);

    /*
     * Use a current Flash model.
     *
     * If your Google AI Studio account does not have access
     * to this model, the response below will explain the error.
     */
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    /*
     * Small verification request.
     */
    await model.generateContent('Reply with exactly: OK');

    return res.status(200).json({
      valid: true,
      message: 'Gemini API connection successful!',
    });
  } catch (error: any) {
    console.error('Gemini API verification error:', error);

    const message =
      error?.message ||
      'Unable to communicate with the Gemini API.';

    return res.status(400).json({
      valid: false,
      error: message,
    });
  }
});

/*
 * ============================================================
 * PRESETS
 * ============================================================
 */

app.get('/api/presets', (_req, res) => {
  res.status(200).json({
    presets: Object.keys(PRESET_ANALYSES),
  });
});

/*
 * ============================================================
 * MAIN ANALYSIS ENDPOINT
 * ============================================================
 */

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, forceDemo, apiKey } = req.body as AnalyzeRequest;

    if (
      !text ||
      typeof text !== 'string' ||
      text.trim().length === 0
    ) {
      return res.status(400).json({
        error: 'Missing text to analyze',
        message:
          'Please provide a message string in the request body.',
      });
    }

    const trimmedText = text.trim();

    /*
     * Demo mode
     */
    if (forceDemo) {
      const demoResult =
        analyzeThreatHeuristically(trimmedText);

      return res.status(200).json(demoResult);
    }

    /*
     * Gemini mode
     */
    const result = await analyzeMessageWithGemini(
      trimmedText,
      apiKey
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Analysis error:', error);

    /*
     * Fallback to the built-in threat analysis engine.
     */
    try {
      const fallbackResult =
        analyzeThreatHeuristically(
          req.body?.text || ''
        );

      return res.status(200).json(fallbackResult);
    } catch {
      return res.status(500).json({
        error: 'Analysis Failed',
        message:
          error?.message ||
          'An unexpected error occurred during message analysis.',
      });
    }
  }
});

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(PORT, () => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      !process.env.GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY') &&
      !process.env.GEMINI_API_KEY.includes('your_gemini_api_key')
  );

  console.log(
    `LifeShield AI Backend running on port ${PORT}`
  );

  console.log(
    `AI Engine: ${
      hasGeminiKey
        ? 'Google Gemini'
        : 'Threat Engine Demo Mode'
    }`
  );
});