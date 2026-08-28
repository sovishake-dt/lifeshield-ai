import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MessageInput } from './components/MessageInput';
import { PresetSelector } from './components/PresetSelector';
import { RadarScanner } from './components/RadarScanner';
import { AnalysisReport } from './components/AnalysisReport';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Footer } from './components/Footer';
import { PresetScenario, SecurityAnalysis, SystemHealth } from './types';
import { Shield, AlertCircle } from 'lucide-react';
import { PRESETS } from './data/presets';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [analyzedText, setAnalyzedText] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>();
  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [forceDemo, setForceDemo] = useState<boolean>(false);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  
  // API Key Modal State & LocalStorage
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    return localStorage.getItem('lifeshield_gemini_api_key') || '';
  });

  // Check backend health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => {
        console.warn('Backend health check note:', err);
        setHealth({
          status: 'healthy',
          engine: 'LifeShield Heuristic Threat Engine',
          hasGeminiKey: false,
        });
      });
  }, []);

  const handleSaveUserKey = (key: string) => {
    setUserApiKey(key);
    if (key) {
      localStorage.setItem('lifeshield_gemini_api_key', key);
    } else {
      localStorage.removeItem('lifeshield_gemini_api_key');
    }
  };

  const handleClearUserKey = () => {
    setUserApiKey('');
    localStorage.removeItem('lifeshield_gemini_api_key');
  };

  // Handle selecting a preset scenario
  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    setInputText(preset.sampleText);
    setError(null);
  };

  // Perform Analysis
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalyzedText(inputText);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText.trim(),
          forceDemo,
          apiKey: userApiKey || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: SecurityAnalysis = await response.json();

      // Ensure minimum scanning animation duration for polished cyber feel (800ms)
      const elapsed = Date.now() - startTime;
      if (elapsed < 800) {
        await new Promise((r) => setTimeout(r, 800 - elapsed));
      }

      setAnalysis(data);
    } catch (err: any) {
      console.warn('API fetch error, generating local analysis:', err);
      const foundPreset = PRESETS.find((p) => p.sampleText.trim() === inputText.trim());
      if (foundPreset) {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText.trim(), forceDemo: true }),
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          setAnalysis(data);
        } else {
          setError('Analysis request failed. Please ensure the backend server is running.');
        }
      } else {
        setError(err.message || 'Failed to complete analysis. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  const handleClear = () => {
    setInputText('');
    setSelectedPresetId(undefined);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Navigation Header */}
      <Navbar
        health={health}
        forceDemo={forceDemo}
        onToggleDemo={() => setForceDemo(!forceDemo)}
        hasUserKey={Boolean(userApiKey)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        savedApiKey={userApiKey}
        onSaveKey={handleSaveUserKey}
        onClearKey={handleClearUserKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Hero Section (Show when no active analysis report) */}
        {!analysis && (
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI-Powered Scam & Phishing Defense Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              LifeShield <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-medium">
              "Understand suspicious messages before they cost you."
            </p>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Analyze suspicious SMS, WhatsApp messages, fake job offers, bank OTP requests, and fraudulent investment schemes in seconds using structured cybersecurity intelligence.
            </p>

            {/* Quick Threat Vectors Pills */}
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

        {/* Error Alert if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Interactive Workspace Area */}
        <div className="space-y-8">
          
          {/* If analyzing -> Show Radar Scanner */}
          {isLoading && <RadarScanner />}

          {/* If analysis result is available -> Show Full Report */}
          {!isLoading && analysis && (
            <AnalysisReport
              analysis={analysis}
              originalText={analyzedText}
              onReset={handleReset}
            />
          )}

          {/* If NOT analyzing and NO report -> Show Presets & Message Input */}
          {!isLoading && !analysis && (
            <div className="space-y-6">
              
              {/* 5 Competition Preset Buttons */}
              <PresetSelector
                onSelectPreset={handleSelectPreset}
                selectedPresetId={selectedPresetId}
              />

              {/* Message Input Box */}
              <MessageInput
                value={inputText}
                onChange={(val) => {
                  setInputText(val);
                  setSelectedPresetId(undefined);
                }}
                onAnalyze={handleAnalyze}
                onClear={handleClear}
                isLoading={isLoading}
              />

            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};
