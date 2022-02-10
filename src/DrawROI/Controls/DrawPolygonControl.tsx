import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { useStore } from './../store/useStore'
import shallow from 'zustand/shallow'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Crop169Icon from '@mui/icons-material/Crop169'
import DeleteIcon from '@mui/icons-material/Delete'
import BackspaceIcon from '@mui/icons-material/Backspace'
import ToggleButton from '@mui/material/ToggleButton'

export interface ControlsProps {
  disabled?: boolean
}

export type ControlsElementType = (props: ControlsProps) => JSX.Element

export const DrawPolygonControl: ControlsElementType = ({ disabled }) => {
  const [controlOn, setControlOn] = useState<boolean>(false)
  const { fabCanvas, setMouseDownHandler } = useStore(
    (state) => ({
      fabCanvas: state.fabCanvas,
      setMouseDownHandler: state.setMouseDownHandler
    }),
    shallow
  )

  const handleToggleChange = useCallback(() => {
    setControlOn(!controlOn)
  }, [controlOn, setControlOn])

  const onMouseDown = useCallback((opt: fabric.IEvent) => {
    console.log(`🍑`)
  }, [])

  useEffect(() => {
    if (controlOn) {
      setMouseDownHandler(onMouseDown)
    } else {
      setMouseDownHandler(undefined)
    }
  }, [controlOn, onMouseDown])

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '1rem',
        left: '1rem'
      }}
    >
      <ToggleButton
        disabled={disabled === true}
        sx={{
          backgroundColor: '#fbfbfbbd'
        }}
        value="drawPolygon"
        selected={controlOn}
        onChange={handleToggleChange}
      >
        <Crop169Icon />
      </ToggleButton>
    </Box>
  )
}
