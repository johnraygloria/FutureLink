import React from 'react';

interface ActionsBarProps {
  selectedCount: number;
  onAction: (action: string) => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({ selectedCount, onAction }) => {
  const actions = [
    { label: 'Screening', accent: 'bg-info/20 hover:bg-info/30 text-info border-info/30' },
    { label: 'Assessment', accent: 'bg-success/20 hover:bg-success/30 text-success border-success/30' },
    { label: 'Selection', accent: 'bg-warning/20 hover:bg-warning/30 text-warning border-warning/30' },
    { label: 'Engagement', accent: 'bg-primary/20 hover:bg-primary/30 text-primary-light border-primary/30' },
  ];

  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-[#0d1219]/70 backdrop-blur-sm flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3 flex-wrap flex-1">
        {selectedCount > 0 ? (
          <>
            <span className="text-sm font-bold text-white bg-primary/15 px-3 py-1.5 rounded-full border border-primary/25">
              {selectedCount} Selected
            </span>
            <div className="flex gap-2 flex-wrap">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => onAction(action.label)}
                  className={`px-3.5 py-2 rounded-xl border transition-all text-xs font-bold uppercase tracking-wide active:scale-95 ${action.accent}`}
                >
                  To {action.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <span className="text-sm text-text-secondary/80 pl-1">Select applicants from the table to move them across pipeline stages.</span>
        )}
      </div>

      <button
        onClick={() => onAction('Export to Excel')}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-success/15 hover:bg-success/25 text-success border border-success/25 rounded-xl transition-all text-sm font-bold active:scale-95"
      >
        <i className="fas fa-file-excel" />
        Export to Excel
      </button>
    </div>
  );
};

export default ActionsBar;
