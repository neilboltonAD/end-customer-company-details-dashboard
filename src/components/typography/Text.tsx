import React from 'react'
type TextProps = {
  variant?: 'body' | 'small' | 'tiny'
  color?: 'default' | 'muted' | 'error' | 'success'
  children: React.ReactNode
  className?: string
}
export const Text = ({
  variant = 'body',
  color = 'default',
  children,
  className = '',
}: TextProps) => {
  const variantClasses = {
    body: 'text-sm',
    small: 'text-xs',
    tiny: 'text-xs',
  }
  const colorClasses = {
    default: 'text-gray-700',
    muted: 'text-gray-500',
    error: 'text-red-600',
    success: 'text-green-600',
  }
  return (
    <p
      className={`${variantClasses[variant]} ${colorClasses[color]} ${className}`}
    >
      {children}
    </p>
  )
} 