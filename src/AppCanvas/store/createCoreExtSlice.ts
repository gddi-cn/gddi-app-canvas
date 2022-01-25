import produce from 'immer'
import { SetState, GetState } from 'zustand'
import { MyState } from './useStore'
import {
  PropValue,
  ModelListFetcher,
  FetchModelRes,
  LabelListFetcher,
  FetchLabelRes
} from '../types'

export interface CoreExtSlice {
  fetchModelRes: FetchModelRes
  fetchLabelRes: FetchLabelRes
  modelListFetcher?: ModelListFetcher
  labelListFetcher?: LabelListFetcher
  setModelListFetcher: (fetcher: ModelListFetcher | undefined) => void
  setLabelListFetcher: (fetcher: LabelListFetcher | undefined) => void
  resetModuleProps: () => void
  setFetchModelRes: (res: FetchModelRes) => void
  setFetchLabelRes: (res: FetchLabelRes) => void
}

const createCoreExtSlice = (
  set: SetState<MyState>,
  get: GetState<MyState>
): CoreExtSlice => ({
  fetchModelRes: {
    models: [],
    totalCnt: 0
  },
  fetchLabelRes: {
    labels: []
  },
  modelListFetcher: undefined,
  labelListFetcher: undefined,
  resetModuleProps: () => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.value.nodes.forEach((mod) => {
          if (mod.props) {
            Object.keys(mod.props).forEach((propName) => {
              ;(mod.props as { [propName: string]: PropValue })[propName] = (
                mod.propsInited as { [propName: string]: PropValue }
              )[propName]
            })
          }
        })
      })
    )
  },
  setModelListFetcher: (fetcher: ModelListFetcher | undefined) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.modelListFetcher = fetcher
      })
    )
  },
  setLabelListFetcher: (fetcher: LabelListFetcher | undefined) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.labelListFetcher = fetcher
      })
    )
  },
  setFetchModelRes: (res: FetchModelRes) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.fetchModelRes.models = [...res.models]
        draft1.fetchModelRes.totalCnt = res.totalCnt
      })
    )
  },
  setFetchLabelRes: (res: FetchLabelRes) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.fetchLabelRes.labels = [...res.labels]
      })
    )
  }
})

export default createCoreExtSlice
