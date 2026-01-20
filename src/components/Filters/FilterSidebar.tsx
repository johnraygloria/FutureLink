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
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  users,
  filters,
  onApplyFilters,
  onClearFilters
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
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-30 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sliding Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full z-40 flex flex-col transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ maxWidth: '600px' }}
      >
        <div className="bg-white h-full flex flex-col shadow-2xl border-l border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconFilter size={24} className="text-custom-teal" />
              <h2 className="text-xl font-bold text-gray-800">Filter Applicants</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close filters"
            >
              <IconX size={24} />
            </button>
          </div>

          {/* Scrollable Filter Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
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

            {/* Status Filter - Hardcoded 3 options */}
            <FilterGroup
              title="Status"
              options={STATUS_OPTIONS}
              selected={localFilters.status}
              onChange={(selected) => setLocalFilters({ ...localFilters, status: selected })}
            />
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-custom-teal text-white rounded-md hover:bg-teal-700 transition-colors"
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
