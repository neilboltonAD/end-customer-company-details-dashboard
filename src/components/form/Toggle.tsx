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
  const sizes = {
    sm: { w: 32, h: 16, thumb: 12, pad: 2 },
    md: { w: 40, h: 20, thumb: 16, pad: 2 },
  } as const
  const s = sizes[size]
  const translateX = enabled ? s.w - s.thumb - s.pad : s.pad
  return (
    <button
      type="button"
      style={{
        width: s.w,
        height: s.h,
        borderRadius: 999,
        border: '1px solid var(--mantine-color-gray-3)',
        background: enabled ? 'var(--mantine-color-green-6)' : 'var(--mantine-color-gray-2)',
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 120ms ease, border-color 120ms ease',
      }}
      onClick={handleChange}
      aria-checked={enabled}
      role="switch"
    >
      <span
        style={{
          width: s.thumb,
          height: s.thumb,
          borderRadius: 999,
          background: 'white',
          position: 'absolute',
          left: 0,
          transform: `translateX(${translateX}px)`,
          transition: 'transform 150ms ease',
          boxShadow: 'var(--mantine-shadow-xs)',
        }}
      />
    </button>
  )
} 