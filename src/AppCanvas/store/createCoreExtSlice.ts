import produce from 'immer'
import { SetState, GetState } from 'zustand'
import { MyState } from './useStore'
import { ModulePropType } from '../types'

export interface CoreExtSlice {
  resetModuleProps: () => void
}

const createCoreExtSlice = (
  set: SetState<MyState>,
  get: GetState<MyState>
): CoreExtSlice => ({
  resetModuleProps: () => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.value.nodes.forEach((mod) => {
          if (mod.props) {
            Object.keys(mod.props).forEach((propName) => {
              ;(mod.props as { [propName: string]: ModulePropType })[propName] =
                (mod.propsInited as { [propName: string]: ModulePropType })[
                  propName
                ]
            })
          }
        })
      })
    )
  }
})

export default createCoreExtSlice
