import produce from 'immer'
import { GetState, SetState } from 'zustand'
import { MyDRState } from './useStore'
import { fabric } from 'fabric'

type FabCanvasEventListener = (opt: fabric.IEvent) => void

export interface DRCoreSlice {
  dinner: string
  //   setDinner: (d: string) => void
  fabCanvas?: fabric.Canvas
  setFabCanvas: (c: fabric.Canvas | undefined) => void
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
  setFabCanvas: (c: fabric.Canvas | undefined) => {
    set({ fabCanvas: c })
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
