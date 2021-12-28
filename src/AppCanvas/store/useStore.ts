import create from 'zustand'

import createCoreSlice, { CoreSlice } from './createCoreSlice'
import createModeSlice, { ModeSlice } from './createModeSlice'

export type MyState = CoreSlice & ModeSlice

const useStore = create<MyState>((set, get) => ({
  ...createCoreSlice(set, get),
  ...createModeSlice(set)
}))

export default useStore
