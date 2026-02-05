import React from "react";

interface FilterGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, options, selected, onChange }) => {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-white mb-3 tracking-wide">{title}</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {options.length === 0 && (
          <p className="text-sm text-text-secondary/60 italic px-1">No data available</p>
        )}
        {options.map(option => (
          <label
            key={option}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50 focus:ring-offset-0 transition-all cursor-pointer"
            />
            <span className="text-sm text-text-secondary group-hover:text-white transition-colors">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
