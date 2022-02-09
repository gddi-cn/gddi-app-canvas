import produce from 'immer'
import { GetState, SetState } from 'zustand'
import { MyState } from './useStore'

export interface DRCoreSlice {
  dinner: string
  setDinner: (d: string) => void
}

const createDRCoreSlice = (
  set: SetState<MyState>,
  get: GetState<MyState>
): DRCoreSlice => ({
  dinner: '🍔',
  setDinner: (d: string) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.dinner = d
      })
    )
  }
})

export default createDRCoreSlice
