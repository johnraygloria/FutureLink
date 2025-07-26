import type { ScreeningStatus } from './applicant';

export interface ApplicantDocuments {
  resumePassed?: ScreeningStatus;
  infoSheetComplete?: ScreeningStatus;
  heightPassed?: ScreeningStatus;
  snellenPassed?: ScreeningStatus;
  ishiharaPassed?: ScreeningStatus;
  physicalScreeningPassed?: ScreeningStatus;
  recentPicture?: boolean;
  psaBirthCertificate?: boolean;
  schoolCredentials?: boolean;
  nbiClearance?: boolean;
  policeClearance?: boolean;
  barangayClearance?: boolean;
  sss?: boolean;
  pagibig?: boolean;
  cedula?: boolean;
  vaccinationStatus?: boolean;
  initialInterview?: boolean;
  completion?: boolean;
  finalInterview?: boolean;
  email?: string;
  applicationDate?: string;
  finalInterviewStatus?: string;
  requirementsStatus?: string;
  medicalStatus?: string;
  statusRemarks?: string;
  applicantRemarks?: string;
} 