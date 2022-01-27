import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { DrawRectAssistant, cropBox, getRegionFromBoxCorner } from './graph'

import Box from '@mui/material/Box'
import Crop169Icon from '@mui/icons-material/Crop169'
import ToggleButton from '@mui/material/ToggleButton'

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
  regions: number[][]
  onRegionsChange: (newRegions: number[][]) => void
}

export function ROICanvas({
  imgUrl,
  regions,
  onRegionsChange
}: ROICanvasProps) {
  const [mode, setMode] = useState<string>('default')
  const modeRef = useRef<string>('default')
  const appRef = useRef<fabric.Canvas | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<fabric.Image | undefined>(undefined)
  const isDragging = useRef<boolean>(false)
  const lastPosX = useRef<number>(0)
  const lastPosY = useRef<number>(0)
  const assistRef = useRef<DrawRectAssistant | undefined>(undefined)
  const boxesRef = useRef<fabric.Rect[]>([])

  console.log(`rrrr ROICanvas`)
  console.log(regions)

  const addROIBox = useCallback(
    ({ top, left, width, height }) => {
      if (imgRef.current !== undefined) {
        const imgW = imgRef.current.width as number
        const imgH = imgRef.current.height as number
        const cropRes = cropBox({
          xtl: left,
          ytl: top,
          xbr: left + width,
          ybr: top + height,
          imgW,
          imgH
        })
        // console.log(
        //   `top: ${top} - left: ${left} - width: ${width} - height: ${height}`
        // )
        // console.log(`imgW: ${imgW}, imgH: ${imgH}`)
        if (cropRes !== null) {
          const newRegion = getRegionFromBoxCorner(cropRes, imgW, imgH)
          // const idx = boxesRef.current.length
          // const newBox = new fabric.Rect({
          //   name: `roi-${idx}`,
          //   data: { id: idx, type: 'box', region: [...region] },
          //   fill: 'rgba(68, 227, 110, 0.3)',
          //   stroke: 'rgb(68, 227, 110)',
          //   strokeWidth: 1,
          //   strokeUniform: true,
          //   top: cropRes.ytl,
          //   left: cropRes.xtl,
          //   width: cropRes.xbr - cropRes.xtl,
          //   height: cropRes.ybr - cropRes.ytl,
          //   selectable: false,
          //   visible: true
          // })
          // appRef.current?.add(newBox)
          // boxesRef.current.push(newBox)
          onRegionsChange([...regions, [...newRegion]])
        }
      }
    },
    [imgRef.current, boxesRef.current, appRef.current, regions]
  )

  const updateBoxes = useCallback(
    (regions: number[][], imgW: number, imgH: number) => {
      console.log('upate boxes')
      console.log(boxesRef.current)
      // 1) clear old boxes
      boxesRef.current.forEach((box) => {
        appRef.current?.remove(box)
      })
      boxesRef.current = []
      // 2) create new boxes
      regions.forEach((region, idx) => {
        const newBox = new fabric.Rect({
          name: `roi-${idx}`,
          data: { id: idx, type: 'box', region: [...region] },
          fill: 'rgba(68, 227, 110, 0.3)',
          stroke: 'rgb(68, 227, 110)',
          strokeWidth: 1,
          strokeUniform: true,
          top: Math.floor(region[0] * imgH),
          left: Math.floor(region[1] * imgW),
          width: Math.floor(region[2] * imgW),
          height: Math.floor(region[3] * imgH),
          selectable: false,
          visible: true
        })
        appRef.current?.add(newBox)
        boxesRef.current.push(newBox)
      })
    },
    [boxesRef.current, appRef.current]
  )

  const handleDrawBoxToggleChange = useCallback(() => {
    if (mode === 'box') {
      setMode('default')
      modeRef.current = 'default'
    } else {
      setMode('box')
      modeRef.current = 'box'
    }
  }, [mode, setMode])

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
      // console.log(appRef.current?.getObjects())
      if (modeRef.current !== 'box') {
        startPan(opt)
      } else if (
        appRef.current !== undefined &&
        assistRef.current !== undefined
      ) {
        const pt = appRef.current.getPointer(opt.e as any)
        if (assistRef.current.Status === 'init') {
          assistRef.current.setPoint(pt.x, pt.y)
          assistRef.current.addToCanvas(appRef.current)
          appRef.current.requestRenderAll()
        } else if (assistRef.current.Status === 'pt1') {
          // end draw -- create new box
          assistRef.current.setPoint(pt.x, pt.y)
          const { top, left, width, height } = assistRef.current.endDraw()
          addROIBox({ top, left, width, height })
          // this.addNewBox(
          //   Math.round(top),
          //   Math.round(left),
          //   Math.round(width),
          //   Math.round(height)
          // )
          assistRef.current.removeFromCanvas()
        }
      }
    },
    [modeRef.current, assistRef.current, appRef.current, regions]
  )

  const handleCanvasMove = useCallback(
    (opt: fabric.IEvent): void => {
      if (modeRef.current !== 'box') {
        panMoving(opt)
      } else if (
        appRef.current !== undefined &&
        assistRef.current !== undefined
      ) {
        const evt = opt.e as any
        const pt = appRef.current.getPointer(evt)
        if (assistRef.current.Status === 'pt1') {
          assistRef.current.setPoint(pt.x, pt.y)
          appRef.current.requestRenderAll()
        }
      }
    },
    [modeRef.current, assistRef.current, appRef.current]
  )

  const handleCanvasUp = useCallback((): void => {
    if (modeRef.current !== 'box') {
      endPan()
    }
  }, [modeRef.current])

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

  // useEffect(() => {
  //   // update boxes
  //   // 1) clear old boxes
  //   boxesRef.current.forEach((box) => {
  //     appRef.current?.remove(box)
  //   })
  //   boxesRef.current = []
  //   // 2) create new boxes
  //   if (imgRef.current !== undefined && appRef.current !== undefined) {
  //     const imgW = imgRef.current.width as number
  //     const imgH = imgRef.current.height as number
  //     defaultRegions.forEach((region, idx) => {
  //       const newBox = new fabric.Rect({
  //         name: `roi-${idx}`,
  //         data: { id: idx, type: 'box', region: [...region] },
  //         fill: 'rgba(68, 227, 110, 0.3)',
  //         stroke: 'rgb(68, 227, 110)',
  //         strokeWidth: 1,
  //         strokeUniform: true,
  //         top: Math.floor(region[0] * imgH),
  //         left: Math.floor(region[1] * imgW),
  //         width: Math.floor(region[2] * imgW),
  //         height: Math.floor(region[3] * imgH),
  //         selectable: false,
  //         visible: true
  //       })
  //       appRef.current?.add(newBox)
  //       boxesRef.current.push(newBox)
  //     })
  //   }
  // }, [defaultRegions, imgRef.current?.width, imgRef.current?.height])

  useEffect(() => {
    // image changed -> update image and boxes
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

        updateBoxes(regions, img.width as number, img.height as number)
        // const imgW = img.width as number
        // const imgH = img.height as number
        // // 1) clear old boxes
        // boxesRef.current.forEach((box) => {
        //   console.log('before remove box')
        //   console.log(appRef.current?.getObjects())
        //   console.log(appRef.current?.contains(box))
        //   appRef.current?.remove(box)
        //   console.log('after remove box')
        //   console.log(appRef.current?.getObjects())
        // })
        // boxesRef.current = []
        // // 2) create new boxes
        // regions.forEach((region, idx) => {
        //   const newBox = new fabric.Rect({
        //     name: `roi-${idx}`,
        //     data: { id: idx, type: 'box', region: [...region] },
        //     fill: 'rgba(68, 227, 110, 0.3)',
        //     stroke: 'rgb(68, 227, 110)',
        //     strokeWidth: 1,
        //     strokeUniform: true,
        //     top: Math.floor(region[0] * imgH),
        //     left: Math.floor(region[1] * imgW),
        //     width: Math.floor(region[2] * imgW),
        //     height: Math.floor(region[3] * imgH),
        //     selectable: false,
        //     visible: true
        //   })
        //   appRef.current?.add(newBox)
        //   boxesRef.current.push(newBox)
        // })

        appRef.current?.requestRenderAll()
      })
    }
  }, [imgUrl])

  useEffect(() => {
    // init fabric.canvas
    console.log('inittttt')
    if (canvasRef.current && appRef.current === undefined) {
      const app = new fabric.Canvas(canvasRef.current, {
        width: canvasRef.current?.parentElement?.clientWidth,
        height: canvasRef.current?.parentElement?.clientHeight,
        fireRightClick: true,
        stopContextMenu: true,
        uniformScaling: false
      })
      app.hoverCursor = 'default'
      app.on('mouse:wheel', handleCanvasWheel)
      app.on('mouse:down', handleCanvasDown)
      app.on('mouse:move', handleCanvasMove)
      app.on('mouse:up', handleCanvasUp)

      appRef.current = app
      // init DrawBoxAssistant
      if (assistRef.current === undefined) {
        assistRef.current = new DrawRectAssistant()
      }

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

          // init boxes
          const imgW = img.width as number
          const imgH = img.height as number
          regions.forEach((region, idx) => {
            const newBox = new fabric.Rect({
              name: `roi-${idx}`,
              data: { id: idx, type: 'box', region: [...region] },
              fill: 'rgba(68, 227, 110, 0.3)',
              stroke: 'rgb(68, 227, 110)',
              strokeWidth: 1,
              strokeUniform: true,
              top: Math.floor(region[0] * imgH),
              left: Math.floor(region[1] * imgW),
              width: Math.floor(region[2] * imgW),
              height: Math.floor(region[3] * imgH),
              selectable: false,
              visible: true
            })
            app.add(newBox)
            boxesRef.current.push(newBox)
          })
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

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      <Box
        sx={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backgroundColor: '#fbfbfbbd',
          borderRadius: '4px'
        }}
      >
        <ToggleButton
          value="box"
          selected={mode === 'box'}
          onChange={handleDrawBoxToggleChange}
        >
          <Crop169Icon />
        </ToggleButton>
      </Box>
    </>
  )
}
