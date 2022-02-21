import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { useStore } from './../store/useStore'
import shallow from 'zustand/shallow'
import { ControlsElementType } from './ControlType'
import { Point, Polygon } from './../types'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ToggleButton from '@mui/material/ToggleButton'
import { MyPolygon } from './PolygonGraph'

export const SelectControl: ControlsElementType = ({ disabled }) => {
  const {
    fabCanvas,
    controlMode,
    setControlMode,
    setMouseDownHandler,
    setMouseMoveHandler
  } = useStore(
    (state) => ({
      fabCanvas: state.fabCanvas,
      controlMode: state.controlMode,
      setControlMode: state.setControlMode,
      setMouseDownHandler: state.setMouseDownHandler,
      setMouseMoveHandler: state.setMouseMoveHandler
    }),
    shallow
  )

  const handleToggleChange = useCallback(() => {
    if (controlMode !== 'select') {
      setControlMode('select')
    } else {
      setControlMode('default')
    }
  }, [setControlMode, controlMode])

  const handleDoneClick = useCallback(() => {
    if (fabCanvas) {
      if (
        fabCanvas.getActiveObject() &&
        fabCanvas.getActiveObject().data &&
        fabCanvas.getActiveObject().data.type === 'polygon'
      ) {
        const selectedPolygon = fabCanvas.getActiveObject() as MyPolygon
        selectedPolygon.editing = false
        fabCanvas.discardActiveObject()
        fabCanvas.renderAll()
      }
    }
  }, [fabCanvas])

  const onMouseDown = useCallback((opt: fabric.IEvent) => {
    console.log(`down 🍟`)
    // console.log(opt.target)
  }, [])

  const onMouseMove = useCallback(
    (opt: fabric.IEvent) => {
      //   console.log(`move 🍟`)
    },
    [fabCanvas]
  )

  const init = useCallback(() => {
    if (fabCanvas) {
      fabCanvas.getObjects().forEach((obj) => {
        if (obj.data && obj.data.type && obj.data.type !== 'mainImage') {
          obj.selectable = true
        }
      })
    }
  }, [fabCanvas])

  const clearUp = useCallback(() => {
    if (fabCanvas) {
      fabCanvas.discardActiveObject()
      console.log(fabCanvas.getActiveObjects())
      fabCanvas.getObjects().forEach((obj) => {
        obj.selectable = false
      })
      fabCanvas.renderAll()
    }
  }, [fabCanvas])

  useEffect(() => {
    if (controlMode === 'select') {
      init()
      setMouseDownHandler(onMouseDown)
      setMouseMoveHandler(onMouseMove)
    } else {
      clearUp()
      if (controlMode === 'default') {
        console.log('remove select handler')
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
    <>
      <Box className="DR-control1">
        <ToggleButton
          disabled={disabled === true}
          sx={{
            backgroundColor: 'white'
          }}
          value="select"
          selected={controlMode === 'select'}
          onChange={handleToggleChange}
        >
          Select
        </ToggleButton>
      </Box>
      {controlMode === 'select' && (
        <Box className="DR-control2">
          <Button
            disabled={disabled === true}
            variant="contained"
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </Box>
      )}
    </>
  )
}
