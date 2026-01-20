import React from 'react'
import { Group, Stack, Text } from '@mantine/core'
type SettingItemProps = {
  title: string
  description?: string
  children?: React.ReactNode
}
export const SettingItem = ({
  title,
  description,
  children,
}: SettingItemProps) => {
  return (
    <Group justify="space-between" align="flex-start" py="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Stack gap={4} style={{ flex: 1 }}>
        <Text size="sm" fw={600} c="dark">
          {title}
        </Text>
        {description && (
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        )}
      </Stack>
      {children && <div style={{ marginLeft: 16 }}>{children}</div>}
    </Group>
  )
} 