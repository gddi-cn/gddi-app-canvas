import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'

import Box from '@mui/material/Box'

const ImageInitSetting = {
  shadow: new fabric.Shadow({
    color: '#8fa8bf',
    blur: 20,
    offsetX: 8,
    offsetY: 18
  }),
  selectable: false
}

export interface ROICanvasProps {
  imgUrl: string | undefined
  imgWidth: number
  imgHeight: number
  defaultRegions: number[][]
}

export function ROICanvas({
  imgUrl,
  imgWidth,
  imgHeight,
  defaultRegions
}: ROICanvasProps) {
  const appRef = useRef<fabric.Canvas | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<fabric.Image | undefined>(undefined)
  const isDragging = useRef<boolean>(false)
  const lastPosX = useRef<number>(0)
  const lastPosY = useRef<number>(0)

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

  const handleCanvasDown = useCallback((opt: fabric.IEvent): void => {
    startPan(opt)
    // if (toolType === 'drawBox' && this.canvasInstance && !panning) {
    //   const pt = this.canvasInstance.getPointer(opt.e as any)
    //   if (this.drawRectAssistant.Status === 'init') {
    //     this.drawRectAssistant.setPoint(pt.x, pt.y)
    //     this.drawRectAssistant.addToCanvas(this.canvasInstance)
    //     this.canvasInstance.requestRenderAll()
    //   } else if (this.drawRectAssistant.Status === 'pt1') {
    //     // end draw -- create new box
    //     this.drawRectAssistant.setPoint(pt.x, pt.y)
    //     const { top, left, width, height } = this.drawRectAssistant.endDraw()
    //     this.addNewBox(
    //       Math.round(top),
    //       Math.round(left),
    //       Math.round(width),
    //       Math.round(height)
    //     )
    //     this.drawRectAssistant.removeFromCanvas()
    //   }
    // }
  }, [])

  const handleCanvasMove = useCallback((opt: fabric.IEvent): void => {
    panMoving(opt)
    // if (this.canvasInstance) {
    //   const evt = opt.e as any
    //   const pt = this.canvasInstance.getPointer(evt)
    //   onMouseMove(evt.offsetX, evt.offsetY, pt.x, pt.y)
    //   if (toolType === 'drawBox' && this.drawRectAssistant.Status === 'pt1') {
    //     this.drawRectAssistant.setPoint(pt.x, pt.y)
    //     this.canvasInstance.requestRenderAll()
    //   }
    // }
  }, [])

  const handleCanvasUp = useCallback((): void => {
    endPan()
  }, [])

  const startPan = useCallback((opt: fabric.IEvent): void => {
    const evt = opt.e as any
    if (appRef.current) {
      isDragging.current = true
      lastPosX.current = evt.clientX
      lastPosY.current = evt.clientY
    }
  }, [])

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
    // init image
    if (
      appRef.current !== undefined &&
      imgUrl !== undefined &&
      imgRef.current !== undefined
    ) {
      imgRef.current.setSrc(imgUrl, (img: fabric.Image) => {
        img.set({
          ...ImageInitSetting,
          data: {
            type: 'image',
            url: imgUrl,
            name: imgUrl
          }
        })
        //TODO: fit image in center
        appRef.current?.requestRenderAll()
        console.log(appRef.current)
      })
    }
  }, [imgUrl])

  useEffect(() => {
    if (canvasRef.current && appRef.current === undefined) {
      const app = new fabric.Canvas(canvasRef.current, {
        width: canvasRef.current?.parentElement?.clientWidth,
        height: canvasRef.current?.parentElement?.clientHeight,
        fireRightClick: true,
        stopContextMenu: true,
        uniformScaling: false
      })
      app.on('mouse:wheel', handleCanvasWheel)
      app.on('mouse:down', handleCanvasDown)
      app.on('mouse:move', handleCanvasMove)
      app.on('mouse:up', handleCanvasUp)

      appRef.current = app
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
      console.log('dddddestroy')
      if (appRef.current) {
        // appRef.current.off()
        // appRef.current.dispose()
      }
    }
  }, [canvasRef.current])

  return <canvas ref={canvasRef}></canvas>
}
