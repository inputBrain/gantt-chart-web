'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const iconColor = variant === 'danger' ? 'text-danger' : 'text-warning';
  const iconBg = variant === 'danger' ? 'bg-danger-light' : 'bg-warning-light';
  const confirmBg = variant === 'danger'
    ? 'bg-danger hover:opacity-90'
    : 'bg-warning hover:opacity-90';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-primary bg-bg-tertiary shadow-2xl">
        <div className="p-6 text-center">
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
            <svg
              className={`h-5 w-5 ${iconColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          <div className="mt-2 text-xs text-text-tertiary leading-relaxed">{message}</div>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-border-primary bg-bg-primary px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-bg-hover transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold text-accent-text transition-opacity ${confirmBg}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
