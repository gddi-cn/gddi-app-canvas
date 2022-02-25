import { GetState, SetState } from 'zustand'
import { MyDRState } from './useStore'
import { fabric } from 'fabric'

type FabCanvasEventListener = (opt: fabric.IEvent) => void

type ControlModeType = 'default' | 'select' | 'drawPolygon'

export interface DRCoreSlice {
  dinner: string
  //   setDinner: (d: string) => void
  controlMode: ControlModeType
  fabCanvas?: fabric.Canvas
  mainImage?: fabric.Image
  setControlMode: (mode: string) => void
  setFabCanvas: (c: fabric.Canvas | undefined) => void
  setMainImage: (c: fabric.Image | undefined) => void
  mouseDownHandler?: FabCanvasEventListener
  mouseUpHandler?: FabCanvasEventListener
  mouseMoveHandler?: FabCanvasEventListener
  setMouseDownHandler: (handler: FabCanvasEventListener | undefined) => void
  setMouseUpHandler: (handler: FabCanvasEventListener | undefined) => void
  setMouseMoveHandler: (handler: FabCanvasEventListener | undefined) => void
}

const createDRCoreSlice = (
  set: SetState<MyDRState>,
  get: GetState<MyDRState>
): DRCoreSlice => ({
  dinner: '🍔',
  //   setDinner: (d: string) => {
  //     set(
  //       produce((draft: MyDRState) => {
  //         const draft1 = draft
  //         draft1.dinner = d
  //       })
  //     )
  //   },
  controlMode: 'default',
  setControlMode: (mode: string) => {
    set({ controlMode: mode as ControlModeType })
  },
  setFabCanvas: (c: fabric.Canvas | undefined) => {
    set({ fabCanvas: c })
  },
  setMainImage: (img: fabric.Image | undefined) => {
    console.log(`set mainimage: ${img?.width} - ${img?.height}`)
    set({ mainImage: img })
  },
  setMouseDownHandler: (handler: FabCanvasEventListener | undefined) => {
    set({
      mouseDownHandler: handler
    })
  },
  setMouseUpHandler: (handler: FabCanvasEventListener | undefined) => {
    set({
      mouseUpHandler: handler
    })
  },
  setMouseMoveHandler: (handler: FabCanvasEventListener | undefined) => {
    set({
      mouseMoveHandler: handler
    })
  }
})

export default createDRCoreSlice
