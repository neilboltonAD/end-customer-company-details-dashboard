import { Badge, Center, Loader, Stack, Text } from '@mantine/core';

type TransferStatus = 'Pending' | 'Accepted' | 'Completed' | 'Rejected' | 'Cancelled' | 'Failed' | 'Processing';

interface TransferStatusBadgeProps {
  status: TransferStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const statusConfig: Record<TransferStatus, { color: string; label: string }> = {
  Pending: { color: 'yellow', label: 'Pending' },
  Accepted: { color: 'blue', label: 'Accepted' },
  Completed: { color: 'green', label: 'Completed' },
  Rejected: { color: 'red', label: 'Rejected' },
  Cancelled: { color: 'gray', label: 'Cancelled' },
  Failed: { color: 'red', label: 'Failed' },
  Processing: { color: 'blue', label: 'Processing' },
};

export function TransferStatusBadge({ status, size = 'sm' }: TransferStatusBadgeProps) {
  const config = statusConfig[status] || { color: 'gray', label: status };
  
  return (
    <Badge color={config.color} variant="light" size={size}>
      {config.label}
    </Badge>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="sm">
        <Loader size="md" />
        <Text size="sm" c="dimmed">{message}</Text>
      </Stack>
    </Center>
  );
}

export default TransferStatusBadge;
