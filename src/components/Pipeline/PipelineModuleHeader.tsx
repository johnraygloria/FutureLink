import React from 'react';

type PipelineModuleHeaderProps = {
  title: string;
  subtitle?: string;
  count: number;
  icon?: string;
  filteredCount?: number;
};

const PipelineModuleHeader: React.FC<PipelineModuleHeaderProps> = ({
  title,
  subtitle,
  count,
  icon = 'fa-users',
  filteredCount,
}) => (
  <div className="px-5 sm:px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 border border-primary/25 shadow-[0_0_24px_rgba(0,166,167,0.15)]">
          <i className={`fas ${icon} text-primary-light text-lg`} />
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
            <span className="inline-flex items-center rounded-full bg-primary/15 text-primary-light px-3 py-1 text-xs font-bold border border-primary/25 shadow-[0_0_12px_rgba(0,166,167,0.12)]">
              {filteredCount !== undefined ? `${filteredCount} / ${count}` : count}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-text-secondary/80 max-w-2xl">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default PipelineModuleHeader;
