import React, { useEffect, useState } from 'react';
import { Shield, Radio, Search, CheckCircle2 } from 'lucide-react';

const SCAN_STEPS = [
  'Deconstructing message payload & character encoding...',
  'Scanning for OTP solicitation, phishing URLs & domain typosquatting...',
  'Evaluating social engineering, urgency cues & advance-fee patterns...',
  'Querying Google Gemini AI Threat Intelligence Engine...',
  'Synthesizing actionable countermeasures & security advisory...'
];

export const RadarScanner: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel-glow p-8 sm:p-12 text-center my-6 border border-cyan-500/30">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none" />

      {/* Radar Animation Area */}
      <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-8">
        
        {/* Outer Concentric Circles */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-20" />
        <div className="absolute inset-2 rounded-full border border-cyan-500/30" />
        <div className="absolute inset-8 rounded-full border border-cyan-500/40 border-dashed animate-spin duration-1000" style={{ animationDuration: '12s' }} />
        <div className="absolute inset-16 rounded-full border border-cyan-500/50" />

        {/* Sweeping Radar Beam */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="w-full h-full origin-center animate-radar-sweep bg-gradient-to-r from-transparent via-cyan-500/20 to-cyan-400/40 rounded-full clip-path-radar" />
        </div>

        {/* Center Shield Icon */}
        <div className="relative z-10 w-16 h-16 rounded-full bg-slate-950 border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
          <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        {/* Blip dots */}
        <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-red-400 animate-ping" />
        <div className="absolute bottom-8 left-10 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      </div>

      {/* Status Header */}
      <div className="relative z-10 max-w-md mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-xs font-semibold text-cyan-300">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>REAL-TIME THREAT SCAN IN PROGRESS</span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          LifeShield Deep Packet & Semantic Analysis
        </h3>

        {/* Step Progress Checklist */}
        <div className="space-y-2 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {SCAN_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-2.5 text-xs transition-opacity duration-300 ${
                  isDone
                    ? 'text-emerald-400'
                    : isCurrent
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                ) : isCurrent ? (
                  <Search className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                )}
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
