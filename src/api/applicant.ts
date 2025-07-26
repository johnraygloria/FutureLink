import type { ApplicantPersonal } from './applicantPersonal';
import type { ApplicantDocuments } from './applicantDocuments';
import type { Company } from './company';

export type ScreeningStatus = 'pending' | 'Submit Online' | 'Submit Physical' | 'failed' | 'not_applicable';

export interface User extends ApplicantPersonal, ApplicantDocuments, Company {}

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