import React from 'react'
type SectionProps = {
  title: string
  children: React.ReactNode
  className?: string
}
export const Section = ({ title, children, className = '' }: SectionProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="bg-gray-100 border-t border-b border-gray-200 px-4 py-2 mb-4">
        <h2 className="text-sm font-medium text-gray-700 uppercase">{title}</h2>
      </div>
      <div className="px-4">{children}</div>
    </div>
  )
} 