import create from 'zustand'
import createContext from 'zustand/context'

import createDRCoreSlice, { DRCoreSlice } from './createDRCoreSlice'

export type MyDRState = DRCoreSlice

const { Provider, useStore } = createContext<MyDRState>()

const createStore = () =>
  create<MyDRState>((set, get) => ({
    ...createDRCoreSlice(set, get)
  }))

export { Provider, useStore, createStore }
