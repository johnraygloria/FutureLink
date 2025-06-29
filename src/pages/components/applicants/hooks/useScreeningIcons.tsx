import React from 'react';
import { 
  IconFileText, 
  IconClipboardList, 
  IconRuler, 
  IconEye, 
  IconPalette, 
  IconHeartbeat
} from "@tabler/icons-react";

type ScreeningKey = 'resumePassed' | 'infoSheetComplete' | 'heightPassed' | 'snellenPassed' | 'ishiharaPassed' | 'physicalScreeningPassed';

export const useScreeningIcons = () => {
  const iconMap: Record<ScreeningKey, React.ReactElement> = {
    resumePassed: <IconFileText size={16} />,
    infoSheetComplete: <IconClipboardList size={16} />,
    heightPassed: <IconRuler size={16} />,
    snellenPassed: <IconEye size={16} />,
    ishiharaPassed: <IconPalette size={16} />,
    physicalScreeningPassed: <IconHeartbeat size={16} />,
  };

  return { iconMap };
}; 