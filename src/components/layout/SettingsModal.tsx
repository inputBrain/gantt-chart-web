'use client';

import { useTheme, THEMES, TEAMS_THEMES, Theme } from '@/context/ThemeContext';
import { usePlan, GeoOverride } from '@/context/PlanContext';
import { ALL_PLAN_TIERS, PLAN_NAMES, PLAN_LIMITS } from '@/lib/plans';
import { Button } from '@/components/ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DARK_THEME_COLORS: Record<string, string> = {
  'teams-dark': '#1f1f1f',
  'teams-contrast': '#000000',
  'dark-purple': '#7c4dff',
  'dark-blue': '#3b82f6',
};

const LIGHT_THEMES = THEMES.filter(t => !t.id.startsWith('dark-'));
const DARK_THEMES  = THEMES.filter(t => t.id.startsWith('dark-'));

function formatLimit(v: number | null) {
  return v === null ? '∞' : String(v);
}

const GEO_OPTIONS: { value: GeoOverride; label: string; sub: string }[] = [
  { value: null,  label: 'Auto',    sub: 'real IP' },
  { value: 'UA',  label: 'Ukraine', sub: 'UAH prices' },
  { value: 'EU',  label: 'Europe',  sub: 'USD prices' },
  { value: 'US',  label: 'USA',     sub: 'USD prices' },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { plan, setPlan, geoOverride, setGeoOverride } = usePlan();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-bg-tertiary p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-primary">Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="!p-1">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* ── Light Themes ─────────────────────────────── */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-secondary">Light Themes</label>
          <div className="grid grid-cols-4 gap-3">
            {LIGHT_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                  theme === t.id ? 'bg-bg-hover ring-2 ring-accent' : 'bg-bg-secondary hover:bg-bg-hover'
                }`}
              >
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-xs font-medium text-text-secondary">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Dark Themes ──────────────────────────────── */}
        <div className="mt-5 space-y-3">
          <label className="text-sm font-medium text-text-secondary">Dark Themes</label>
          <div className="grid grid-cols-4 gap-3">
            {DARK_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                  theme === t.id ? 'bg-bg-hover ring-2 ring-accent' : 'bg-bg-secondary hover:bg-bg-hover'
                }`}
              >
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-xs font-medium text-text-secondary">{t.name.replace('Dark ', '')}</span>
              </button>
            ))}
            {TEAMS_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as Theme)}
                className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                  theme === t.id ? 'bg-bg-hover ring-2 ring-accent' : 'bg-bg-secondary hover:bg-bg-hover'
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
                <span className="text-xs font-medium text-text-secondary">{t.name.replace('Teams ', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── For Testing Only ─────────────────────────── */}
        <div className="mt-6 rounded-xl border border-dashed border-border-secondary bg-bg-secondary p-4 space-y-4">
          {/* Section label */}
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 text-text-quaternary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01-.659 1.591l-1.591 1.591a2.25 2.25 0 01-3.182 0l-1.591-1.591a2.25 2.25 0 01-.659-1.591v-2.5M19.8 15H5M5 15a2.25 2.25 0 00-.659 1.591l-1.591 1.591a2.25 2.25 0 003.182 0l1.591-1.591A2.25 2.25 0 008.182 15H5z" />
            </svg>
            <span className="text-xs font-semibold text-text-quaternary uppercase tracking-widest">For testing only</span>
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-tertiary">Active plan</label>
            <div className="grid grid-cols-3 gap-1.5">
              {ALL_PLAN_TIERS.map((tier) => {
                const lim = PLAN_LIMITS[tier];
                const isActive = plan === tier;
                return (
                  <button
                    key={tier}
                    onClick={() => setPlan(tier)}
                    className={`flex flex-col items-start gap-0.5 rounded-lg p-2.5 text-left transition-all ${
                      isActive ? 'bg-bg-hover ring-2 ring-accent' : 'bg-bg-primary hover:bg-bg-hover'
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
          </div>

          {/* Geo */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-tertiary">Geo / pricing region</label>
            <div className="grid grid-cols-4 gap-1.5">
              {GEO_OPTIONS.map(({ value, label, sub }) => {
                const isActive = geoOverride === value;
                return (
                  <button
                    key={String(value)}
                    onClick={() => setGeoOverride(value)}
                    className={`flex flex-col items-start gap-0.5 rounded-lg p-2.5 text-left transition-all ${
                      isActive ? 'bg-bg-hover ring-2 ring-accent' : 'bg-bg-primary hover:bg-bg-hover'
                    }`}
                  >
                    <span className={`text-xs font-semibold ${isActive ? 'text-accent' : 'text-text-primary'}`}>
                      {label}
                    </span>
                    <span className="text-[10px] text-text-tertiary leading-tight">{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-text-quaternary leading-relaxed">
            These settings simulate plan restrictions and pricing regions for demo purposes. They are persisted in localStorage and have no real effect.
          </p>
        </div>

      </div>
    </div>
  );
}
