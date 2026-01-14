import React from 'react';
import { Center, Loader, Text, Stack } from '@mantine/core';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="sm">
        <Loader size="lg" />
        <Text size="sm" c="dimmed">{message}</Text>
      </Stack>
    </Center>
  );
}


