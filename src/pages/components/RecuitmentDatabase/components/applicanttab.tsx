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
    return <div className="text-center py-8">No applicants found</div>;
  }

  const allSelected = applicants.length > 0 && selectedApplicants.size === applicants.length;

  return (
    <div className="absolute w-4/5">
      <div className="overflow-x-auto">
        <div className="bg-white rounded-xl shadow border border-custom-teal/20 min-w-max">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-custom-teal/10">
              <tr>
                <th className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-custom-teal focus:ring-custom-teal"
                  />
                </th>
                {Object.keys(applicants[0]).map((key) => (
                  <th key={key} className="px-4 py-2 text-xs font-medium text-custom-teal uppercase tracking-wider">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {applicants.map((applicant) => (
                <ApplicantRow
                  key={applicant["NO"]}
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