import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { fabric } from 'fabric'
import { useEventListener } from './hooks'
import { useStore } from './store/useStore'
import shallow from 'zustand/shallow'
import { SelectControl } from './Controls'
import { PolygonComponent } from './ObjectComponents'

import Box from '@mui/material/Box'

import './DrawROICore.scss'

const ImageInitSetting = {
  shadow: new fabric.Shadow({
    color: '#8fa8bf',
    blur: 20,
    offsetX: 8,
    offsetY: 18
  }),
  selectable: false
}

export interface DrawROICoreProps {
  readonly?: boolean
  imgUrl: string | undefined
  ROIs: string[]
  onROIsChange?: (newROIs: string[]) => void
  children?: React.ReactNode
}

export function DrawROICore({
  readonly,
  imgUrl,
  ROIs,
  onROIsChange,
  children
}: DrawROICoreProps) {
  const {
    fabCanvas,
    polygons,
    setFabCanvas,
    setMainImage,
    mouseDownHandler,
    mouseUpHandler,
    mouseMoveHandler
  } = useStore(
    (state) => ({
      fabCanvas: state.fabCanvas,
      polygons: state.polygons,
      setFabCanvas: state.setFabCanvas,
      setMainImage: state.setMainImage,
      mouseDownHandler: state.mouseDownHandler,
      mouseUpHandler: state.mouseUpHandler,
      mouseMoveHandler: state.mouseMoveHandler
    }),
    shallow
  )
  const appRef = useRef<fabric.Canvas | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<fabric.Image | undefined>(undefined)
  const isDragging = useRef<boolean>(false)
  const lastPosX = useRef<number>(0)
  const lastPosY = useRef<number>(0)

  // console.log(`rrrr DrawROICore`)
  // console.log(ROIs)

  const handleCanvasWheel = useCallback(
    (opt: fabric.IEvent): void => {
      const evt = opt.e as any
      const delta = evt.deltaY
      let zoom = appRef.current?.getZoom()
      if (zoom) {
        zoom *= 0.999 ** (delta * 2)
        if (zoom > 20) zoom = 20
        if (zoom < 0.05) zoom = 0.05
        appRef.current?.zoomToPoint({ x: evt.offsetX, y: evt.offsetY }, zoom)
        const zoomInverse = 1 / zoom
        appRef.current?.getObjects().forEach((obj) => {
          if (obj.data && obj.data.ignoreZoom === true) {
            obj.scale(zoomInverse)
          }
        })
      }
      opt.e.preventDefault()
      opt.e.stopPropagation()
    },
    [appRef.current]
  )

  //TODO: default control -- selectMove; press space to startPan

  const handleCanvasDown = useCallback(
    (opt: fabric.IEvent): void => {
      if (mouseDownHandler === undefined) {
        startPan(opt)
      } else {
        mouseDownHandler(opt)
      }
    },
    [appRef.current, mouseDownHandler]
  )

  const handleCanvasMove = useCallback(
    (opt: fabric.IEvent): void => {
      if (mouseMoveHandler === undefined) {
        panMoving(opt)
      } else {
        mouseMoveHandler(opt)
      }
    },
    [appRef.current, mouseMoveHandler]
  )

  const handleCanvasUp = useCallback((opt: fabric.IEvent): void => {
    if (mouseUpHandler === undefined) {
      endPan()
    } else {
      mouseUpHandler(opt)
    }
  }, [])

  const startPan = useCallback(
    (opt: fabric.IEvent): void => {
      const evt = opt.e as any
      if (appRef.current) {
        isDragging.current = true
        lastPosX.current = evt.clientX
        lastPosY.current = evt.clientY
      }
    },
    [appRef.current, isDragging.current, lastPosX.current, lastPosY.current]
  )

  const panMoving = useCallback((opt: fabric.IEvent): void => {
    if (isDragging.current && appRef.current) {
      const e = opt.e as any
      const vpt = appRef.current.viewportTransform
      if (vpt) {
        vpt[4] += e.clientX - lastPosX.current
        vpt[5] += e.clientY - lastPosY.current
        appRef.current.requestRenderAll()
      }
      lastPosX.current = e.clientX
      lastPosY.current = e.clientY
    }
  }, [])

  const endPan = useCallback((): void => {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    if (appRef.current && appRef.current.viewportTransform) {
      appRef.current.setViewportTransform(appRef.current.viewportTransform)
      isDragging.current = false
    }
  }, [])

  useEffect(() => {
    // init fabric.canvas
    console.log('[effect] init fabric.canvas', 1)
    if (canvasRef.current && appRef.current === undefined) {
      const app = new fabric.Canvas(canvasRef.current, {
        width: canvasRef.current?.parentElement?.clientWidth,
        height: canvasRef.current?.parentElement?.clientHeight,
        fireRightClick: true,
        stopContextMenu: true,
        uniformScaling: false,
        selection: false
      })
      app.hoverCursor = 'default'
      setFabCanvas(app)
      appRef.current = app

      // init image
      if (imgUrl) {
        fabric.Image.fromURL(imgUrl, (img: fabric.Image) => {
          img.set({
            ...ImageInitSetting,
            data: {
              type: 'mainImage',
              url: imgUrl,
              name: imgUrl
            }
          })
          imgRef.current = img
          setMainImage(img)
          app.add(img)
        })
      }
    }
    return () => {
      console.log('[effect] destroy fabric.canvas', 1)
      if (canvasRef.current === null && appRef.current) {
        appRef.current.dispose()
        setFabCanvas(undefined)
      }
    }
  }, [canvasRef.current, setFabCanvas, setMainImage])

  const polygonComponentList = useMemo(() => {
    return polygons.map((polygon) => (
      <PolygonComponent key={polygon.id} polygon={polygon} />
    ))
  }, [polygons.length, polygons])
  console.log(polygons)

  useEventListener('mouse:wheel', handleCanvasWheel, fabCanvas)
  useEventListener('mouse:down', handleCanvasDown, fabCanvas)
  useEventListener('mouse:move', handleCanvasMove, fabCanvas)
  useEventListener('mouse:up', handleCanvasUp, fabCanvas)

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      <Box className="DR-controls-wrapper">
        {fabCanvas !== undefined && <SelectControl />}
        {fabCanvas !== undefined && children}
      </Box>
      {fabCanvas !== undefined && polygonComponentList}
    </>
  )
}
