import React from 'react';
import ApplicantRow from './googlerow';
import type { GoogleSheetApplicant } from '../hook/googlesheettab';

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
    return <div className="text-center py-20 text-text-secondary">No applicants found</div>;
  }

  const allSelected = applicants.length > 0 && selectedApplicants.size === applicants.length;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
            <thead className="bg-[#CDE8E6] sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-teal-900 uppercase tracking-wider border-b border-teal-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => onSelectAll(e.target.checked)}
                      className="rounded border-teal-300 text-teal-600 focus:ring-teal-500 h-4 w-4 bg-white"
                    />
                  </div>
                </th>
                {Object.keys(applicants[0]).map((key) => (
                  <th key={key} scope="col" className="px-4 py-3 text-left text-xs font-bold text-teal-900 uppercase tracking-wider whitespace-nowrap border-b border-teal-200">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
      </div>
    </div>
  );
};

export default ApplicantTable;