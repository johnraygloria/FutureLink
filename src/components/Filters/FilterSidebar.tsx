import React, { useState, useEffect } from "react";
import { IconFilter, IconX } from "@tabler/icons-react";
import type { User } from "../../api/applicant";
import FilterGroup from "./FilterGroup";
import NumberRangeFilter from "./NumberRangeFilter";
import { getUniqueValues, STATUS_OPTIONS } from "./filterUtils";
import type { FilterCriteria } from "./filterUtils";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  filters: FilterCriteria;
  onApplyFilters: (filters: FilterCriteria) => void;
  onClearFilters: () => void;
  statusOptions?: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  users,
  filters,
  onApplyFilters,
  onClearFilters,
  statusOptions
}) => {
  // Local state for staged filter changes
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters);

  // Update local filters when external filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Generate dynamic filter options from current data
  const genderOptions = getUniqueValues(users, 'gender');
  const sizeOptions = getUniqueValues(users, 'size');
  const locationOptions = getUniqueValues(users, 'location');
  const experienceOptions = getUniqueValues(users, 'experience');
  const positionOptions = getUniqueValues(users, 'positionApplied');
  const referredByOptions = getUniqueValues(users, 'referredBy');

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    onClearFilters();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-30 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sliding Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full z-40 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{ maxWidth: '600px' }}
      >
        <div className="bg-[#0f172a]/95 backdrop-blur-2xl h-full flex flex-col shadow-2xl border-l border-white/10 relative">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <IconFilter size={24} className="text-primary-light" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Filter Applicants</h2>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg"
              aria-label="Close filters"
            >
              <IconX size={24} />
            </button>
          </div>

          {/* Scrollable Filter Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
            {/* Gender Filter */}
            <FilterGroup
              title="Gender"
              options={genderOptions}
              selected={localFilters.gender}
              onChange={(selected) => setLocalFilters({ ...localFilters, gender: selected })}
            />

            {/* Size Filter */}
            <FilterGroup
              title="Size"
              options={sizeOptions}
              selected={localFilters.size}
              onChange={(selected) => setLocalFilters({ ...localFilters, size: selected })}
            />

            {/* Location Filter */}
            <FilterGroup
              title="Location"
              options={locationOptions}
              selected={localFilters.location}
              onChange={(selected) => setLocalFilters({ ...localFilters, location: selected })}
            />

            {/* Experience Filter */}
            <FilterGroup
              title="Experience"
              options={experienceOptions}
              selected={localFilters.experience}
              onChange={(selected) => setLocalFilters({ ...localFilters, experience: selected })}
            />

            {/* Position Filter */}
            <FilterGroup
              title="Position"
              options={positionOptions}
              selected={localFilters.positionApplied}
              onChange={(selected) => setLocalFilters({ ...localFilters, positionApplied: selected })}
            />

            {/* Referred By Filter */}
            <FilterGroup
              title="Referred By"
              options={referredByOptions}
              selected={localFilters.referredBy}
              onChange={(selected) => setLocalFilters({ ...localFilters, referredBy: selected })}
            />

            {/* Age Range Filter */}
            <NumberRangeFilter
              title="Age"
              min={localFilters.age.min}
              max={localFilters.age.max}
              onChange={(min, max) => setLocalFilters({ ...localFilters, age: { min, max } })}
            />

            {/* Status Filter */}
            <FilterGroup
              title="Status"
              options={statusOptions || STATUS_OPTIONS}
              selected={localFilters.status}
              onChange={(selected) => setLocalFilters({ ...localFilters, status: selected })}
            />
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-6 border-t border-white/10 flex gap-4 bg-white/5">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              Clear Filters
            </button>
            <button
              onClick={handleApply}
              className="flex-1 btn-premium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
