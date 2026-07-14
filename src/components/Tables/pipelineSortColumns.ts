import type { User } from '../../api/applicant';
import type { SortColumnMap } from './tableSort';

const principalsDisplay = (user: User): string => {
  // principals/clients are attached by the row mappers but absent from the User type.
  const source = user as User & { principals?: unknown; clients?: unknown };
  const principals = source.principals ?? source.clients ?? [];
  return Array.isArray(principals) ? principals.join(', ') : '';
};

// Shared by the four pipeline tables (Screening / Assessment / Selection /
// Engagement), whose columns are identical. Keys are the header labels;
// accessors mirror what each column displays (see mapUserToDisplayFormat).
export const PIPELINE_SORT_COLUMNS: SortColumnMap<User> = {
  'Name': { accessor: (u) => `${u.firstName || ''} ${u.lastName || ''}`.trim() },
  'Position': { accessor: (u) => u.positionApplied },
  'Applied Date': { accessor: (u) => u.dateApplied, type: 'date' },
  'Status': { accessor: (u) => u.status },
  'NO': { accessor: (u) => u.no },
  'REFFERED BY': { accessor: (u) => u.referredBy },
  'EXT': { accessor: (u) => u.ext },
  'MIDDLE': { accessor: (u) => u.middle },
  'GENDER': { accessor: (u) => u.gender },
  'SIZE': { accessor: (u) => u.size },
  'DATE OF BIRTH': { accessor: (u) => u.dateOfBirth, type: 'date' },
  'FB NAME': { accessor: (u) => u.facebook },
  'AGE': { accessor: (u) => u.age, type: 'number' },
  'LOCATION': { accessor: (u) => u.location },
  'CONTACT NUMBER': { accessor: (u) => u.contactNumber },
  'EMAIL': { accessor: (u) => u.email },
  'EXPERIENCE': { accessor: (u) => u.experience },
  'PRINCIPAL': { accessor: principalsDisplay },
  'REQUIREMENTS STATUS': { accessor: (u) => u.requirementsStatus },
  'FINAL INTERVIEW STATUS': { accessor: (u) => u.finalInterviewStatus },
  'MEDICAL STATUS': { accessor: (u) => u.medicalStatus },
  'STATUS REMARKS': { accessor: (u) => u.statusRemarks },
  'APPLICANT REMARKS': { accessor: (u) => u.applicantRemarks },
};
