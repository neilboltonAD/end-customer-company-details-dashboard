import React from 'react'
import { Card, CardSection, Title } from 'components/DesignSystem'
type SectionProps = {
  title: string
  children: React.ReactNode
}
export const Section = ({ title, children }: SectionProps) => {
  return (
    <Card>
      <CardSection withBorder inheritPadding py="sm">
        <Title order={6} fw={700} tt="uppercase">
          {title}
        </Title>
      </CardSection>
      <div style={{ paddingTop: 12 }}>{children}</div>
    </Card>
  )
} 