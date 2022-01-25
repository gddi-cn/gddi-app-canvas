import produce from 'immer'
import { SetState, GetState } from 'zustand'
import { MyState } from './useStore'
import {
  PropValue,
  ModelListFetcher,
  FetchModelRes,
  LabelListFetcher,
  FetchLabelRes,
  FetchLabelMemo
} from '../types'

export const pageSize = 2

export interface CoreExtSlice {
  fetchLoading: boolean
  fetchModelRes: FetchModelRes
  fetchLabelMemo: FetchLabelMemo
  fetchLabelRes: FetchLabelRes
  setFetchLoading: (loading: boolean) => void
  modelListFetcher?: ModelListFetcher
  labelListFetcher?: LabelListFetcher
  setModelListFetcher: (fetcher: ModelListFetcher | undefined) => void
  setLabelListFetcher: (fetcher: LabelListFetcher | undefined) => void
  resetModuleProps: () => void
  setFetchModelRes: (res: FetchModelRes) => void
  setFetchLabelRes: (res: FetchLabelRes) => void
  fetchModelsWithLabels: (pageOffset: number) => void
}

const createCoreExtSlice = (
  set: SetState<MyState>,
  get: GetState<MyState>
): CoreExtSlice => ({
  fetchLoading: false,
  fetchModelRes: {
    models: [],
    totalCnt: 0
  },
  fetchLabelRes: {
    labels: []
  },
  fetchLabelMemo: {},
  modelListFetcher: undefined,
  labelListFetcher: undefined,
  setFetchLoading: (loading: boolean) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.fetchLoading = loading
      })
    )
  },
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
  },
  fetchModelsWithLabels: async (pageOffset: number) => {
    if (pageOffset < 0) {
      return
    }
    const { modelListFetcher, labelListFetcher } = get()
    if (modelListFetcher) {
      try {
        const modRes = await modelListFetcher(pageOffset, pageSize)
        const labelMemo = new Map<string, string[]>()
        if (labelListFetcher) {
          for (const mod of modRes.models) {
            const labelRes = await labelListFetcher(mod.mod_result_id)
            labelMemo.set(mod.mod_result_id, labelRes.labels)
          }
        }
        set(
          produce((draft: MyState) => {
            const draft1 = draft
            draft1.fetchModelRes = modRes
            labelMemo.forEach((val, key) => {
              draft1.fetchLabelMemo[key] = val
            })
            draft1.fetchLoading = false
          })
        )
      } catch (error) {
        console.error(error)
      }
    }
  }
})

export default createCoreExtSlice
