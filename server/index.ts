import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { analyzeMessageWithGemini } from './services/gemini.js';
import { PRESET_ANALYSES } from './services/threatAnalyzer.js';
import { AnalyzeRequest } from './types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/*
 * ============================================================
 * CORS
 * ============================================================
 */

const allowedOrigins = [
  'https://lifeshield-ai-02h.web.app',
  'https://lifeshield-ai-02h.firebaseapp.com',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
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

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

app.use(express.json({ limit: '1mb' }));

/*
 * ============================================================
 * GEMINI ERROR / RETRY HELPERS
 * ============================================================
 */

function extractRetryAfterSeconds(
  error: any
): number | null {
  const message =
    error?.message ||
    String(error || '');

  const retryMatch = message.match(
    /retry\s+(?:in|after)\s+([\d.]+)\s*(?:s|sec|seconds)/i
  );

  if (retryMatch) {
    const seconds = Math.ceil(
      Number(retryMatch[1])
    );

    if (
      Number.isFinite(seconds) &&
      seconds >= 0
    ) {
      return seconds;
    }
  }

  try {
    const retryDelay =
      error?.errorDetails
        ?.find?.(
          (detail: any) =>
            detail?.['@type']?.includes?.(
              'RetryInfo'
            )
        )
        ?.retryDelay;

    if (typeof retryDelay === 'string') {
      const structuredMatch =
        retryDelay.match(
          /([\d.]+)s/i
        );

      if (structuredMatch) {
        const seconds = Math.ceil(
          Number(structuredMatch[1])
        );

        if (
          Number.isFinite(seconds) &&
          seconds >= 0
        ) {
          return seconds;
        }
      }
    }
  } catch {
    // Ignore structured error parsing failures.
  }

  return null;
}

function isGeminiRateLimitError(
  error: any
): boolean {
  const message =
    error?.message ||
    String(error || '');

  return (
    error?.status === 429 ||
    error?.statusCode === 429 ||
    message.includes('429') ||
    message
      .toLowerCase()
      .includes('too many requests') ||
    message
      .toLowerCase()
      .includes('quota exceeded') ||
    message
      .toLowerCase()
      .includes('rate limit')
  );
}

function sendGeminiError(
  res: express.Response,
  error: any
) {
  const retryAfterSeconds =
    extractRetryAfterSeconds(error);

  const rateLimited =
    isGeminiRateLimitError(error);

  const originalMessage =
    error?.message ||
    'Unable to communicate with the Gemini API.';

  if (rateLimited) {
    console.warn(
      `Gemini rate limit reached. Retry after: ${
        retryAfterSeconds ?? 'unknown'
      } seconds`
    );

    return res.status(429).json({
      success: false,

      error: 'API_LIMIT_EXCEEDED',

      message:
        'Gemini AI analysis is temporarily unavailable because the current API limit has been reached.',

      retryAfterSeconds,

      retryMessage:
        retryAfterSeconds !== null
          ? `Please try again after ${retryAfterSeconds} seconds.`
          : 'Please try again after a while.',

      canRetry: true,

      demoAvailable: true,
    });
  }

  if (
    originalMessage.includes(
      'GEMINI_API_KEY_NOT_CONFIGURED'
    )
  ) {
    return res.status(503).json({
      success: false,

      error: 'API_NOT_CONFIGURED',

      message:
        'Gemini AI is not configured on the server.',

      retryAfterSeconds: null,

      canRetry: false,

      demoAvailable: true,
    });
  }

  console.error(
    'Gemini API error:',
    originalMessage
  );

  return res.status(503).json({
    success: false,

    error: 'AI_SERVICE_UNAVAILABLE',

    message:
      'Gemini AI analysis is temporarily unavailable. Please try again later.',

    retryAfterSeconds,

    canRetry: true,

    demoAvailable: true,
  });
}

/*
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 */

app.get('/api/health', (_req, res) => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== '' &&
      !process.env.GEMINI_API_KEY.includes(
        'YOUR_GEMINI_API_KEY'
      ) &&
      !process.env.GEMINI_API_KEY.includes(
        'your_gemini_api_key'
      )
  );

  res.status(200).json({
    status: 'healthy',

    product: 'LifeShield AI',

    version: '1.0.0',

    engine: hasGeminiKey
      ? 'Gemini'
      : 'Gemini API Not Configured',

    hasGeminiKey,

    demoAvailable: true,

    presetCount:
      Object.keys(PRESET_ANALYSES).length,

    timestamp:
      new Date().toISOString(),
  });
});

/*
 * ============================================================
 * VERIFY USER GEMINI API KEY
 * ============================================================
 */

