import React, { useEffect } from 'react';

type Tone = 'primary' | 'warning' | 'danger';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  tone?: Tone;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Hide the cancel button (e.g. an informational, single-action dialog). */
  hideCancel?: boolean;
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

const toneStyles: Record<Tone, { badge: string; confirm: string }> = {
  primary: {
    badge: 'bg-primary/15 text-primary-light border-primary/25',
    confirm: 'bg-primary hover:bg-primary-light text-white border-primary/40 shadow-lg shadow-primary/20',
  },
  warning: {
    badge: 'bg-warning/15 text-warning border-warning/25',
    confirm: 'bg-warning hover:brightness-110 text-[#1a1200] border-warning/40 shadow-lg shadow-warning/20',
  },
  danger: {
    badge: 'bg-danger/15 text-danger border-danger/25',
    confirm: 'bg-danger hover:brightness-110 text-white border-danger/40 shadow-lg shadow-danger/20',
  },
};

/**
 * On-brand replacement for window.confirm(). Renders a centered, theme-styled
 * dialog with a tone-colored accent, an optional icon, a free-form body, and
 * Confirm/Cancel actions. Closes on backdrop click and Escape.
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  subtitle,
  icon,
  tone = 'primary',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  hideCancel = false,
  isBusy = false,
  onConfirm,
  onCancel,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isBusy) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isBusy, onCancel]);

  if (!isOpen) return null;
  const t = toneStyles[tone];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      onClick={() => { if (!isBusy) onCancel(); }}
    >
      <div
        className="w-full max-w-md bg-[#0b1018]/98 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[3px] bg-gradient-to-r from-primary via-primary-light to-info/80" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {icon && (
              <div className={`flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl border ${t.badge}`}>
                {icon}
              </div>
            )}
            <div className="min-w-0 pt-0.5">
              <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
              {subtitle && <p className="text-sm text-text-secondary mt-1 leading-relaxed">{subtitle}</p>}
            </div>
          </div>

          {children && <div className="mt-5">{children}</div>}

          <div className="mt-6 flex items-center justify-end gap-2.5">
            {!hideCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isBusy}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-white border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm}
              disabled={isBusy}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 ${t.confirm}`}
            >
              {isBusy && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
