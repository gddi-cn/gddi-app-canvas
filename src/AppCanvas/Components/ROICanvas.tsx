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
      //   app.on('mouse:down', handleCanvasDown)
      //   app.on('mouse:move', handleCanvasMove)
      //   app.on('mouse:up', handleCanvasUp)
      //   app.on('mouse:over', handleCanvasOver)

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
