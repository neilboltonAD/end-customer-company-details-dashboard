import React from 'react'
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
    <div className="py-4 border-b border-gray-200 flex justify-between items-start">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  )
} 