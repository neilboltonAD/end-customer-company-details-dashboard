import React from 'react'
type AvatarProps = {
  src?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}
export const Avatar = ({ src, initials, size = 'md', label }: AvatarProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  }
  return (
    <div className="flex items-center">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-purple-600 text-white font-medium`}
      >
        {src ? (
          <img
            src={src}
            alt="Avatar"
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>
      {label && <span className="ml-1 text-xs text-white">{label}</span>}
    </div>
  )
} 