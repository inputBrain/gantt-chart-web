/**
 * Theme configuration for the Gantt Chart
 *
 * To change theme: update CSS variables in globals.css
 * or swap the entire :root block with a different preset
 */

export const themePresets = {
  // Crypto Exchange Light (Binance/Bybit inspired)
  cryptoLight: {
    // Backgrounds
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#fafafa',
    '--bg-tertiary': '#f5f5f5',
    '--bg-hover': '#f0f0f0',
    '--bg-active': '#e8e8e8',

    // Borders
    '--border-primary': '#eaecef',
    '--border-secondary': '#e0e3e7',
    '--border-focus': '#b7bdc6',

    // Text
    '--text-primary': '#1e2329',
    '--text-secondary': '#474d57',
    '--text-tertiary': '#848e9c',
    '--text-quaternary': '#b7bdc6',

    // Accent (main brand color)
    '--accent': '#f0b90b',
    '--accent-hover': '#d9a60a',
    '--accent-light': '#fef6d8',
    '--accent-text': '#1e2329',

    // Semantic colors
    '--success': '#0ecb81',
    '--success-light': '#e6f9f1',
    '--danger': '#f6465d',
    '--danger-light': '#fef0f2',
    '--warning': '#f0b90b',
    '--warning-light': '#fef6d8',
    '--info': '#1e88e5',
    '--info-light': '#e3f2fd',

    // Today indicator
    '--today': '#f0b90b',
    '--today-bg': '#fef6d8',
  },

  // Alternative: Blue accent (Coinbase/Kraken inspired)
  cryptoBlue: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    '--bg-tertiary': '#f1f5f9',
    '--bg-hover': '#e2e8f0',
    '--bg-active': '#cbd5e1',

    '--border-primary': '#e2e8f0',
    '--border-secondary': '#cbd5e1',
    '--border-focus': '#94a3b8',

    '--text-primary': '#0f172a',
    '--text-secondary': '#475569',
    '--text-tertiary': '#94a3b8',
    '--text-quaternary': '#cbd5e1',

    '--accent': '#0052ff',
    '--accent-hover': '#0047e0',
    '--accent-light': '#eff6ff',
    '--accent-text': '#ffffff',

    '--success': '#16a34a',
    '--success-light': '#f0fdf4',
    '--danger': '#dc2626',
    '--danger-light': '#fef2f2',
    '--warning': '#f59e0b',
    '--warning-light': '#fffbeb',
    '--info': '#0052ff',
    '--info-light': '#eff6ff',

    '--today': '#0052ff',
    '--today-bg': '#eff6ff',
  },
} as const;

export type ThemePreset = keyof typeof themePresets;

// Task colors - these stay consistent across themes
export const taskColorTokens = {
  blue: {
    bg: 'var(--task-blue-bg)',
    fill: 'var(--task-blue)',
    border: 'var(--task-blue)',
  },
  green: {
    bg: 'var(--task-green-bg)',
    fill: 'var(--task-green)',
    border: 'var(--task-green)',
  },
  purple: {
    bg: 'var(--task-purple-bg)',
    fill: 'var(--task-purple)',
    border: 'var(--task-purple)',
  },
  orange: {
    bg: 'var(--task-orange-bg)',
    fill: 'var(--task-orange)',
    border: 'var(--task-orange)',
  },
  red: {
    bg: 'var(--task-red-bg)',
    fill: 'var(--task-red)',
    border: 'var(--task-red)',
  },
  teal: {
    bg: 'var(--task-teal-bg)',
    fill: 'var(--task-teal)',
    border: 'var(--task-teal)',
  },
  pink: {
    bg: 'var(--task-pink-bg)',
    fill: 'var(--task-pink)',
    border: 'var(--task-pink)',
  },
  yellow: {
    bg: 'var(--task-yellow-bg)',
    fill: 'var(--task-yellow)',
    border: 'var(--task-yellow)',
  },
} as const;
