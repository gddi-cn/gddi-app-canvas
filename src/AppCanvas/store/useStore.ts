import create from 'zustand'
import createContext from 'zustand/context'

import createCoreSlice, { CoreSlice } from './createCoreSlice'
import createCoreExtSlice, {
  CoreExtSlice,
  pageSize
} from './createCoreExtSlice'
import createModeSlice, { ModeSlice } from './createModeSlice'

export type MyState = CoreSlice & CoreExtSlice & ModeSlice

const { Provider, useStore } = createContext<MyState>()

const createStore = () =>
  create<MyState>((set, get) => ({
    ...createCoreSlice(set, get),
    ...createCoreExtSlice(set, get),
    ...createModeSlice(set)
  }))

export { Provider, useStore, createStore, pageSize }
