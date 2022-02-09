import create from 'zustand'
import createContext from 'zustand/context'

import createDRCoreSlice, { DRCoreSlice } from './createDRCoreSlice'

export type MyState = DRCoreSlice

const { Provider, useStore } = createContext<MyState>()

const createStore = () =>
  create<MyState>((set, get) => ({
    ...createDRCoreSlice(set, get)
  }))

export { Provider, useStore, createStore }
