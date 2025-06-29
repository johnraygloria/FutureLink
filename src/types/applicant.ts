export type ScreeningStatus = 'pending' | 'Submit Online' | 'Submit Physical' | 'failed' | 'not_applicable';

export interface User {
  id: number;
  name: string;
  position?: string;
  status?: string;
  no?: string;
  referredBy?: string;
  lastName?: string;
  firstName?: string;
  ext?: string;
  middle?: string;
  gender?: string;
  size?: string;
  dateOfBirth?: string;
  dateApplied?: string;
  age?: string;
  location?: string;
  contactNumber?: string;
  positionApplied?: string;
  experience?: string;
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
}

export type ApplicationStatus = 
  | 'Document Screening'
  | 'Initial Review'
  | 'Interview Scheduled'
  | 'Interview Completed'
  | 'Reference Check'
  | 'Offer Extended'
  | 'Hired'
  | 'Rejected'
  | 'Withdrawn';

export interface ScreeningData {
  resumePassed: ScreeningStatus;
  infoSheetComplete: ScreeningStatus;
  heightPassed: ScreeningStatus;
  snellenPassed: ScreeningStatus;
  ishiharaPassed: ScreeningStatus;
  physicalScreeningPassed: ScreeningStatus;
} 