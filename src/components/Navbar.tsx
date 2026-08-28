import React from 'react';
import { Shield, Sparkles, Cpu, Lock, Key } from 'lucide-react';
import { SystemHealth } from '../types';

interface NavbarProps {
  health: SystemHealth | null;
  forceDemo: boolean;
  onToggleDemo: () => void;
  hasUserKey: boolean;
  onOpenKeyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  health,
  forceDemo,
  onToggleDemo,
  hasUserKey,
  onOpenKeyModal,
}) => {
  const isKeyActive = hasUserKey || Boolean(health?.hasGeminiKey);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-cyan-950 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping opacity-75" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                  LifeShield AI
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 uppercase tracking-wider">
                  v1.0
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-400 font-medium">
                Understand suspicious messages before they cost you.
              </p>
            </div>
          </div>

          {/* Right Actions & Badges */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Privacy Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Storage</span>
            </div>

            {/* PromptWars Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">PromptWars × PU</span>
            </div>

            {/* Connect / Manage API Key Button */}
            <button
              onClick={onOpenKeyModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isKeyActive
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.2)] animate-pulse'
              }`}
              title="Configure Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isKeyActive ? 'Gemini Connected' : 'Connect API Key'}</span>
            </button>

            {/* Mode Switcher / Indicator */}
            <button
              onClick={onToggleDemo}
              title={forceDemo ? "Switch to Live Gemini AI mode" : "Switch to Judge Demo mode"}
              className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                forceDemo
                  ? 'bg-amber-950/30 border-amber-800/60 text-amber-300 hover:bg-amber-950/50'
                  : isKeyActive
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/50'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>
                {forceDemo
                  ? 'Demo Engine'
                  : isKeyActive
                  ? 'Gemini 1.5/2.5 Live'
                  : 'Demo Engine'}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
