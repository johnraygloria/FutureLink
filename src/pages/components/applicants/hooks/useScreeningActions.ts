import type { User, ScreeningStatus } from '../../../../types/applicant';

type ScreeningKey = 'resumePassed' | 'infoSheetComplete' | 'heightPassed' | 'snellenPassed' | 'ishiharaPassed' | 'physicalScreeningPassed';

interface UseScreeningActionsProps {
  user: User;
  onScreeningUpdate?: (userId: number, key: keyof User, status: ScreeningStatus) => void;
  onOpenScreening?: (user: User) => void;
  closeDropdown: () => void;
}

export const useScreeningActions = ({ 
  user, 
  onScreeningUpdate, 
  onOpenScreening, 
  closeDropdown 
}: UseScreeningActionsProps) => {
  
  const handleStatusUpdate = (key: ScreeningKey, status: ScreeningStatus) => {
    onScreeningUpdate?.(user.id, key, status);
    closeDropdown();
  };

  const handleScreeningClick = () => {
    onOpenScreening?.(user);
  };

  return {
    handleStatusUpdate,
    handleScreeningClick
  };
}; 