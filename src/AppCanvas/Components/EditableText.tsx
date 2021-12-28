import React, { useCallback, useMemo, useState } from 'react'
import Input from '@mui/material/Input'

export interface EditableTextProps {
  value: string
  disabled?: boolean
  onChange: (newVal: string) => void
}

export const EditableText = ({
  value,
  disabled,
  onChange
}: EditableTextProps): JSX.Element => {
  const [editing, setEditing] = useState<boolean>(false)
  const handleInputChange = useCallback(
    (e: any) => {
      onChange(e.target.value)
    },
    [onChange]
  )
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        setEditing(false)
      }
    },
    [setEditing]
  )
  const handleBlur = useCallback(() => {
    setEditing(false)
  }, [setEditing])
  const handleTextClick = useCallback(() => {
    if (disabled !== true) {
      setEditing(true)
    }
  }, [setEditing, disabled])

  const readingMode = useMemo(
    () => (
      <div
        className="gddi-aiappcanvas__editable-text"
        style={{ cursor: disabled === true ? 'default' : 'pointer' }}
        onClick={handleTextClick}
        role="button"
        tabIndex={-1}
        onKeyDown={handleTextClick}
      >
        {value}
      </div>
    ),
    [value, disabled, handleTextClick]
  )
  const editingMode = useMemo(
    () => (
      <Input
        style={{ width: '200px' }}
        value={value}
        inputProps={{ 'aria-label': 'description' }}
        onChange={handleInputChange}
        autoFocus
        onBlur={handleBlur}
        onKeyDown={handleInputKeyDown}
      />
    ),
    [handleInputChange, handleBlur, handleInputKeyDown, value]
  )

  return <div>{editing ? editingMode : readingMode}</div>
}
