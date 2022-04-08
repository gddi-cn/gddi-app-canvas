import React, { useCallback, useEffect, useRef } from 'react'
import { fabric } from 'fabric'
import { useStore } from './../store/useStore'
import shallow from 'zustand/shallow'
import { ControlsElementType } from './ControlType'
import { getRandomId } from './../helpers'
import { MyCircle } from './CircleGraph'
import { Point, Polygon } from './../types'

import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined'

export const DrawRectControl: ControlsElementType = ({ disabled }) => {
  const {
    controlMode,
    setControlMode,
    fabCanvas,
    imgWH,
    addPolygons,
    setMouseDownHandler,
    setMouseMoveHandler
  } = useStore(
    (state) => ({
      controlMode: state.controlMode,
      setControlMode: state.setControlMode,
      fabCanvas: state.fabCanvas,
      imgWH: state.imgWH,
      addPolygons: state.addPolygons,
      setMouseDownHandler: state.setMouseDownHandler,
      setMouseMoveHandler: state.setMouseMoveHandler
    }),
    shallow
  )

  const handleToggleChange = useCallback(() => {
    if (controlMode !== 'drawRect') {
      setControlMode('drawRect')
    } else {
      setControlMode('default')
    }
  }, [setControlMode, controlMode])

  const onMouseDown = useCallback((opt: fabric.IEvent) => {
    console.log(`mouse down 🍑`)
    console.log(opt.target)
  }, [])

  const onMouseMove = useCallback(
    (opt: fabric.IEvent) => {
      if (fabCanvas && imgWH.width > 0 && imgWH.height > 0) {
        //   console.log(`move 🍑`)
      }
    },
    [fabCanvas, imgWH]
  )

  useEffect(() => {
    if (controlMode === 'drawRect') {
      setMouseDownHandler(onMouseDown)
      setMouseMoveHandler(onMouseMove)
    } else {
      //   clearUpHelpers()
      if (controlMode === 'default') {
        // console.log('remove drawpolygon handler')
        setMouseDownHandler(undefined)
        setMouseMoveHandler(undefined)
      }
    }
  }, [
    controlMode,
    onMouseDown,
    onMouseMove,
    setMouseDownHandler,
    setMouseMoveHandler
  ])

  return (
    <Box className="DR-control1">
      <Tooltip title="draw rectangle">
        <ToggleButton
          disabled={disabled === true}
          sx={{
            backgroundColor: 'white'
          }}
          value="drawRect"
          selected={controlMode === 'drawRect'}
          onChange={handleToggleChange}
        >
          <RectangleOutlinedIcon />
        </ToggleButton>
      </Tooltip>
    </Box>
  )
}
