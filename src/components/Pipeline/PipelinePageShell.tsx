import React from 'react';
import { pipelineCard, pipelinePageWrapper } from '../Tables/pipelineTableStyles';

type PipelinePageShellProps = {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
};

const PipelinePageShell: React.FC<PipelinePageShellProps> = ({
  children,
  className = '',
  fullHeight = false,
}) => (
  <div className={`flex w-full relative overflow-hidden ${fullHeight ? 'h-[calc(100vh-2rem)]' : ''}`}>
    <div className={`${pipelinePageWrapper} ${fullHeight ? 'h-full' : ''}`}>
      <div className={`${pipelineCard} ${fullHeight ? 'h-full flex flex-col' : ''} ${className}`}>
        <div className="h-[3px] bg-gradient-to-r from-primary via-primary-light to-info/80" />
        {children}
      </div>
    </div>
  </div>
);

export default PipelinePageShell;
