import React from 'react';

interface ActionsBarProps {
  selectedCount: number;
  onAction: (action: string) => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({ selectedCount, onAction }) => {
  const actions = [
    { label: 'Screening', color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Assessment', color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Final Interview', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Medical', color: 'bg-orange-600 hover:bg-orange-700' },
    { label: 'SBMA Gate Pass', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { label: 'Deployment', color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div className="mb-4 p-3 bg-slate-700/50 backdrop-blur-sm rounded-xl border border-white/5 flex items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-4 flex-wrap flex-1">
        {selectedCount > 0 ? (
          <>
            <span className="text-sm font-bold text-white bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
              {selectedCount} Selected
            </span>
            <div className="flex gap-2 flex-wrap">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => onAction(action.label)}
                  className={`px-3 py-1.5 ${action.color} text-white rounded-lg transition-all text-xs font-semibold shadow-md active:scale-95`}
                >
                  To {action.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <span className="text-sm text-text-secondary italic pl-2">Select applicants to perform actions</span>
        )}
      </div>

      {/* Export to Excel button */}
      <button
        onClick={() => onAction('Export to Excel')}
        className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-all text-sm font-bold shadow-lg flex items-center gap-2 border border-white/10 active:scale-95"
      >
        <i className="fas fa-file-excel"></i>
        Export to Excel
      </button>
    </div>
  );
};

export default ActionsBar;