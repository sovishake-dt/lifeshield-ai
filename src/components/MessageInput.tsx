import React, { useRef } from 'react';
import { Shield, Clipboard, Trash2, ArrowRight } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onAnalyze,
  onClear,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
      }
    } catch {
      // Clipboard fallback
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onAnalyze();
      }
    }
  };

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="relative rounded-2xl glass-panel-glow p-5 sm:p-7 transition-all border border-slate-700/80">
      
      {/* Header bar above textarea */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <label
          htmlFor="suspicious-input"
          className="text-sm font-bold text-slate-200 flex items-center space-x-2"
        >
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Paste Suspicious Message, Email, SMS or Offer</span>
        </label>

        <div className="flex items-center space-x-2">
          {/* Paste button */}
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Paste</span>
          </button>

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 text-xs font-medium text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 transition-colors"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          id="suspicious-input"
          ref={textareaRef}
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 'URGENT: Your bank account is locked. Click http://secure-verify-bank.cc or reply with OTP to restore access within 15 minutes...'"
          className="w-full rounded-xl bg-[#060a12]/90 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 p-4 text-slate-100 placeholder-slate-500 text-sm sm:text-base leading-relaxed transition-all resize-y font-mono outline-none shadow-inner"
        />

        {/* Floating shortcut hint */}
        <div className="absolute bottom-3 right-3 hidden sm:flex items-center space-x-1 text-[11px] text-slate-500 pointer-events-none bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
          <span>Press</span>
          <kbd className="font-mono text-slate-400">Ctrl/Cmd + Enter</kbd>
          <span>to analyze</span>
        </div>
      </div>

      {/* Footer controls & Analyze button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-800/80">
        
        {/* Character & Word counter */}
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span>
            Characters: <strong className="text-slate-200">{charCount}</strong>
          </span>
          <span>•</span>
          <span>
            Words: <strong className="text-slate-200">{wordCount}</strong>
          </span>
        </div>

        {/* Big Action Button */}
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !value.trim()}
          className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all duration-300 shadow-lg ${
            isLoading || !value.trim()
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:text-black border border-cyan-300/40 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <Shield className="w-5 h-5 animate-spin text-cyan-900" />
              <span>Analyzing Threat Vectors...</span>
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 text-slate-950" />
              <span>Analyze Risk</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </>
          )}
        </button>

      </div>

    </div>
  );
};
