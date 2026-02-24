'use client';

import { useTheme, THEMES, TEAMS_THEMES, Theme } from '@/context/ThemeContext';
import { usePlan } from '@/context/PlanContext';
import { ALL_PLAN_TIERS, PLAN_NAMES, PLAN_LIMITS } from '@/lib/plans';
import { Button } from '@/components/ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dark theme colors for display
const DARK_THEME_COLORS: Record<string, string> = {
  'teams-dark': '#1f1f1f',
  'teams-contrast': '#000000',
  'dark-purple': '#7c4dff',
  'dark-blue': '#3b82f6',
};

// Light themes (excluding dark themes)
const LIGHT_THEMES = THEMES.filter(t => !t.id.startsWith('dark-'));
// Dark themes from THEMES
const DARK_THEMES = THEMES.filter(t => t.id.startsWith('dark-'));

function formatLimit(v: number | null) {
  return v === null ? 'Unlimited' : String(v);
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { plan, setPlan } = usePlan();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-bg-tertiary p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-primary">Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="!p-1">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Light Themes Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-secondary">
            Light Themes
          </label>
          <div className="grid grid-cols-4 gap-3">
            {LIGHT_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                  theme === t.id
                    ? 'bg-bg-hover ring-2 ring-accent'
                    : 'bg-bg-secondary hover:bg-bg-hover'
                }`}
              >
                <div
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-xs font-medium text-text-secondary">
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Plan Section */}
        <div className="mt-5 space-y-3">
          <label className="text-sm font-medium text-text-secondary">Plan</label>
          <div className="grid grid-cols-3 gap-2">
            {ALL_PLAN_TIERS.map((tier) => {
              const lim = PLAN_LIMITS[tier];
              const isActive = plan === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setPlan(tier)}
                  className={`flex flex-col items-start gap-0.5 rounded-lg p-2.5 text-left transition-all ${
                    isActive ? 'bg-bg-hover ring-2 ring-accent' : 'bg-bg-secondary hover:bg-bg-hover'
                  }`}
                >
                  <span className={`text-xs font-semibold ${isActive ? 'text-accent' : 'text-text-primary'}`}>
                    {PLAN_NAMES[tier]}
                  </span>
                  <span className="text-[10px] text-text-tertiary leading-tight">
                    {formatLimit(lim.maxProjects)} proj · {formatLimit(lim.maxTasksPerProject)} tasks
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-text-quaternary">Demo only — simulates plan restrictions.</p>
        </div>

        {/* Dark Themes Section */}
        <div className="mt-5 space-y-3">
          <label className="text-sm font-medium text-text-secondary">
            Dark Themes
          </label>
          <div className="grid grid-cols-4 gap-3">
            {/* Dark Themes from THEMES */}
            {DARK_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                  theme === t.id
                    ? 'bg-bg-hover ring-2 ring-accent'
                    : 'bg-bg-secondary hover:bg-bg-hover'
                }`}
              >
                <div
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-xs font-medium text-text-secondary">
                  {t.name.replace('Dark ', '')}
                </span>
              </button>
            ))}
            {/* Teams Dark Themes */}
            {TEAMS_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as Theme)}
                className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                  theme === t.id
                    ? 'bg-bg-hover ring-2 ring-accent'
                    : 'bg-bg-secondary hover:bg-bg-hover'
                }`}
              >
                <div
                  className="h-8 w-8 rounded-full border border-border-secondary"
                  style={{ backgroundColor: DARK_THEME_COLORS[t.id] }}
                >
                  {t.id === 'teams-contrast' && (
                    <div className="h-full w-full rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-yellow-400" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-text-secondary">
                  {t.name.replace('Teams ', '')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
