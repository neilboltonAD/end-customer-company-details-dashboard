import React from 'react'
import { SearchIcon } from 'lucide-react'
import { TextInput } from 'components/DesignSystem'
type SearchInputProps = {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  style?: React.CSSProperties
}
export const SearchInput = ({
  placeholder = 'Search',
  value,
  onChange,
  style,
}: SearchInputProps) => {
  return (
    <div style={style}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        leftSection={<SearchIcon size={16} />}
      />
    </div>
  )
} 