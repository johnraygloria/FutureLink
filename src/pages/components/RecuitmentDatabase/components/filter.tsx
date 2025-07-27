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
    <div className="mb-6 flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="searchInput" className="block text-sm font-medium text-gray-700 mb-2">
          Search by Name or Number
        </label>
        <input
          id="searchInput"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by first name, last name, or applicant number..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-teal focus:border-custom-teal"
        />
      </div>

      <div className="lg:w-64">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-teal focus:border-custom-teal"
        >
          <option value="">All</option>
          <option value="For Screening">For Screening</option>
          <option value="For Final Interview/For Assessment">For Final Interview/For Assessment</option>
          <option value="For Completion">For Completion</option>
          <option value="For Medical">For Medical</option>
          <option value="For SBMA Gate Pass">For SBMA Gate Pass</option>
          <option value="For Deployment">For Deployment</option>
          <option value="Deployed">Deployed</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;