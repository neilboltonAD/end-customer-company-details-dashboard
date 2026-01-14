import React from 'react';
import { Badge, MantineSize } from '@mantine/core';
import { TransferStatus } from '../../context/types';
import { TRANSFER_STATUS_COLORS } from '../../utils/constants';

interface TransferStatusBadgeProps {
  status: TransferStatus;
  size?: MantineSize;
}

export function TransferStatusBadge({ status, size = 'sm' }: TransferStatusBadgeProps) {
  const color = TRANSFER_STATUS_COLORS[status];
  
  const labels: Record<TransferStatus, string> = {
    Pending: 'Pending',
    InProgress: 'Processing',
    Completed: 'Completed',
    Failed: 'Failed',
    Rejected: 'Rejected',
    Cancelled: 'Cancelled',
    Expired: 'Expired',
  };

  return (
    <Badge color={color} size={size} variant="light">
      {labels[status]}
    </Badge>
  );
}


