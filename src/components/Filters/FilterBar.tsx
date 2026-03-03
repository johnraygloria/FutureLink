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
    <div className="bg-white/5 backdrop-blur-md px-6 py-3 border-b border-white/10 flex items-center gap-3 flex-wrap">
      {/* Filter Button */}
      <button
        onClick={onOpenFilters}
        className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-light border border-primary/30 rounded-xl hover:bg-primary/30 transition-all active:scale-95 group"
      >
        <IconFilter size={18} className="group-hover:rotate-180 transition-transform duration-500" />
        <span className="font-semibold text-sm">Filters</span>
        {activeFilters.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-primary text-white rounded-md text-[10px] font-bold shadow-sm">
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
          className="ml-auto text-sm text-text-secondary hover:text-danger hover:underline transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterBar;
