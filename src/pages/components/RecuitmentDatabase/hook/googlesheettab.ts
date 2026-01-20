export interface GoogleSheetApplicant {
  "NO": string;
  "REFFERED BY": string;
  "LAST NAME": string;
  "FIRST NAME": string;
  "EXT": string;
  "MIDDLE": string;
  "GENDER": string;
  "SIZE": string;
  "DATE OF BIRTH": string;
  "DATE APPLIED": string;
  "FB NAME": string;
  "AGE": string;
  "LOCATION": string;
  "CONTACT NUMBER": string;
  "POSITION APPLIED FOR": string;
  "EXPERIENCE": string;
  "CLIENTS": string;
  "STATUS": string;
  "REQUIREMENTS STATUS": string;
  "FINAL INTERVIEW STATUS": string;
  "MEDICAL STATUS": string;
  "STATUS REMARKS": string;
  "APPLICANT REMARKS": string;
}

export type ApplicantField = keyof GoogleSheetApplicant;