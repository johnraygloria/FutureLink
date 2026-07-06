import React from 'react';
import { pipelineTableContainer, pipelineTable, pipelineThead, pipelineTh, pipelineTd, pipelineRowDefault } from '../Tables/pipelineTableStyles';

type PipelineHistoryTableProps = {
  columns: string[];
  children: React.ReactNode;
};

const PipelineHistoryTable: React.FC<PipelineHistoryTableProps> = ({ columns, children }) => (
  <div className={pipelineTableContainer}>
    <table className={`${pipelineTable} min-w-[900px]`}>
      <thead className={pipelineThead}>
        <tr>
          {columns.map((col) => (
            <th key={col} className={pipelineTh}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const historyRowClass = pipelineRowDefault;
export const historyCellClass = pipelineTd;

export default PipelineHistoryTable;
