import Link from 'next/link';

interface PlanLimitAlertProps {
  message: string;
}

export function PlanLimitAlert({ message }: PlanLimitAlertProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <p className="text-warning leading-relaxed">
        {message}{' '}
        <Link href="/pricing" className="font-semibold underline hover:no-underline">
          Upgrade plan →
        </Link>
      </p>
    </div>
  );
}
