import React from "react";

type EngagementToolbarProps = {
  search: string;
  setSearch: (s: string) => void;
  usersCount: number;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
};

const EngagementToolbar: React.FC<EngagementToolbarProps> = ({
  search,
  setSearch,
  usersCount,
  setShowHistory
}) => {
  return (
    <div className="flex flex-col gap-4 p-6 border-b border-white/10 bg-transparent sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Engagement</h1>
        <span className="inline-flex items-center rounded-full bg-primary/20 text-primary-light px-3 py-1 text-xs font-bold border border-primary/30 shadow-[0_0_10px_0_rgba(0,128,129,0.2)]">
          {usersCount}
        </span>
        <button
          onClick={() => setShowHistory(true)}
          className="ml-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium shadow-lg hover:bg-white/20 transition-all border border-white/10 hover:border-white/20"
        >
          View History
        </button>
      </div>
      <div className="relative w-full sm:w-auto group">
        <span className="pointer-events-none absolute left-3 top-2.5 text-text-secondary group-focus-within:text-primary transition-colors">
          <i className="fas fa-search" />
        </span>
        <input
          type="text"
          placeholder="Search by name or position"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/5 text-white placeholder-text-secondary/50 transition-all hover:bg-white/10"
          aria-label="Search applicants"
        />
      </div>
    </div>
  );
};

export default EngagementToolbar;