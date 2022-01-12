import produce from 'immer'
import { SetState } from 'zustand'
import { MyState } from './useStore'

export interface ModeSlice {
  graphEditingDisabled: boolean
  propEditingDisabled: boolean
  setGraphEditingDisabled: (disabled: boolean) => void
  setPropEditingDisabled: (disabled: boolean) => void
}

const createModeSlice = (set: SetState<MyState>): ModeSlice => ({
  graphEditingDisabled: true,
  propEditingDisabled: false,
  setGraphEditingDisabled: (disabled: boolean) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        if (draft.graphEditingDisabled !== disabled) {
          draft1.graphEditingDisabled = disabled
        }
      })
    )
  },
  setPropEditingDisabled: (disabled: boolean) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        if (draft.propEditingDisabled !== disabled) {
          draft1.propEditingDisabled = disabled
        }
      })
    )
  }
})

export default createModeSlice
