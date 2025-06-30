import React from 'react'
type CardProps = {
  children: React.ReactNode
  className?: string
}
export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-sm p-4 ${className}`}
    >
      {children}
    </div>
  )
}
export const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`font-medium text-gray-700 text-sm mb-3 ${className}`}>
      {children}
    </div>
  )
}
export const CardContent = ({ children, className = '' }: CardProps) => {
  return <div className={className}>{children}</div>
} 