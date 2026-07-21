import React from 'react';

type PipelineActionBarProps = {
  search: string;
  setSearch: (value: string) => void;
  searchPlaceholder?: string;
  onViewHistory?: () => void;
  onViewBlacklist?: () => void;
  blacklistCount?: number;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
};

const PipelineActionBar: React.FC<PipelineActionBarProps> = ({
  search,
  setSearch,
  searchPlaceholder = 'Search by name, ID, or position...',
  onViewHistory,
  onViewBlacklist,
  blacklistCount,
  primaryAction,
}) => (
  <div className="flex flex-col gap-3 px-5 sm:px-6 py-4 border-b border-white/10 bg-[#0d1219]/60 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-2 flex-wrap">
      {primaryAction && (
        <button
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary-light transition-all active:scale-95 border border-primary-light/40"
          onClick={primaryAction.onClick}
        >
          {primaryAction.icon && <i className={`fas ${primaryAction.icon}`} />}
          {primaryAction.label}
        </button>
      )}
      {onViewHistory && (
        <button
          onClick={onViewHistory}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white text-sm font-medium shadow-sm hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
        >
          <i className="fas fa-clock-rotate-left text-text-secondary" />
          View History
        </button>
      )}
      {onViewBlacklist && (
        <button
          onClick={onViewBlacklist}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-danger/10 text-danger text-sm font-medium shadow-sm hover:bg-danger/20 transition-all border border-danger/25"
        >
          <i className="fas fa-ban" />
          Blacklisted
          {typeof blacklistCount === 'number' && blacklistCount > 0 && (
            <span className="ml-0.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-danger/20 text-danger text-[11px] font-bold">
              {blacklistCount}
            </span>
          )}
        </button>
      )}
    </div>

    <div className="relative w-full sm:w-80 group">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
        <i className="fas fa-search" />
      </span>
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-black/20 text-white placeholder-text-secondary/50 transition-all hover:bg-black/30"
        aria-label="Search applicants"
      />
    </div>
  </div>
);

export default PipelineActionBar;
