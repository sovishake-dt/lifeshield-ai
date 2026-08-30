import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MessageInput } from './components/MessageInput';
import { PresetSelector } from './components/PresetSelector';
import { RadarScanner } from './components/RadarScanner';
import { AnalysisReport } from './components/AnalysisReport';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Footer } from './components/Footer';
import {
  PresetScenario,
  SecurityAnalysis,
  SystemHealth,
} from './types';
import { Shield, AlertCircle } from 'lucide-react';
import { PRESETS } from './data/presets';

const API_URL = 'https://lifeshield-ai-api.onrender.com';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [analyzedText, setAnalyzedText] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<
    string | undefined
  >();

  const [analysis, setAnalysis] =
    useState<SecurityAnalysis | null>(null);

  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const [retryAfterSeconds, setRetryAfterSeconds] =
    useState<number | null>(null);

  const [forceDemo, setForceDemo] =
    useState<boolean>(false);

  const [health, setHealth] =
    useState<SystemHealth | null>(null);

  const [isKeyModalOpen, setIsKeyModalOpen] =
    useState<boolean>(false);

  const [userApiKey, setUserApiKey] =
    useState<string>(() => {
      return (
        localStorage.getItem(
          'lifeshield_gemini_api_key'
        ) || ''
      );
    });

  /*
   * ============================================================
   * BACKEND HEALTH CHECK
   * ============================================================
   */

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Health check failed with status ${res.status}`
          );
        }

        return res.json();
      })
      .then((data) => {
        setHealth(data);
      })
      .catch((err) => {
        console.warn(
          'Backend health check note:',
          err
        );

        setHealth({
          status: 'healthy',
          engine:
            'LifeShield Threat Analysis Engine',
          hasGeminiKey: false,
        });
      });
  }, []);

  /*
   * ============================================================
   * RETRY COUNTDOWN
   * ============================================================
   *
   * When Gemini returns a retry time such as:
   *
   * retryAfterSeconds: 26
   *
   * the frontend counts down automatically.
   */

  useEffect(() => {
    if (
      retryAfterSeconds === null ||
      retryAfterSeconds <= 0
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setRetryAfterSeconds((current) => {
        if (
          current === null ||
          current <= 1
        ) {
          window.clearInterval(timer);
          return null;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [retryAfterSeconds]);

  /*
   * ============================================================
   * SAVE USER GEMINI API KEY
   * ============================================================
   */

  const handleSaveUserKey = (key: string) => {
    const cleanKey = key.trim();

    setUserApiKey(cleanKey);

    if (cleanKey) {
      localStorage.setItem(
        'lifeshield_gemini_api_key',
        cleanKey
      );
    } else {
      localStorage.removeItem(
        'lifeshield_gemini_api_key'
      );
    }
  };

  /*
   * ============================================================
   * CLEAR USER GEMINI API KEY
   * ============================================================
   */

  const handleClearUserKey = () => {
    setUserApiKey('');

    localStorage.removeItem(
      'lifeshield_gemini_api_key'
    );
  };

  /*
   * ============================================================
   * PRESET SELECTION
   * ============================================================
   */

  const handleSelectPreset = (
    preset: PresetScenario
  ) => {
    setSelectedPresetId(preset.id);
    setInputText(preset.sampleText);
    setError(null);
    setAnalysis(null);
    setRetryAfterSeconds(null);
  };

  /*
   * ============================================================
   * MAIN ANALYSIS
   * ============================================================
   *
   * IMPORTANT:
   *
   * Demo mode is allowed ONLY when the complete text is
   * EXACTLY identical to a preset's sampleText.
   *
   * No trim().
   * No lowercase().
   * No normalization.
   *
   * Even ONE character difference requires Gemini.
   * ============================================================
   */

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      return;
    }

    /*
     * EXACT comparison.
     *
     * Do NOT use:
     *
     * p.sampleText.trim() === inputText.trim()
     *
     * because that would allow modified text.
     */

    const foundPreset = PRESETS.find(
      (p) => p.sampleText === inputText
    );

    const isExactPreset =
      Boolean(foundPreset);

    /*
     * ==========================================================
     * CUSTOM MESSAGE WITHOUT GEMINI API KEY
     * ==========================================================
     */

    if (
      !isExactPreset &&
      !userApiKey.trim()
    ) {
      setAnalysis(null);

      setError(
        'This message is not an exact built-in demo message. Please connect your Google Gemini API key to analyze it.'
      );

      setRetryAfterSeconds(null);

      setIsKeyModalOpen(true);

      return;
    }

    /*
     * ==========================================================
     * START ANALYSIS
     * ==========================================================
     */

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setRetryAfterSeconds(null);
    setAnalyzedText(inputText);

    const startTime = Date.now();

    try {
      const response = await fetch(
        `${API_URL}/api/analyze`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            /*
             * Send original text exactly as entered.
             */
            text: inputText,

            /*
             * Demo mode ONLY for exact preset.
             */
            forceDemo: isExactPreset,

            /*
             * Custom message:
             * user's Gemini API key.
             *
             * Exact demo:
             * key is optional.
             */
            apiKey:
              userApiKey.trim() ||
              undefined,
          }),
        }
      );

      /*
       * Safely parse response.
       */

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      /*
       * ========================================================
       * BACKEND ERROR
       * ========================================================
       */

      if (!response.ok) {
        /*
         * ======================================================
         * GEMINI RATE LIMIT / QUOTA ERROR
         * ======================================================
         *
         * IMPORTANT:
         *
         * DO NOT create a fallback analysis.
         *
         * The user must see that Gemini is unavailable.
         */

        if (
          response.status === 429 ||
          data?.error ===
            'API_LIMIT_EXCEEDED'
        ) {
          setAnalysis(null);

          const retrySeconds =
            typeof data?.retryAfterSeconds ===
            'number'
              ? data.retryAfterSeconds
              : null;

          setRetryAfterSeconds(
            retrySeconds
          );

          throw new Error(
            retrySeconds !== null
              ? `Gemini API limit has been reached. Please try again after ${retrySeconds} seconds.`
              : 'Gemini API limit has been reached. Please try again after a while.'
          );
        }

        /*
         * ======================================================
         * GEMINI SERVICE UNAVAILABLE
         * ======================================================
         */

        if (
          data?.error ===
            'API_NOT_CONFIGURED' ||
          data?.error ===
            'AI_SERVICE_UNAVAILABLE'
        ) {
          setAnalysis(null);

          const retrySeconds =
            typeof data?.retryAfterSeconds ===
            'number'
              ? data.retryAfterSeconds
              : null;

          setRetryAfterSeconds(
            retrySeconds
          );

          throw new Error(
            data?.message ||
              'Gemini AI is temporarily unavailable. Please try again later.'
          );
        }

        /*
         * ======================================================
         * API KEY REQUIRED
         * ======================================================
         */

        if (data?.requiresApiKey) {
          setIsKeyModalOpen(true);
        }

        throw new Error(
          data?.message ||
            data?.error ||
            `Server returned status ${response.status}`
        );
      }

      /*
       * ========================================================
       * MINIMUM SCANNER DISPLAY TIME
       * ========================================================
       */

      const elapsed =
        Date.now() - startTime;

      if (elapsed < 800) {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              800 - elapsed
            )
        );
      }

      /*
       * ========================================================
       * SHOW RESULT
       * ========================================================
       *
       * This only happens after a successful HTTP response.
       *
       * A Gemini 429 response never reaches here.
       */

      setAnalysis(
        data as SecurityAnalysis
      );
    } catch (err: any) {
      console.warn(
        'Analysis request failed:',
        err
      );

      /*
       * NEVER use heuristic fallback here.
       */

      setAnalysis(null);

      setError(
        err?.message ||
          'Gemini analysis failed. Please check your API key and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * ============================================================
   * RESET ANALYSIS
   * ============================================================
   */

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setRetryAfterSeconds(null);
  };

  /*
   * ============================================================
   * CLEAR INPUT
   * ============================================================
   */

  const handleClear = () => {
    setInputText('');
    setSelectedPresetId(undefined);
    setError(null);
    setAnalysis(null);
    setRetryAfterSeconds(null);
  };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">

      <Navbar
        health={health}
        forceDemo={forceDemo}
        onToggleDemo={() =>
          setForceDemo(!forceDemo)
        }
        hasUserKey={Boolean(userApiKey)}
        onOpenKeyModal={() =>
          setIsKeyModalOpen(true)
        }
      />

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() =>
          setIsKeyModalOpen(false)
        }
        savedApiKey={userApiKey}
        onSaveKey={handleSaveUserKey}
        onClearKey={handleClearUserKey}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {!analysis && (
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">

            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">

              <Shield className="w-3.5 h-3.5 text-cyan-400" />

              <span>
                AI-Powered Scam & Phishing Defense Platform
              </span>

            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">

              LifeShield{' '}

              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                AI
              </span>

            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-medium">
              "Understand suspicious messages before they cost you."
            </p>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">

              Analyze suspicious SMS, WhatsApp messages, fake job offers, bank
              OTP requests, and fraudulent investment schemes in seconds using
              structured cybersecurity intelligence.

            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">

              {[
                'Phishing & Smishing',
                'OTP & 2FA Theft',
                'Fake Recruitment',
                'Crypto Ponzi Schemes',
                'Advance-Fee Fraud',
              ].map((pill, i) => (

                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-400"
                >
                  {pill}
                </span>

              ))}

            </div>

          </div>
        )}

        {error && (
          <div
            className={`mb-6 p-5 rounded-xl text-sm flex items-start space-x-3 ${
              retryAfterSeconds !== null
                ? 'bg-amber-950/60 border border-amber-500/50 text-amber-200'
                : 'bg-red-950/60 border border-red-500/50 text-red-200'
            }`}
          >

            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                retryAfterSeconds !== null
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            />

            <div className="flex-1">

              {retryAfterSeconds !== null ? (
                <>
                  <strong className="font-bold block mb-1">
                    AI Analysis Temporarily Unavailable
                  </strong>

                  <span className="block">
                    The Gemini API limit has been reached.
                  </span>

                  <span className="block mt-1 font-semibold">
                    Please try again after{' '}
                    {retryAfterSeconds}{' '}
                    seconds.
                  </span>
                </>
              ) : (
                <>
                  <strong className="font-bold">
                    Error:{' '}
                  </strong>

                  <span>
                    {error}
                  </span>
                </>
              )}

            </div>

          </div>
        )}

        <div className="space-y-8">

          {isLoading && (
            <RadarScanner />
          )}

          {!isLoading && analysis && (
            <AnalysisReport
              analysis={analysis}
              originalText={analyzedText}
              onReset={handleReset}
            />
          )}

          {!isLoading && !analysis && (
            <div className="space-y-6">

              <PresetSelector
                onSelectPreset={
                  handleSelectPreset
                }
                selectedPresetId={
                  selectedPresetId
                }
              />

              <MessageInput
                value={inputText}

                onChange={(val) => {
                  setInputText(val);

                  /*
                   * Any manual edit means it is no longer
                   * considered the selected preset.
                   */

                  setSelectedPresetId(
                    undefined
                  );

                  setError(null);

                  /*
                   * Don't keep an old quota countdown
                   * after the user changes the message.
                   */
                  setRetryAfterSeconds(
                    null
                  );
                }}

                onAnalyze={handleAnalyze}

                onClear={handleClear}

                isLoading={isLoading}
              />

            </div>
          )}

        </div>
      </main>

      <Footer />

    </div>
  );
};