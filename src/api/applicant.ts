import type { ApplicantPersonal } from './applicantPersonal';
import type { ApplicantDocuments } from './applicantDocuments';
import type { Company } from './company';

export type ScreeningStatus = 'pending' | 'Submit Online' | 'Submit Physical' | 'failed' | 'not_applicable';

export interface User extends ApplicantPersonal, ApplicantDocuments, Company {
  id: any;
  status: string;
}

export type ApplicationStatus = 
  | 'For Screening'
  | 'Doc Screening'
  | 'Physical Screening'
  | 'Initial Interview'
  | 'Completion'
  | 'Final Interview'
  | 'Final Interview/Incomplete Requirements'
  | 'Final Interview/Complete Requirements'
  | 'For Final Interview/For Assessment'
  | 'For Completion'
  | 'For Medical'
  | 'For SBMA Gate Pass'
  | 'On Boarding'
  | 'Metrex'
  | 'For Deployment'
  | 'Deployed'
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