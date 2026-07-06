import React from 'react';
import PipelinePageShell from './PipelinePageShell';

type PipelineHistoryShellProps = {
  title: string;
  backLabel: string;
  onBack: () => void;
  children: React.ReactNode;
};

const PipelineHistoryShell: React.FC<PipelineHistoryShellProps> = ({
  title,
  backLabel,
  onBack,
  children,
}) => (
  <PipelinePageShell>
    <div className="px-5 sm:px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent flex items-center gap-4 flex-wrap">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition-all border border-white/10"
      >
        <i className="fas fa-arrow-left" />
        {backLabel}
      </button>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-sm text-text-secondary/70 mt-0.5">Activity log and status changes</p>
      </div>
    </div>
    <div className="p-5 sm:p-6">{children}</div>
  </PipelinePageShell>
);

export default PipelineHistoryShell;
