import React from 'react'
type AvatarProps = {
  src?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}
export const Avatar = ({ src, initials, size = 'md', label }: AvatarProps) => {
  const sizeStyles: Record<NonNullable<AvatarProps['size']>, { px: number; fontSize: number }> = {
    sm: { px: 24, fontSize: 12 },
    md: { px: 32, fontSize: 14 },
    lg: { px: 40, fontSize: 16 },
  };

  const { px, fontSize } = sizeStyles[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: px,
          height: px,
          borderRadius: 9999,
          background: 'var(--mantine-color-grape-6)',
          color: 'white',
          fontWeight: 800,
          fontSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {src ? (
          <img
            src={src}
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          initials
        )}
      </div>
      {label && <span style={{ marginLeft: 6, fontSize: 12, color: 'white' }}>{label}</span>}
    </div>
  )
} 