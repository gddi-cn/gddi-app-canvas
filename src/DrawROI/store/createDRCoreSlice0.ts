// import produce, { Draft } from 'immer'
// import { GetState, SetState } from 'zustand'
// import { MyDRState } from './useStore'
// import { fabric } from 'fabric'

// type FabCanvasEventListener = (opt: fabric.IEvent) => void

// export interface DRCoreSlice {
//   fabCanvas?: fabric.Canvas
//   setFabCanvas: (c: fabric.Canvas | undefined) => void
//   mouseDownHandler?: FabCanvasEventListener
//   mouseMoveHandler?: FabCanvasEventListener
//   mouseUpHandler?: FabCanvasEventListener
//   setMouseDownHandler: (handler: FabCanvasEventListener) => void
//   setMouseMoveHandler: (handler: FabCanvasEventListener) => void
//   setMouseUpHandler: (handler: FabCanvasEventListener) => void
// }

// const createDRCoreSlice = (
//   set: SetState<MyDRState>,
//   get: GetState<MyDRState>
// ): DRCoreSlice => ({
//   setFabCanvas: (c: fabric.Canvas | undefined) => {
//     set(
//       produce((draft: Draft<MyDRState>) => {
//         draft.fabCanvas = c
//       })
//     )
//   },
//   setMouseDownHandler: (handler: FabCanvasEventListener) => {
//     set(
//       produce((draft: MyState) => {
//         const draft1 = draft
//         draft1.mouseDownHandler = handler
//       })
//     )
//   },
//   setMouseMoveHandler: (handler: FabCanvasEventListener) => {
//     set(
//       produce((draft: MyState) => {
//         const draft1 = draft
//         draft1.mouseMoveHandler = handler
//       })
//     )
//   },
//   setMouseUpHandler: (handler: FabCanvasEventListener) => {
//     set(
//       produce((draft: MyState) => {
//         const draft1 = draft
//         draft1.mouseUpHandler = handler
//       })
//     )
//   }
// })

// export default createDRCoreSlice
