import React, { useState } from 'react';
import { Key, Check, AlertCircle, X, ExternalLink, ShieldCheck, RefreshCw, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedApiKey: string;
  onSaveKey: (key: string) => void;
  onClearKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  savedApiKey,
  onSaveKey,
  onClearKey,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>(savedApiKey);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!apiKeyInput.trim()) {
      setVerificationResult({
        success: false,
        message: 'Please paste your Gemini API key first.',
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setVerificationResult({
          success: true,
          message: 'Connection Verified! Gemini API is active & responding.',
        });
        onSaveKey(apiKeyInput.trim());
      } else {
        setVerificationResult({
          success: false,
          message: data.error || 'Failed to authenticate key with Google AI Studio.',
        });
      }
    } catch {
      setVerificationResult({
        success: false,
        message: 'Network error communicating with the backend server.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = () => {
    onSaveKey(apiKeyInput.trim());
    onClose();
  };

  const handleClear = () => {
    setApiKeyInput('');
    setVerificationResult(null);
    onClearKey();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel-glow border border-cyan-500/40 p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Connect Google Gemini API
            </h3>
            <p className="text-xs text-slate-400">
              Enable real-time AI security intelligence
            </p>
          </div>
        </div>

        {/* Info box */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Need a free Gemini API key?</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <span>Get key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Your key is used strictly for your browser session to analyze messages and is never logged or exposed.
          </p>
        </div>

        {/* Key Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-200">
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => {
              setApiKeyInput(e.target.value);
              setVerificationResult(null);
            }}
            placeholder="AIzaSy..."
            className="w-full rounded-xl bg-[#060a12] border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 p-3 text-slate-100 font-mono text-sm outline-none transition-all"
          />
        </div>

        {/* Verification Result Feedback */}
        {verificationResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
              verificationResult.success
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/60 border-red-500/50 text-red-200'
            }`}
          >
            {verificationResult.success ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{verificationResult.message}</span>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          
          {savedApiKey ? (
            <button
              onClick={handleClear}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-xs font-medium text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Key</span>
            </button>
          ) : <div />}

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTestKey}
              disabled={isVerifying || !apiKeyInput.trim()}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Test Connection</span>
                </>
              )}
            </button>

            <button
              onClick={handleSave}
              disabled={!apiKeyInput.trim()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-slate-950 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Save & Connect</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
