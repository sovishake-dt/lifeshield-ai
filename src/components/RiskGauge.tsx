import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ShieldX } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  confidence: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, confidence }) => {
  // Normalize score
  const safeScore = Math.min(Math.max(score, 0), 100);

  // SVG Gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  // Styling maps
  const levelConfig: Record<
    RiskLevel,
    {
      color: string;
      strokeColor: string;
      bgColor: string;
      borderColor: string;
      glowColor: string;
      icon: React.ReactNode;
      label: string;
      description: string;
    }
  > = {
    SAFE: {
      color: 'text-emerald-400',
      strokeColor: '#10b981',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-500/40',
      glowColor: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      label: 'SAFE',
      description: 'Standard legitimate communication with no notable scam markers.',
    },
    LOW: {
      color: 'text-cyan-400',
      strokeColor: '#06b6d4',
      bgColor: 'bg-cyan-950/40',
      borderColor: 'border-cyan-500/40',
      glowColor: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]',
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      label: 'LOW RISK',
      description: 'Minor promotional or unsolicited traits, but low threat profile.',
    },
    MEDIUM: {
      color: 'text-amber-400',
      strokeColor: '#f59e0b',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-500/40',
      glowColor: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
      label: 'MEDIUM RISK',
      description: 'Ambiguous or unverified links and urgency signals detected.',
    },
    HIGH: {
      color: 'text-orange-400',
      strokeColor: '#f97316',
      bgColor: 'bg-orange-950/40',
      borderColor: 'border-orange-500/40',
      glowColor: 'shadow-[0_0_30px_rgba(249,115,22,0.25)]',
      icon: <ShieldAlert className="w-6 h-6 text-orange-400" />,
      label: 'HIGH RISK',
      description: 'Strong deception patterns, advance-fee or recruitment scam mechanics.',
    },
    CRITICAL: {
      color: 'text-red-400',
      strokeColor: '#ef4444',
      bgColor: 'bg-red-950/50',
      borderColor: 'border-red-500/50',
      glowColor: 'shadow-[0_0_35px_rgba(239,68,68,0.35)]',
      icon: <ShieldX className="w-6 h-6 text-red-400" />,
      label: 'CRITICAL DANGER',
      description: 'Severe account takeover, credential harvesting, or direct fraud attempt.',
    },
  };

  const current = levelConfig[level] || levelConfig.MEDIUM;

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 ${current.bgColor} ${current.borderColor} ${current.glowColor} transition-all duration-500`}>
      
      {/* Background Accent Grid / Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Visual SVG Radial Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-44 h-44 transform -rotate-135" viewBox="0 0 160 160">
            {/* Background Track Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="12"
              strokeDasharray={circumference * 0.75}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
            {/* Dynamic Value Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={current.strokeColor}
              strokeWidth="12"
              strokeDasharray={circumference * 0.75}
              strokeDashoffset={circumference * 0.75 - (safeScore / 100) * (circumference * 0.75)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight text-white">
              {safeScore}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Risk Score / 100
            </span>
          </div>
        </div>

        {/* Right: Risk Level Details & Confidence */}
        <div className="flex-1 text-center md:text-left space-y-3">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border bg-slate-900/90 text-sm font-bold tracking-wide">
            {current.icon}
            <span className={current.color}>{current.label}</span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {current.description}
          </p>

          {/* Confidence Meter */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>AI Analysis Confidence</span>
              <span className="font-semibold text-slate-200">{confidence}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${Math.min(confidence, 100)}%` }}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
