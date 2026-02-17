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
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <div className="flex-1">
        <label htmlFor="searchInput" className="block text-sm font-medium text-text-secondary mb-2">
          Search by Name or Number
        </label>
        <input
          id="searchInput"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by first name, last name, or applicant number..."
          className="block w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
        />
      </div>

      <div className="w-full lg:w-64">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-text-secondary mb-2">
          Filter by Status
        </label>
        <div className="relative">
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="block w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner cursor-pointer"
          >
            <option value="" className="bg-slate-800 text-white">All</option>
            <option value="For Screening" className="bg-slate-800 text-white">For Screening</option>
            <option value="For Final Interview/For Assessment" className="bg-slate-800 text-white">For Final Interview/For Assessment</option>
            <option value="For Completion" className="bg-slate-800 text-white">For Completion</option>
            <option value="For Medical" className="bg-slate-800 text-white">For Medical</option>
            <option value="For SBMA Gate Pass" className="bg-slate-800 text-white">For SBMA Gate Pass</option>
            <option value="For Deployment" className="bg-slate-800 text-white">For Deployment</option>
            <option value="Deployed" className="bg-slate-800 text-white">Deployed</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;