import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { useStore } from './../store/useStore'
import shallow from 'zustand/shallow'
import { getRandomId } from './utils'
import { MyCircle } from './CircleGraph'
import { Point, Polygon } from './../types'

import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import ToggleButton from '@mui/material/ToggleButton'

export interface ControlsProps {
  disabled?: boolean
}

export type ControlsElementType = (props: ControlsProps) => JSX.Element

export const DrawPolygonControl: ControlsElementType = ({ disabled }) => {
  const [controlOn, setControlOn] = useState<boolean>(false)
  const {
    fabCanvas,
    imgWidth,
    imgHeight,
    addPolygons,
    setMouseDownHandler,
    setMouseMoveHandler
  } = useStore(
    (state) => ({
      fabCanvas: state.fabCanvas,
      imgWidth: state.mainImage?.width || 0,
      imgHeight: state.mainImage?.height || 0,
      addPolygons: state.addPolygons,
      setMouseDownHandler: state.setMouseDownHandler,
      setMouseMoveHandler: state.setMouseMoveHandler
    }),
    shallow
  )
  const activeLineRef = useRef<fabric.Line | undefined>(undefined)
  const activeShapeRef = useRef<fabric.Polygon | undefined>(undefined)
  const circleArrayRef = useRef<MyCircle[]>([])
  const lineArrayRef = useRef<fabric.Line[]>([])

  const handleToggleChange = useCallback(() => {
    setControlOn(!controlOn)
  }, [controlOn, setControlOn])

  const clearUpHelpers = useCallback(() => {
    if (fabCanvas === undefined) {
      return
    }
    const fabCanvas1 = fabCanvas as fabric.Canvas
    // clear up the helpers
    circleArrayRef.current.forEach((circle) => {
      fabCanvas1.remove(circle)
    })
    lineArrayRef.current.forEach((line) => {
      fabCanvas1.remove(line)
    })
    if (activeLineRef.current) {
      fabCanvas1.remove(activeLineRef.current)
    }
    if (activeShapeRef.current) {
      fabCanvas1.remove(activeShapeRef.current)
    }
    activeLineRef.current = undefined
    activeShapeRef.current = undefined
    circleArrayRef.current = []
    lineArrayRef.current = []
  }, [
    fabCanvas,
    activeLineRef.current,
    activeShapeRef.current,
    circleArrayRef.current,
    lineArrayRef.current
  ])

  const generatePolygon = useCallback(() => {
    if (fabCanvas === undefined) {
      return
    }
    const points: Point[] = []
    const circles = circleArrayRef.current
    circles.forEach((circle) => {
      points.push({ x: circle.left || 0, y: circle.top || 0 })
    })
    const newPolygon: Polygon = {
      id: getRandomId(),
      points,
      lastUpdated: new Date().toISOString()
    }
    addPolygons([newPolygon])

    clearUpHelpers()
  }, [
    circleArrayRef.current,
    lineArrayRef.current,
    activeLineRef.current,
    activeShapeRef.current
  ])

  const addPoint = useCallback(
    (pos: Point) => {
      if (fabCanvas === undefined) {
        return
      }
      const fabCanvas1 = fabCanvas as fabric.Canvas
      const circles = circleArrayRef.current
      const id = getRandomId()
      const circle = new MyCircle({ id, left: pos.x, top: pos.y })
      if (circles.length === 0) {
        circle.set({ fill: 'red' })
      }
      // the initial start and end points of a line
      const lineEnds = [pos.x, pos.y, pos.x, pos.y]
      const line = new fabric.Line(lineEnds, {
        strokeWidth: 2,
        fill: '#999999',
        stroke: '#999999',
        originX: 'center',
        originY: 'center',
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
        data: {
          class: 'line'
        }
      })
      if (activeShapeRef.current) {
        const shapePoints = activeShapeRef.current.get(
          'points'
        ) as fabric.Point[]
        shapePoints.push(new fabric.Point(pos.x, pos.y))
        const polygon = new fabric.Polygon(shapePoints, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false
        })
        // everytime -- remove the former polygon, add the new one as activeShape
        fabCanvas1.remove(activeShapeRef.current)
        fabCanvas1.add(polygon)
        activeShapeRef.current = polygon
        fabCanvas1.renderAll()
      } else {
        const polyPoint = [
          new fabric.Point(pos.x, pos.y),
          new fabric.Point(pos.x, pos.y)
        ]
        const polygon = new fabric.Polygon(polyPoint, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false
        })
        activeShapeRef.current = polygon
        fabCanvas1.add(polygon)
      }
      // update activeLine
      activeLineRef.current = line

      circleArrayRef.current.push(circle)
      lineArrayRef.current.push(line)

      fabCanvas1.add(line)
      fabCanvas1.add(circle)
      circle.adjustScaleByZoom()
      // fabCanvas1.selection = false
    },
    [
      fabCanvas,
      circleArrayRef.current,
      lineArrayRef.current,
      activeLineRef.current,
      activeShapeRef.current
    ]
  )

  const updateActive = useCallback(
    (pointer: Point) => {
      // 1) update activeLine
      if (activeLineRef.current) {
        activeLineRef.current.set({ x2: pointer.x, y2: pointer.y })
      }
      // 2) update activeShape
      if (activeShapeRef.current) {
        const points = activeShapeRef.current.get('points') as fabric.Point[]
        if (points.length > 1) {
          points[points.length - 1].setX(pointer.x)
          points[points.length - 1].setY(pointer.y)
          activeShapeRef.current.set({ points: points })
        }
      }
      if (activeLineRef.current || activeShapeRef.current) {
        fabCanvas?.renderAll()
      }
    },
    [
      fabCanvas,
      activeLineRef.current,
      activeShapeRef.current,
      circleArrayRef.current.length
    ]
  )

  const onMouseDown = useCallback(
    (opt: fabric.IEvent) => {
      // console.log(`🍑`)
      // console.log(opt.target)
      if (
        opt.target &&
        opt.target.data &&
        opt.target.data.id &&
        opt.target.data.type === 'circle'
      ) {
        // close to the first point
        if (
          circleArrayRef.current[0] &&
          circleArrayRef.current[0].data.id === opt.target.data.id
        )
          generatePolygon()
      } else if (fabCanvas !== undefined) {
        const pos = fabCanvas.getPointer(opt.e)
        if (imgWidth > 0 && imgHeight > 0) {
          // draw points when image unloaded -- not allowed
          boundPointer(pos, imgWidth, imgHeight)
          addPoint(pos)
        }
      }
    },
    [generatePolygon, addPoint, circleArrayRef.current[0]]
  )

  const onMouseMove = useCallback(
    (opt: fabric.IEvent) => {
      // console.log(`move 🍑`)
      if (fabCanvas && imgWidth > 0 && imgHeight > 0) {
        // draw points when image unloaded -- not allowed
        const pointer = fabCanvas.getPointer(opt.e)
        boundPointer(pointer, imgWidth, imgHeight)
        updateActive(pointer)
      }
    },
    [fabCanvas, imgWidth, imgHeight]
  )

  const boundPointer = useCallback(
    (pointer: Point, boundWidth: number, boundHeight: number) => {
      const x = Math.max(Math.min(pointer.x, boundWidth), 0)
      const y = Math.max(Math.min(pointer.y, boundHeight), 0)
      pointer.x = x
      pointer.y = y
    },
    []
  )

  useEffect(() => {
    if (controlOn) {
      setMouseDownHandler(onMouseDown)
      setMouseMoveHandler(onMouseMove)
    } else {
      clearUpHelpers()
      setMouseDownHandler(undefined)
      setMouseMoveHandler(undefined)
    }
  }, [
    controlOn,
    onMouseDown,
    onMouseMove,
    setMouseDownHandler,
    setMouseMoveHandler
  ])

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
        <EditIcon />
      </ToggleButton>
    </Box>
  )
}
