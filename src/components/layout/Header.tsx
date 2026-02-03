'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SettingsModal } from './SettingsModal';

const navItems = [
  { href: '/', label: 'Timeline' },
  // { href: '/statistic', label: 'Statistic' },
];

export function Header() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center bg-bg-secondary px-6 py-4">
        <div className="flex items-center gap-16 rounded-xl bg-bg-tertiary p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-8 py-2.5 text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-bg-primary text-text-primary shadow-sm'
                    : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute right-6 flex h-10 w-10 items-center justify-center rounded-lg bg-bg-tertiary text-text-tertiary hover:bg-bg-hover hover:text-text-primary transition-colors"
          title="Settings"
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
