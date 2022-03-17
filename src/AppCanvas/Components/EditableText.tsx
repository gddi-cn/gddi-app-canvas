import React, { useCallback, useMemo, useState } from 'react'
// import './EditableText.scss'

import Input from '@mui/material/Input'
import Box from '@mui/material/Box'

export interface EditableTextProps {
  className?: string
  value: string
  disabled?: boolean
  onChange: (newVal: string) => void
}

export const EditableText = ({
  className,
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
      <Box
        className="gddi-aiappcanvas__editable-text"
        style={{ cursor: disabled === true ? 'default' : 'pointer' }}
        onClick={handleTextClick}
        role="button"
        tabIndex={-1}
        onKeyDown={handleTextClick}
      >
        {value}
      </Box>
    ),
    [value, disabled, handleTextClick]
  )
  const editingMode = useMemo(
    () => (
      <Input
        className="editabletext-input"
        style={
          {
            // width: '200px',
            // color: 'text.primary'
          }
        }
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

  return <Box className={className}>{editing ? editingMode : readingMode}</Box>
}
