import Link from 'next/link';

// ─── Gantt illustration (G7) ──────────────────────────────────

function GanttIllustration() {
  return (
    <div className="w-[36rem] rounded-2xl border border-border-primary bg-bg-primary overflow-hidden shadow-sm">
      <div className="flex items-center border-b border-border-primary px-5 py-3 bg-bg-tertiary">
        <div className="w-28 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Task</div>
        <div className="flex flex-1">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map(m => (
            <div key={m} className="flex-1 text-center text-xs text-text-tertiary">{m}</div>
          ))}
        </div>
      </div>
      <div className="divide-y divide-border-primary">
        {[
          { label: 'Research',    left: '0%',  width: '35%', bar: 'bg-accent/20 border-accent/40' },
          { label: 'Design',      left: '25%', width: '30%', bar: 'bg-success/20 border-success/40' },
          { label: 'Development', left: '45%', width: '35%', bar: 'bg-accent/15 border-accent/30' },
        ].map(r => (
          <div key={r.label} className="flex items-center px-5 py-3.5">
            <div className="w-28 text-sm text-text-secondary">{r.label}</div>
            <div className="flex-1 h-6 relative">
              <div className={`absolute top-0 h-full rounded border ${r.bar}`} style={{ left: r.left, width: r.width }} />
            </div>
          </div>
        ))}
        <div className="flex items-center px-5 py-3.5" style={{ background: 'color-mix(in srgb, var(--danger) 10%, transparent)' }}>
          <div className="w-28 text-sm font-medium text-danger/70 line-through">Page</div>
          <div className="flex-1 h-6 relative">
            <div className="absolute inset-y-0 left-[55%] right-[5%] rounded border-2 border-dashed border-danger/45 flex items-center justify-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-danger/55 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
              <span className="text-xs text-danger/55">not found</span>
            </div>
          </div>
        </div>
        <div className="flex items-center px-5 py-3.5">
          <div className="w-28 text-sm text-text-secondary">Deploy</div>
          <div className="flex-1 h-6 relative">
            <div className="absolute top-0 h-full rounded bg-success/15 border border-success/30" style={{ left: '75%', width: '20%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center px-6">

      {/* T7 — 404 + лінії + PAGE NOT FOUND */}
      <p className="text-[8rem] font-bold leading-none tracking-tight tabular-nums text-accent">
        404
      </p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="h-px w-12 bg-border-secondary" />
        <h1 className="text-lg font-semibold text-text-secondary uppercase tracking-widest">
          Page Not Found
        </h1>
        <span className="h-px w-12 bg-border-secondary" />
      </div>
      <p className="mt-3 text-sm text-text-tertiary max-w-xs text-center leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved to a different URL.
      </p>

      {/* Gantt */}
      <div className="mt-8">
        <GanttIllustration />
      </div>

      {/* CTAs */}
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-accent text-accent-text text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Back to Projects
        </Link>
        <Link
          href="/pricing"
          className="px-6 py-2.5 rounded-xl border border-border-secondary text-text-secondary text-sm font-semibold hover:bg-bg-hover transition-colors"
        >
          Pricing
        </Link>
      </div>

    </div>
  );
}
