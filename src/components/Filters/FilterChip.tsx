import React from "react";
import { IconX } from "@tabler/icons-react";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-custom-teal/10 text-custom-teal rounded-full text-sm border border-custom-teal/30">
    <span className="font-medium">{label}</span>
    <button
      onClick={onRemove}
      className="hover:bg-custom-teal/20 rounded-full p-0.5 transition-colors"
      aria-label="Remove filter"
    >
      <IconX size={14} />
    </button>
  </div>
);

export default FilterChip;
