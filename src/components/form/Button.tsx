import React from 'react'
type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-blue-700 text-white hover:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
  }
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  }
  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
} 