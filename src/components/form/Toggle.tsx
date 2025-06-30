import React from 'react'
type ToggleProps = {
  enabled?: boolean
  onChange?: (enabled: boolean) => void
  size?: 'sm' | 'md'
}
export const Toggle = ({
  enabled = false,
  onChange,
  size = 'md',
}: ToggleProps) => {
  const handleChange = () => {
    if (onChange) {
      onChange(!enabled)
    }
  }
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
  }
  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  }
  const thumbPositionClasses = {
    sm: enabled ? 'translate-x-4' : 'translate-x-0.5',
    md: enabled ? 'translate-x-5' : 'translate-x-0.5',
  }
  return (
    <button
      type="button"
      className={`${sizeClasses[size]} relative inline-flex items-center rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-200'} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      onClick={handleChange}
      aria-checked={enabled}
      role="switch"
    >
      <span
        className={`${thumbSizeClasses[size]} ${thumbPositionClasses[size]} bg-white rounded-full transform transition-transform duration-200 ease-in-out`}
      />
    </button>
  )
} 