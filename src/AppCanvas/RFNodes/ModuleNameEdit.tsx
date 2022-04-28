import React, { useCallback, useState } from 'react'

import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import Input from '@mui/material/Input'

export interface ModuleNameEditProps {
  readonly?: boolean
  width?: number
  name: string
  onChange: (newName: string) => void
}

export const ModuleNameEdit = ({
  readonly,
  width,
  name,
  onChange
}: ModuleNameEditProps): JSX.Element => {
  const [editing, setEditing] = useState<boolean>(false)

  const handleEditClick = useCallback(() => {
    setEditing(true)
  }, [setEditing])

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

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {editing ? (
        <Input
          style={{
            width: '100%'
          }}
          value={name}
          inputProps={{ 'aria-label': 'module name' }}
          onChange={handleInputChange}
          autoFocus
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
        />
      ) : (
        <Box
          component="span"
          sx={{
            width: width ? width : '240px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          {name}
        </Box>
      )}
      {!readonly && !editing && (
        <EditIcon
          sx={{
            cursor: 'pointer',
            // marginLeft: '1.8rem',
            opacity: 0.6,
            fontSize: '1.25rem'
          }}
          onClick={handleEditClick}
        />
      )}
    </Box>
  )
}
