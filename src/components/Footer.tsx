import React from 'react';
import { Shield, Lock, Zap, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#060a12]/80 backdrop-blur-sm py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8 border-b border-slate-800/60">
          
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Zero-Storage Architecture</div>
              <div className="text-[11px] text-slate-400">Messages are never logged or stored</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Real-Time Threat Detection</div>
              <div className="text-[11px] text-slate-400">Heuristic & AI multi-vector scanner</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">PromptWars Competition</div>
              <div className="text-[11px] text-slate-400">Parul University AI Hackathon</div>
            </div>
          </div>

        </div>

        {/* Bottom Details */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span className="font-bold text-slate-300">LifeShield AI</span>
            <span>—</span>
            <span>Understand suspicious messages before they cost you.</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>Built for PromptWars × Parul University</span>
            <span>•</span>
            <span>Version 1.0.0</span>
          </div>

        </div>

      </div>
    </footer>
  );
};
