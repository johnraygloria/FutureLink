import React from 'react';
import type { GoogleSheetApplicant } from '../hook/googlesheettab';
import {
  recruitmentRow,
  recruitmentTd,
  recruitmentTdCheckbox,
} from '../../../../components/Tables/pipelineTableStyles';

interface ApplicantRowProps {
  applicant: GoogleSheetApplicant;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

const GoogleRow: React.FC<ApplicantRowProps> = ({ applicant, isSelected, onSelect }) => {
  return (
    <tr className={`${recruitmentRow} ${isSelected ? 'bg-primary/10 hover:bg-primary/14' : ''}`}>
      <td className={recruitmentTdCheckbox}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(applicant["NO"], e.target.checked)}
          className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50 h-4 w-4"
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      {Object.keys(applicant).map((key) => (
        <td key={key} className={recruitmentTd}>
          <span className={key === 'STATUS' ? 'px-3 py-1 inline-flex text-xs font-bold rounded-full border bg-primary/10 text-primary-light border-primary/20' : ''}>
            {applicant[key as keyof GoogleSheetApplicant] || '-'}
          </span>
        </td>
      ))}
    </tr>
  );
};

export default GoogleRow;
