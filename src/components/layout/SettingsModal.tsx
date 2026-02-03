'use client';

import { useTheme, THEMES } from '@/context/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-bg-primary p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-hover hover:text-text-primary transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Theme Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-secondary">
            Theme
          </label>
          <div className="grid grid-cols-4 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 rounded-lg p-3 transition-all ${
                  theme === t.id
                    ? 'bg-bg-tertiary ring-2 ring-accent'
                    : 'bg-bg-secondary hover:bg-bg-tertiary'
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
      </div>
    </div>
  );
}
