import React from 'react'
type RadioButtonProps = {
  id: string
  name: string
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  description?: string
}
export const RadioButton = ({
  id,
  name,
  checked = false,
  onChange,
  label,
  description,
}: RadioButtonProps) => {
  return (
    <div className="flex items-start mb-2">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="radio"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
      </div>
      {(label || description) && (
        <div className="ml-2">
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  )
} 