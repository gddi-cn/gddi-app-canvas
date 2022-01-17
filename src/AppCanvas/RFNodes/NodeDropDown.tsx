import React, { useCallback, useState, useRef } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import shallow from 'zustand/shallow'
import { useOutsideClick } from '../hooks'
import { useStore } from '../store/useStore'

import Box from '@mui/material/Box'

export interface NodeDropDownProps {
  onDeleteClick: () => void
}

export const NodeDropDown = ({
  onDeleteClick
}: NodeDropDownProps): JSX.Element => {
  const { graphEditingDisabled } = useStore(
    (state) => ({
      graphEditingDisabled: state.graphEditingDisabled
    }),
    shallow
  )
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [showDd, setShowDd] = useState<boolean>(false)
  const isClickOutside = useOutsideClick(menuRef)

  const handleIconClick = useCallback(() => {
    setShowDd(true)
  }, [setShowDd])

  const handleDeleteClick = useCallback(() => {
    onDeleteClick()
    setShowDd(false)
  }, [setShowDd, onDeleteClick])

  return (
    <Box
      ref={menuRef}
      role="menu"
      sx={{ bgcolor: 'background.default', color: 'text.primary' }}
    >
      <MoreVertIcon
        className="gddi-aiappcanvas__dropdown-icon"
        style={{ cursor: 'pointer' }}
        onClick={handleIconClick}
      />
      <Box
        className="gddi-aiappcanvas__dropdown-menu"
        hidden={isClickOutside || !showDd}
      >
        <button
          className={graphEditingDisabled ? 'disabled' : ''}
          name="delete"
          type="button"
          disabled={graphEditingDisabled}
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </Box>
    </Box>
  )
}
