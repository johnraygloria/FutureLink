import React from "react";

interface NumberRangeFilterProps {
  title: string;
  min?: number;
  max?: number;
  onChange: (min?: number, max?: number) => void;
}

const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({ title, min, max, onChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : parseInt(e.target.value);
    onChange(value, max);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : parseInt(e.target.value);
    onChange(min, value);
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-white mb-3 tracking-wide">{title}</h3>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs text-text-secondary mb-1.5 uppercase font-medium tracking-wide">Min</label>
          <input
            type="number"
            value={min ?? ''}
            onChange={handleMinChange}
            placeholder="Min"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-text-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
        </div>
        <span className="text-text-secondary/50 mt-6">—</span>
        <div className="flex-1">
          <label className="block text-xs text-text-secondary mb-1.5 uppercase font-medium tracking-wide">Max</label>
          <input
            type="number"
            value={max ?? ''}
            onChange={handleMaxChange}
            placeholder="Max"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-text-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default NumberRangeFilter;
