import React from "react";

type AssessmentToolbarProps = {
  search: string;
  setSearch: (s: string) => void;
  usersCount: number;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
};

const AssessmentToolbar: React.FC<AssessmentToolbarProps> = ({ 
  search, 
  setSearch, 
  usersCount, 
  setShowHistory 
}) => {
  return (
    <div className="flex flex-col gap-4 p-6 border-b bg-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Assessment</h1>
        <span className="inline-flex items-center rounded-full bg-custom-teal/10 text-custom-teal px-2.5 py-0.5 text-xs font-medium border border-custom-teal/30">{usersCount}</span>
        <button
          onClick={() => setShowHistory(true)}
          className="ml-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium shadow-sm focus:outline-none hover:bg-gray-800"
        >
          View History
        </button>
      </div>
      <div className="relative w-full sm:w-auto">
        <span className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
          <i className="fas fa-search" />
        </span>
        <input
          type="text"
          placeholder="Search by name or position"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-teal/30 bg-gray-50"
          aria-label="Search applicants"
        />
      </div>
    </div>
  );
};

export default AssessmentToolbar;