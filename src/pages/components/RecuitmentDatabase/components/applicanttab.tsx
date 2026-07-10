import React from 'react';
import ApplicantRow from './googlerow';
import type { GoogleSheetApplicant } from '../hook/googlesheettab';
import { useVirtualRows, spacerRowStyle } from '../../../../components/Tables/useVirtualRows';
import {
  recruitmentTable,
  recruitmentThead,
  recruitmentTh,
  recruitmentThCheckbox,
} from '../../../../components/Tables/pipelineTableStyles';

interface ApplicantTableProps {
  applicants: GoogleSheetApplicant[];
  selectedApplicants: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectApplicant: (id: string, checked: boolean) => void;
}

// Scroll container: fills its bounded parent (the page's `flex-1 overflow-hidden`
// region) and owns both axes of scroll, so it is the virtualizer's scroll root.
const scrollContainer =
  'h-full overflow-auto custom-scrollbar rounded-b-[1.75rem] border-t border-white/10 bg-[#0b1018]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]';

const ApplicantTable: React.FC<ApplicantTableProps> = ({
  applicants,
  selectedApplicants,
  onSelectAll,
  onSelectApplicant,
}) => {
  const { containerRef, items, topSpacer, bottomSpacer, measureRow } = useVirtualRows(applicants, 58);

  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-secondary">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <i className="fas fa-user-slash text-white/20 text-2xl" />
        </div>
        <p className="text-base font-medium text-white mb-1">No applicants found</p>
      </div>
    );
  }

  const allSelected = applicants.length > 0 && selectedApplicants.size === applicants.length;
  const columns = Object.keys(applicants[0]);
  const colCount = columns.length + 1;

  return (
    <div ref={containerRef} className={scrollContainer}>
      <table className={recruitmentTable}>
        <thead className={recruitmentThead}>
          <tr>
            <th scope="col" className={recruitmentThCheckbox}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50 h-4 w-4"
              />
            </th>
            {columns.map((key) => (
              <th key={key} scope="col" className={recruitmentTh}>
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topSpacer > 0 && (
            <tr aria-hidden><td colSpan={colCount} style={spacerRowStyle(topSpacer)} /></tr>
          )}
          {items.map((virtualItem) => {
            const applicant = applicants[virtualItem.index];
            return (
              <ApplicantRow
                key={applicant["NO"] || virtualItem.index}
                applicant={applicant}
                isSelected={selectedApplicants.has(applicant["NO"])}
                onSelect={onSelectApplicant}
                measureRef={measureRow}
                dataIndex={virtualItem.index}
              />
            );
          })}
          {bottomSpacer > 0 && (
            <tr aria-hidden><td colSpan={colCount} style={spacerRowStyle(bottomSpacer)} /></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;
