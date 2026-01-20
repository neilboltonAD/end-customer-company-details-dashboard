import React from 'react'
import { Card as DSCard, Text } from 'components/DesignSystem'

type CardProps = {
  children: React.ReactNode
}

export const Card = ({ children }: CardProps) => {
  return (
    <DSCard>
      {children}
    </DSCard>
  )
}

export const CardHeader = ({ children }: CardProps) => {
  return (
    <Text fw={600} size="sm" c="dimmed" mb="sm">
      {children}
    </Text>
  )
}

export const CardContent = ({ children }: CardProps) => {
  return <div>{children}</div>
}