import React from 'react';
import { Gift, ShieldAlert, Briefcase, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
import { PRESETS } from '../data/presets';
import { PresetScenario } from '../types';

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetScenario) => void;
  selectedPresetId?: string;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelectPreset,
  selectedPresetId,
}) => {
  const getIcon = (iconName: PresetScenario['iconName']) => {
    switch (iconName) {
      case 'gift':
        return <Gift className="w-4 h-4 text-rose-400" />;
      case 'shield-alert':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'trending-up':
        return <TrendingUp className="w-4 h-4 text-orange-400" />;
      case 'check-circle':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">
            Judge & Demo Test Scenarios (1-Click Presets)
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Click any preset to populate & analyze instantly
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`group text-left p-3 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 group-hover:border-slate-700">
                  {getIcon(preset.iconName)}
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${preset.badgeColor}`}
                >
                  {preset.expectedRisk}
                </span>
              </div>

              <div className="font-semibold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {preset.title}
              </div>

              <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                {preset.category}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
