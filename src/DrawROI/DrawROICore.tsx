import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { useEventListener } from './hooks'

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
}

export function DrawROICore({
  readonly,
  imgUrl,
  ROIs,
  onROIsChange
}: DrawROICoreProps) {
  const [fCanvas, setFCanvas] = useState<fabric.Canvas | undefined>()
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
      }
      opt.e.preventDefault()
      opt.e.stopPropagation()
    },
    [appRef.current]
  )

  const handleCanvasDown = useCallback(
    (opt: fabric.IEvent): void => {
      startPan(opt)
    },
    [appRef.current]
  )

  const handleCanvasMove = useCallback(
    (opt: fabric.IEvent): void => {
      panMoving(opt)
    },
    [appRef.current]
  )

  const handleCanvasUp = useCallback((): void => {
    endPan()
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
    // console.log('[effect] init fabric.canvas', 1)
    if (canvasRef.current && appRef.current === undefined) {
      const app = new fabric.Canvas(canvasRef.current, {
        width: canvasRef.current?.parentElement?.clientWidth,
        height: canvasRef.current?.parentElement?.clientHeight,
        fireRightClick: true,
        stopContextMenu: true,
        uniformScaling: false
      })
      app.hoverCursor = 'default'
      //   useEventListener('mouse:wheel', handleCanvasWheel, app)
      //   useEventListener('mouse:down', handleCanvasDown, app)
      //   useEventListener('mouse:move', handleCanvasMove, app)
      //   useEventListener('mouse:up', handleCanvasUp, app)

      setFCanvas(app)
      appRef.current = app

      // init image
      if (imgUrl) {
        fabric.Image.fromURL(imgUrl, (img: fabric.Image) => {
          img.set({
            ...ImageInitSetting,
            data: {
              type: 'image',
              url: imgUrl,
              name: imgUrl
            }
          })
          imgRef.current = img
          app.add(img)
        })
      }
    }
    return () => {
      // console.log('[effect] destroy fabric.canvas', 1)
      if (appRef.current) {
        // appRef.current.dispose()
      }
    }
  }, [canvasRef.current, setFCanvas])

  console.log(fCanvas, 11)
  useEventListener('mouse:wheel', handleCanvasWheel, fCanvas)
  useEventListener('mouse:down', handleCanvasDown, fCanvas)
  useEventListener('mouse:move', handleCanvasMove, fCanvas)
  useEventListener('mouse:up', handleCanvasUp, fCanvas)

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  )
}