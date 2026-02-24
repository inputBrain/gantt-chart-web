'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[ProjectError]', error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-97px)] items-center justify-center bg-bg-secondary">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-light">
          <svg
            className="h-7 w-7 text-danger"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary">Something went wrong</h2>
          <p className="mt-1 text-sm text-text-tertiary">
            {error.message || 'An unexpected error occurred while loading the project.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-text hover:bg-accent-hover transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-border-primary px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-hover transition-colors"
          >
            Back to projects
          </Link>
        </div>
      </div>
    </div>
  );
}
