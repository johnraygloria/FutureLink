import React from 'react';

type PipelineStatCardProps = {
  label: string;
  value: string | number;
  icon?: string;
  accent?: 'primary' | 'success' | 'warning' | 'info';
};

const accentStyles = {
  primary: 'border-primary/20 bg-primary/10 text-primary-light',
  success: 'border-success/20 bg-success/10 text-success',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  info: 'border-info/20 bg-info/10 text-info',
};

const PipelineStatCard: React.FC<PipelineStatCardProps> = ({
  label,
  value,
  icon = 'fa-chart-simple',
  accent = 'primary',
}) => (
  <div className={`rounded-2xl border px-4 py-3 min-w-[140px] ${accentStyles[accent]}`}>
    <div className="flex items-center gap-2 mb-1">
      <i className={`fas ${icon} text-xs opacity-80`} />
      <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{label}</span>
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
  </div>
);

export default PipelineStatCard;
