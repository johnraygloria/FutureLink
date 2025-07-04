import React, { useMemo } from 'react';
import { 
  IconCheck, 
  IconX, 
  IconClock, 
  IconMinus, 
  IconWorld, 
  IconUserCheck 
} from "@tabler/icons-react";
import type { ScreeningStatus } from '../../../../types/applicant';

export interface StatusConfig {
  label: string;
  iconName: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  hoverBg: string;
}

export const useScreeningStatus = () => {
  const statusConfig = useMemo(() => ({
    pending: {
      label: 'Pending',
      iconName: 'IconClock',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      hoverBg: 'hover:bg-yellow-200'
    },
    not_applicable: {
      label: 'N/A',
      iconName: 'IconMinus',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
      hoverBg: 'hover:bg-gray-200'
    }
  }), []);

  const getStatusConfig = (status: ScreeningStatus): StatusConfig => {
    if (status === 'Submit Online') {
      return {
        label: 'Submit Online',
        iconName: 'IconCheck',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        hoverBg: 'hover:bg-blue-200'
      };
    }
    if (status === 'Submit Physical') {
      return {
        label: 'Submit Physical',
        iconName: 'IconUserCheck',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        hoverBg: 'hover:bg-purple-200'
      };
    }
    if (status === 'failed') {
      return {
        label: 'Failed',
        iconName: 'IconX',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        hoverBg: 'hover:bg-red-200'
      };
    }
    if (status === 'pending') {
      return statusConfig.pending;
    }
    if (status === 'not_applicable') {
      return statusConfig.not_applicable;
    }
    return statusConfig.pending;
  };

  return {
    statusConfig,
    getStatusConfig
  };
}; 