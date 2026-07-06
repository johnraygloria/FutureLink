import React from 'react';
import ApplicantRow from './googlerow';
import type { GoogleSheetApplicant } from '../hook/googlesheettab';
import {
  recruitmentTable,
  recruitmentTableContainer,
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

const ApplicantTable: React.FC<ApplicantTableProps> = ({
  applicants,
  selectedApplicants,
  onSelectAll,
  onSelectApplicant,
}) => {
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

  return (
    <div className={recruitmentTableContainer}>
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
          {applicants.map((applicant, index) => (
            <ApplicantRow
              key={applicant["NO"] || index}
              applicant={applicant}
              isSelected={selectedApplicants.has(applicant["NO"])}
              onSelect={onSelectApplicant}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;
