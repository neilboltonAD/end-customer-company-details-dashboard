import React from 'react'
import { Inline, Text } from 'components/DesignSystem'
export const SecondaryNavbar = () => {
  return (
    <div style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', padding: '8px 16px', background: 'white' }}>
      <Inline gap="lg" align="center" wrap="nowrap">
        {['Marketplace', 'Home', 'Operations', 'Products', 'Settings', 'Reports', 'Themes', 'Programs'].map((t) => (
          <Text
            key={t}
            size="sm"
            c="dimmed"
            fw={t === 'Settings' ? 700 : 400}
            style={t === 'Settings' ? { borderBottom: '2px solid var(--mantine-color-dark-8)', paddingBottom: 6 } : undefined}
          >
            {t}
          </Text>
        ))}
      </Inline>
    </div>
  )
} 