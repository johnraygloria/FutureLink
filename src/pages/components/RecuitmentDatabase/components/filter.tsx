import React from 'react';

interface FiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-3 w-full">
      <div className="relative group">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
          <i className="fas fa-search" />
        </span>
        <input
          id="searchInput"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or applicant number..."
          className="block w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
      </div>

      <div className="relative">
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="block w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
        >
          <option value="" className="bg-slate-900 text-white">All Statuses</option>
          <option value="For Screening" className="bg-slate-900 text-white">For Screening</option>
          <option value="For Final Interview/For Assessment" className="bg-slate-900 text-white">For Final Interview/For Assessment</option>
          <option value="For Completion" className="bg-slate-900 text-white">For Completion</option>
          <option value="For Medical" className="bg-slate-900 text-white">For Medical</option>
          <option value="For SBMA Gate Pass" className="bg-slate-900 text-white">For SBMA Gate Pass</option>
          <option value="For Deployment" className="bg-slate-900 text-white">For Deployment</option>
          <option value="Deployed" className="bg-slate-900 text-white">Deployed</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
          <i className="fas fa-chevron-down text-xs" />
        </div>
      </div>
    </div>
  );
};

export default Filters;
