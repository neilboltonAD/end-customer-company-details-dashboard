import React from 'react'
type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}
export const Heading = ({
  level = 1,
  children,
  className = '',
}: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  const sizeClasses = {
    1: 'text-2xl font-bold',
    2: 'text-xl font-bold',
    3: 'text-lg font-semibold',
    4: 'text-base font-semibold',
    5: 'text-sm font-medium',
    6: 'text-xs font-medium',
  }
  return (
    <Tag className={`${sizeClasses[level]} text-gray-800 ${className}`}>
      {children}
    </Tag>
  )
} 