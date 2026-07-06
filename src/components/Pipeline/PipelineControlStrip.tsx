import React from 'react';

type PipelineControlStripProps = {
  timer?: React.ReactNode;
  filters?: React.ReactNode;
};

const PipelineControlStrip: React.FC<PipelineControlStripProps> = ({ timer, filters }) => {
  if (!timer && !filters) return null;

  return (
    <div className="px-5 sm:px-6 py-3 border-b border-white/10 bg-[#0a0f16]/80 backdrop-blur-md flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3 flex-wrap">{timer}</div>
      <div className="flex-1 flex items-center gap-3 flex-wrap lg:justify-end">{filters}</div>
    </div>
  );
};

export default PipelineControlStrip;
