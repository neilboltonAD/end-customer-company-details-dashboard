import React from 'react';
import { Alert, Group, Text, Badge } from '@mantine/core';
import { Sparkles } from 'lucide-react';

export function DemoBanner() {
  return (
    <Alert 
      color="grape" 
      variant="light" 
      mb="md"
      icon={<Sparkles size={16} />}
      styles={{
        root: {
          borderLeft: '4px solid var(--mantine-color-grape-6)',
        }
      }}
    >
      <Group justify="space-between" align="center">
        <Text size="sm">
          <strong>Demo Mode</strong> — This extension is running with simulated data for stakeholder review.
        </Text>
        <Badge color="grape" variant="filled" size="sm">
          v1.0.0
        </Badge>
      </Group>
    </Alert>
  );
}


