import React from 'react';
import type { GoogleSheetApplicant } from '../hook/googlesheettab';

interface ApplicantRowProps {
  applicant: GoogleSheetApplicant;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

const GoogleRow: React.FC<ApplicantRowProps> = ({ applicant, isSelected, onSelect }) => {
  return (
    <tr className="hover:bg-custom-teal/5 cursor-pointer transition">
      <td className="px-4 py-2 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(applicant["NO"], e.target.checked)}
          className="rounded border-gray-300 text-custom-teal focus:ring-custom-teal"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      {Object.keys(applicant).map((key) => (
        <td key={key} className="px-4 py-2 whitespace-nowrap">
          {applicant[key as keyof GoogleSheetApplicant]}
        </td>
      ))}
    </tr>
  );
};

export default GoogleRow;