import React from 'react';
import {
  Flame,
  HelpCircle,
  CheckCircle,
  XCircle,
  Quote,
  ShieldAlert,
} from 'lucide-react';
import { ThreatCategory, SuspiciousPhrase } from '../types';

// 1. Detected Threats Grid
export const ThreatCategoriesCard: React.FC<{ categories: ThreatCategory[] }> = ({
  categories,
}) => {
  const getSeverityStyle = (severity: ThreatCategory['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-950/60 border-red-500/40 text-red-300';
      case 'high':
        return 'bg-orange-950/60 border-orange-500/40 text-orange-300';
      case 'medium':
        return 'bg-amber-950/60 border-amber-500/40 text-amber-300';
      case 'low':
      default:
        return 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300';
    }
  };

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
        <Flame className="w-5 h-5 text-rose-400" />
        <h3 className="text-base font-bold text-white tracking-wide">
          Detected Threat Vectors ({categories.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border ${getSeverityStyle(
              cat.severity
            )} transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-white flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 opacity-80" />
                <span>{cat.name}</span>
              </span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-black/40 border border-current tracking-wider">
                {cat.severity}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {cat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Suspicious Phrases Extracted
export const SuspiciousPhrasesCard: React.FC<{ phrases: SuspiciousPhrase[] }> = ({
  phrases,
}) => {
  if (!phrases || phrases.length === 0) {
    return (
      <div className="rounded-2xl glass-panel p-6 border border-slate-800">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Quote className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Suspicious Phrases & Red Flags
          </h3>
        </div>
        <p className="text-xs text-slate-400 pt-3 italic">
          No overtly suspicious malicious phrases or trigger keywords identified.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
        <Quote className="w-5 h-5 text-amber-400" />
        <h3 className="text-base font-bold text-white tracking-wide">
          Suspicious Phrases & Red Flags ({phrases.length})
        </h3>
      </div>

      <div className="space-y-3">
        {phrases.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2 hover:border-amber-500/40 transition-all"
          >
            <div className="flex items-start space-x-2 text-rose-300 font-mono text-xs sm:text-sm bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/40">
              <span className="text-rose-500 font-bold">"</span>
              <span className="font-semibold flex-1">{item.phrase}</span>
              <span className="text-rose-500 font-bold">"</span>
            </div>
            <p className="text-xs text-slate-300 pl-2 border-l-2 border-amber-500/60 leading-relaxed font-medium">
              <strong className="text-amber-400">Risk Indicator: </strong>
              {item.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Why It Is Suspicious (Explanation)
export const WhySuspiciousCard: React.FC<{ points: string[] }> = ({ points }) => {
  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
        <HelpCircle className="w-5 h-5 text-cyan-400" />
        <h3 className="text-base font-bold text-white tracking-wide">
          Why It Is Suspicious (Security Assessment)
        </h3>
      </div>

      <ul className="space-y-2.5">
        {points.map((point, idx) => (
          <li
            key={idx}
            className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200 leading-relaxed"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 4. Action Advisory: Recommended Actions & Do Not Do Cards
export const ActionAdvisoryCards: React.FC<{
  recommendedActions: string[];
  doNotDo: string[];
}> = ({ recommendedActions, doNotDo }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Recommended Actions (Green Safe Checklist) */}
      <div className="rounded-2xl glass-panel-safe p-6 border border-emerald-500/30 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-emerald-800/40">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-emerald-200 tracking-wide">
            Recommended Protective Actions
          </h3>
        </div>

        <ul className="space-y-3">
          {recommendedActions.map((action, idx) => (
            <li
              key={idx}
              className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-emerald-900/30"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Do Not Do This (Red Warning Cards) */}
      <div className="rounded-2xl glass-panel-danger p-6 border border-red-500/30 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-red-800/40">
          <XCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-base font-bold text-red-200 tracking-wide">
            CRITICAL: Do NOT Do This
          </h3>
        </div>

        <ul className="space-y-3">
          {doNotDo.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start space-x-2.5 text-xs sm:text-sm text-red-200 leading-relaxed bg-red-950/40 p-3 rounded-xl border border-red-900/40"
            >
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
