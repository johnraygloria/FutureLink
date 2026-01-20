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
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {options.length === 0 && (
          <p className="text-sm text-gray-500 italic">No data available</p>
        )}
        {options.map(option => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="w-4 h-4 text-custom-teal focus:ring-custom-teal border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
