import React from 'react';
import { Badge } from '@mantine/core';
import { TransferStatus, statusIcons } from './types';

interface TransferStatusBadgeProps {
  status: TransferStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusMantineColors: Record<TransferStatus, string> = {
  Pending: 'yellow',
  InProgress: 'blue',
  Completed: 'green',
  Failed: 'red',
  Rejected: 'gray',
  Cancelled: 'gray',
  Expired: 'orange',
};

export const TransferStatusBadge: React.FC<TransferStatusBadgeProps> = ({ 
  status, 
  size = 'sm',
  showIcon = true 
}) => {
  return (
    <Badge 
      color={statusMantineColors[status]} 
      size={size}
      variant="light"
      radius="sm"
    >
      {showIcon && <span className="mr-1">{statusIcons[status]}</span>}
      {status}
    </Badge>
  );
};