app.post(
  '/api/verify-key',
  async (req, res) => {
    try {
      const { apiKey } =
        req.body ?? {};

      const keyToTest =
        typeof apiKey === 'string' &&
        apiKey.trim().length > 0
          ? apiKey.trim()
          : process.env.GEMINI_API_KEY?.trim();

      if (!keyToTest) {
        return res.status(400).json({
          valid: false,

          error:
            'No Gemini API key provided.',
        });
      }

      if (
        keyToTest.includes(
          'YOUR_GEMINI_API_KEY'
        ) ||
        keyToTest.includes(
          'your_gemini_api_key'
        ) ||
        keyToTest === 'your_api_keys'
      ) {
        return res.status(400).json({
          valid: false,

          error:
            'Please enter a real Google Gemini API key.',
        });
      }

      const genAI =
        new GoogleGenerativeAI(
          keyToTest
        );

      const model =
        genAI.getGenerativeModel({
          model: 'gemini-3.6-flash',
        });

      await model.generateContent(
        'Reply with exactly: OK'
      );

      return res.status(200).json({
        valid: true,

        message:
          'Gemini API connection successful!',

        retryAfterSeconds: 0,

        canAnalyze: true,
      });
    } catch (error: any) {
      console.error(
        'Gemini API verification error:',
        error
      );

      const retryAfterSeconds =
        extractRetryAfterSeconds(error);

      if (
        isGeminiRateLimitError(error)
      ) {
        return res.status(429).json({
          valid: false,

          error:
            'Gemini API rate limit exceeded.',

          message:
            'The Gemini API is temporarily unavailable because the current quota limit has been reached.',

          retryAfterSeconds,

          retryMessage:
            retryAfterSeconds !== null
              ? `Please try again after ${retryAfterSeconds} seconds.`
              : 'Please try again after a while.',

          canAnalyze: false,

          demoAvailable: true,
        });
      }

      const message =
        error?.message ||
        'Unable to communicate with the Gemini API.';

      return res.status(400).json({
        valid: false,

        error: message,

        retryAfterSeconds,

        canAnalyze: false,

        demoAvailable: true,
      });
    }
  }
);

/*
 * ============================================================
 * PRESETS
 * ============================================================
 */

app.get(
  '/api/presets',
  (_req, res) => {
    res.status(200).json({
      presets:
        Object.keys(PRESET_ANALYSES),

      count:
        Object.keys(PRESET_ANALYSES).length,
    });
  }
);

/*
 * ============================================================
 * MAIN ANALYSIS ENDPOINT
 * ============================================================
 */

app.post(
  '/api/analyze',
  async (req, res) => {
    try {
      const {
        text,
        forceDemo,
        presetId,
        apiKey,
      } =
        req.body as AnalyzeRequest;

      /*
       * --------------------------------------------------------
       * Validate input
       * --------------------------------------------------------
       */

      if (
        !text ||
        typeof text !== 'string' ||
        text.trim().length === 0
      ) {
        return res.status(400).json({
          success: false,

          error:
            'Missing text to analyze',

          message:
            'Please provide a message string in the request body.',
        });
      }

      const trimmedText =
        text.trim();

      /*
       * --------------------------------------------------------
       * DEMO / PRESET ANALYSIS
       * --------------------------------------------------------
       *
       * Demo analysis now uses the preset ID.
       *
       * Example:
       *
       * presetId = "lottery"
       *
       * becomes:
       *
       * PRESET_ANALYSES["lottery"]
       *
       * This avoids comparing the entire demo message text
       * against the backend analysis object.
       */

      const presetResult =
        presetId
          ? PRESET_ANALYSES[presetId]
          : null;

      if (
        forceDemo &&
        presetResult
      ) {
        console.log(
          `EXACT DEMO PRESET USED: ${presetId}`
        );

        return res.status(200).json({
          ...presetResult,

          isDemoMode: true,

          modelUsed:
            'LifeShield Demo Analysis',

          analyzedAt:
            new Date().toISOString(),
        });
      }

      /*
       * --------------------------------------------------------
       * INVALID DEMO REQUEST
       * --------------------------------------------------------
       */

      if (forceDemo) {
        return res.status(400).json({
          success: false,

          error:
            'DEMO_TEXT_NOT_FOUND',

          message:
            'Demo mode is available only for exact predefined demo messages.',

          demoAvailable: true,

          availablePresets:
            Object.keys(PRESET_ANALYSES),
        });
      }

      /*
       * --------------------------------------------------------
       * GEMINI ANALYSIS
       * --------------------------------------------------------
       *
       * Non-demo messages continue to use Gemini exactly
       * as before.
       */

      const result =
        await analyzeMessageWithGemini(
          trimmedText,
          apiKey
        );

      return res.status(200).json(
        result
      );
    } catch (error: any) {
      console.error(
        'Analysis error:',
        error
      );

      /*
       * NEVER use heuristic fallback here.
       */

      return sendGeminiError(
        res,
        error
      );
    }
  }
);

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

app.listen(
  PORT,
  () => {
    const hasGeminiKey =
      Boolean(
        process.env.GEMINI_API_KEY &&
          process.env.GEMINI_API_KEY.trim() !== '' &&
          !process.env.GEMINI_API_KEY.includes(
            'YOUR_GEMINI_API_KEY'
          ) &&
          !process.env.GEMINI_API_KEY.includes(
            'your_gemini_api_key'
          )
      );

    console.log(
      `LifeShield AI Backend running on port ${PORT}`
    );

    console.log(
      `AI Engine: ${
        hasGeminiKey
          ? 'Google Gemini'
          : 'Gemini API Not Configured'
      }`
    );

    console.log(
      `Exact demo presets available: ${
        Object.keys(
          PRESET_ANALYSES
        ).length
      }`
    );
  }
);