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
    <div className="mb-4 p-4 bg-custom-teal/10 rounded-lg border border-custom-teal/20">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          {selectedCount > 0 && (
            <span className="text-sm font-medium text-custom-teal">
              {selectedCount} applicant(s) selected
            </span>
          )}
          {selectedCount > 0 && (
            <div className="flex gap-2 flex-wrap">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => onAction(action.label)}
                  className={`px-4 py-2 ${action.color} text-white rounded-md transition text-sm`}
                >
                  Go to {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Export to Excel button - always visible */}
        <button
          onClick={() => onAction('Export to Excel')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition text-sm flex items-center gap-2"
        >
          <i className="fas fa-file-excel"></i>
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default ActionsBar;