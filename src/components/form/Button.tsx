import React from 'react'
import { Button as DSButton } from 'components/DesignSystem'

type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
}: ButtonProps) => {
  const dsVariant = variant === 'outline' ? 'outline' : variant
  return (
    <DSButton
      variant={dsVariant}
      size={size}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </DSButton>
  )
}