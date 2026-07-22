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
          <optgroup label="Screening" className="bg-slate-900 text-white">
            <option value="For Screening" className="bg-slate-900 text-white">For Screening</option>
            <option value="Doc Screening" className="bg-slate-900 text-white">Doc Screening</option>
            <option value="Physical Screening" className="bg-slate-900 text-white">Physical Screening</option>
          </optgroup>
          <optgroup label="Assessment" className="bg-slate-900 text-white">
            <option value="Initial Interview" className="bg-slate-900 text-white">Initial Interview</option>
            <option value="For Completion" className="bg-slate-900 text-white">For Completion</option>
            <option value="For Final Interview/For Assessment" className="bg-slate-900 text-white">For Final Interview/For Assessment</option>
            <option value="Final Interview" className="bg-slate-900 text-white">Final Interview</option>
            <option value="Final Interview/Incomplete Requirements" className="bg-slate-900 text-white">Final Interview/Incomplete Requirements</option>
            <option value="Final Interview/Complete Requirements" className="bg-slate-900 text-white">Final Interview/Complete Requirements</option>
          </optgroup>
          <optgroup label="Selection" className="bg-slate-900 text-white">
            <option value="For Medical" className="bg-slate-900 text-white">For Medical</option>
            <option value="Pending For Medical" className="bg-slate-900 text-white">Pending For Medical</option>
            <option value="Biometrics" className="bg-slate-900 text-white">Biometrics</option>
            <option value="For SBMA Gate Pass" className="bg-slate-900 text-white">For SBMA Gate Pass</option>
          </optgroup>
          <optgroup label="Engagement" className="bg-slate-900 text-white">
            <option value="For Onboarding" className="bg-slate-900 text-white">For Onboarding</option>
            <option value="On Boarding" className="bg-slate-900 text-white">On Boarding</option>
            <option value="For Onboarding Orientation" className="bg-slate-900 text-white">For Onboarding Orientation</option>
            <option value="For Deployment" className="bg-slate-900 text-white">For Deployment</option>
            <option value="Deployed" className="bg-slate-900 text-white">Deployed</option>
          </optgroup>
          <optgroup label="Other" className="bg-slate-900 text-white">
            <option value="Blacklisted" className="bg-slate-900 text-white">Blacklisted</option>
            <option value="Not interested" className="bg-slate-900 text-white">Not interested</option>
          </optgroup>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
          <i className="fas fa-chevron-down text-xs" />
        </div>
      </div>
    </div>
  );
};

export default Filters;
