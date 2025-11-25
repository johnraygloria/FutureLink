import React from "react";
import { IconFilter } from "@tabler/icons-react";
import FilterChip from "./FilterChip";
import type { ActiveFilter } from "./filterUtils";

interface FilterBarProps {
  activeFilters: ActiveFilter[];
  onOpenFilters: () => void;
  onRemoveFilter: (filter: ActiveFilter) => void;
  onClearAll: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters,
  onOpenFilters,
  onRemoveFilter,
  onClearAll
}) => {
  return (
    <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center gap-3 flex-wrap">
      {/* Filter Button */}
      <button
        onClick={onOpenFilters}
        className="flex items-center gap-2 px-4 py-2 bg-custom-teal text-white rounded-md hover:bg-teal-700 transition-colors"
      >
        <IconFilter size={18} />
        <span>Filters</span>
        {activeFilters.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-white text-custom-teal rounded-full text-xs font-semibold">
            {activeFilters.length}
          </span>
        )}
      </button>

      {/* Active Filter Chips */}
      {activeFilters.map((filter, idx) => (
        <FilterChip
          key={`${filter.field}-${filter.value}-${idx}`}
          label={filter.label}
          onRemove={() => onRemoveFilter(filter)}
        />
      ))}

      {/* Clear All Button */}
      {activeFilters.length > 0 && (
        <button
          onClick={onClearAll}
          className="ml-auto text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterBar;
