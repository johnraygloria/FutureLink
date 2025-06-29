import { useMemo } from 'react';
import type { User, ScreeningStatus } from '../../../../types/applicant';

export interface ScreeningItemData {
  key: keyof User;
  label: string;
  status: ScreeningStatus;
  fileUrl?: string;
  fileName?: string;
}

export const useScreeningProgress = (user: User) => {
  const screeningItems: ScreeningItemData[] = useMemo(() => [
    { 
      key: 'resumePassed', 
      label: 'Resume Review', 
      status: user.resumePassed || 'pending',
      fileUrl: user.resumeUrl,
      fileName: user.resumeUrl ? `${user.name.replace(/\s+/g, '_')}_Resume.pdf` : undefined
    },
    { 
      key: 'infoSheetComplete', 
      label: 'Information Sheet', 
      status: user.infoSheetComplete || 'pending',
      fileUrl: user.infoSheetUrl,
      fileName: user.infoSheetUrl ? `${user.name.replace(/\s+/g, '_')}_InfoSheet.pdf` : undefined
    },
    { 
      key: 'heightPassed', 
      label: 'Height Check', 
      status: user.heightPassed || 'pending'
    },
    { 
      key: 'snellenPassed', 
      label: 'Snellen Test', 
      status: user.snellenPassed || 'pending'
    },
    { 
      key: 'ishiharaPassed', 
      label: 'Ishihara Test', 
      status: user.ishiharaPassed || 'pending'
    },
    { 
      key: 'physicalScreeningPassed', 
      label: 'Physical Screening', 
      status: user.physicalScreeningPassed || 'pending'
    },
  ], [user]);

  const progressPercentage = useMemo(() => {
    const passed = screeningItems.filter(item => item.status === 'Submit Online' || item.status === 'Submit Physical').length;
    const total = screeningItems.filter(item => item.status !== 'not_applicable').length;
    return total > 0 ? Math.round((passed / total) * 100) : 0;
  }, [screeningItems]);

  const completedCount = useMemo(() => {
    return screeningItems.filter(item => item.status === 'Submit Online' || item.status === 'Submit Physical').length;
  }, [screeningItems]);

  const totalCount = screeningItems.filter(item => item.status !== 'not_applicable').length;

  return {
    screeningItems,
    progressPercentage,
    completedCount,
    totalCount
  };
}; 