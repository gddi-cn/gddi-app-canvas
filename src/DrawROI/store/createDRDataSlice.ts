import produce from 'immer'
import { GetState, SetState } from 'zustand'
import { MyDRState } from './useStore'
import { Polygon } from './../types'

export interface DRDataSlice {
  polygons: Polygon[]
  addPolygons: (polygons: Polygon[]) => void
  deletePolygons: (ids: number[]) => void
}

const createDRDataSlice = (
  set: SetState<MyDRState>,
  get: GetState<MyDRState>
): DRDataSlice => ({
  polygons: [],
  addPolygons: (polygons: Polygon[]) => {
    set(
      produce((draft: MyDRState) => {
        const draft1 = draft
        polygons.forEach((polygon) => draft1.polygons.push(polygon))
      })
    )
  },
  deletePolygons: (ids: number[]) => {
    set(
      produce((draft: MyDRState) => {
        const draft1 = draft
        const newPolygons: Polygon[] = []
        draft1.polygons.forEach((polygon) => {
          if (ids.findIndex((val) => val === polygon.id) === -1) {
            newPolygons.push(polygon)
          }
        })
        draft1.polygons = newPolygons
      })
    )
  }
  //   setDinner: (d: string) => {
  //     set(
  //       produce((draft: MyDRState) => {
  //         const draft1 = draft
  //         draft1.dinner = d
  //       })
  //     )
  //   }
})

export default createDRDataSlice
