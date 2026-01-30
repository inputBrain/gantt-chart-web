'use client';

import { BarChart3 } from 'lucide-react';

export default function StatisticsPage() {

  return (
    <div className="container mx-auto px-4 py-8 bg-[var(--background)] min-h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-[var(--accent)]" />
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Statistics
        </h1>
      </div>

      <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)] p-12 text-center shadow-lg">
        <BarChart3 className="mx-auto h-16 w-16 text-[var(--foreground-muted)]" />
        <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
          Coming Soon
        </h2>
        <p className="mt-2 text-[var(--foreground-muted)]">
          Statistics and analytics features will be available here soon.
        </p>
      </div>
    </div>
  );
}
