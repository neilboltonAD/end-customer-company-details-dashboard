import React from 'react';
import { Card, Stack, Text, Title } from 'components/DesignSystem';

export const AdobeSection = () => (
  <Stack gap="sm" style={{ marginBottom: 24 }}>
    <Title order={4}>Adobe</Title>
    <Card>
      <Stack gap="sm" align="center" style={{ padding: 24 }}>
        <Text style={{ fontSize: 48, lineHeight: 1 }} c="dimmed">
          📄
        </Text>
        <Text fw={800} ta="center">
          No Adobe account found.
        </Text>
      </Stack>
    </Card>
  </Stack>
); 