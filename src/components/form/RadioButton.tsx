import React from 'react'
import { Text } from 'components/DesignSystem'
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
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 20 }}>
        <input
          id={id}
          name={name}
          type="radio"
          checked={checked}
          onChange={onChange}
          style={{ width: 16, height: 16 }}
        />
      </div>
      {(label || description) && (
        <div style={{ marginLeft: 8 }}>
          {label && (
            <label htmlFor={id}>
              <Text size="sm" fw={700}>
                {label}
              </Text>
            </label>
          )}
          {description && (
            <Text size="xs" c="dimmed" style={{ marginTop: 4 }}>
              {description}
            </Text>
          )}
        </div>
      )}
    </div>
  )
} 