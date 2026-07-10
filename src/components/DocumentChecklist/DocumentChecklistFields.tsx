import React from 'react';
import { CHECKLIST_ITEMS, DOCUMENT_NUMBER_FIELDS } from '../../constants/documentChecklist';

const formCheckboxClass =
  'w-5 h-5 rounded border-white/20 bg-white/5 text-custom-teal focus:ring-custom-teal/50 focus:ring-offset-0 transition-all cursor-pointer';

const sidebarCheckboxClass =
  'w-4 h-4 rounded border-white/20 bg-black/20 text-primary focus:ring-primary/40 focus:ring-offset-0 transition-all cursor-pointer';

type DocumentChecklistFieldsProps = {
  values: Record<string, boolean | string | undefined>;
  onCheckboxChange: (key: string, checked: boolean) => void;
  onNumberChange: (numberKey: string, value: string) => void;
  onNumberBlur?: (numberKey: string, value: string) => void;
  variant?: 'form' | 'sidebar';
  numberInputClassName?: string;
};

const DocumentChecklistFields: React.FC<DocumentChecklistFieldsProps> = ({
  values,
  onCheckboxChange,
  onNumberChange,
  onNumberBlur,
  variant = 'form',
  numberInputClassName,
}) => {
  const checkboxClass = variant === 'sidebar' ? sidebarCheckboxClass : formCheckboxClass;
  const defaultNumberClass =
    variant === 'sidebar'
      ? 'w-full bg-black/20 border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all'
      : 'w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-custom-teal/50';

  const gridClass =
    variant === 'sidebar'
      ? 'grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6';

  return (
    <div className={gridClass}>
      {CHECKLIST_ITEMS.map((item) => {
        const numberConfig = DOCUMENT_NUMBER_FIELDS[item.key];
        const isChecked = !!values[item.key];
        const containerClass =
          variant === 'sidebar'
            ? `flex flex-col gap-2 p-3 rounded-xl border transition-all ${isChecked
              ? 'bg-success/5 border-success/20'
              : 'bg-black/10 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
            }`
            : 'flex flex-col gap-2';

        return (
          <div key={item.key} className={containerClass}>
            <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onCheckboxChange(item.key, e.target.checked)}
                className={checkboxClass}
              />
              <span
                className={
                  variant === 'sidebar'
                    ? `transition-colors ${isChecked ? 'text-white font-medium' : 'text-text-secondary group-hover:text-white'}`
                    : 'text-white/80 group-hover:text-white transition-colors text-sm'
                }
              >
                {item.label}
              </span>
            </label>
            {numberConfig && isChecked && (
              <input
                type="text"
                value={String(values[numberConfig.numberKey] || '')}
                onChange={(e) => onNumberChange(numberConfig.numberKey, e.target.value)}
                onBlur={onNumberBlur ? (e) => onNumberBlur(numberConfig.numberKey, e.target.value) : undefined}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                placeholder={numberConfig.placeholder}
                className={numberInputClassName || defaultNumberClass}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DocumentChecklistFields;
