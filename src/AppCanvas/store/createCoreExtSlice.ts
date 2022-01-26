import produce from 'immer'
import { SetState, GetState } from 'zustand'
import { MyState } from './useStore'
import {
  PropValue,
  ModelListFetcher,
  FetchModelRes,
  LabelListFetcher,
  FetchLabelRes,
  FetchLabelMemo,
  ROIImgFetcher
} from '../types'

export const pageSize = 10

export interface CoreExtSlice {
  roiImg: {
    url: string | undefined
    width: number
    height: number
  }
  fetchLoading: boolean
  fetchModelRes: FetchModelRes
  fetchLabelMemo: FetchLabelMemo
  fetchLabelRes: FetchLabelRes
  setFetchLoading: (loading: boolean) => void
  modelListFetcher?: ModelListFetcher
  labelListFetcher?: LabelListFetcher
  roiImgFetcher?: ROIImgFetcher
  setModelListFetcher: (fetcher: ModelListFetcher | undefined) => void
  setLabelListFetcher: (fetcher: LabelListFetcher | undefined) => void
  setROIImgFetcher: (fetcher: ROIImgFetcher | undefined) => void
  resetModuleProps: () => void
  setFetchModelRes: (res: FetchModelRes) => void
  setFetchLabelRes: (res: FetchLabelRes) => void
  fetchModelsWithLabels: (pageOffset: number) => void
  fetchROIImgURL: () => void
  setROIImg: (url?: string, width?: number, height?: number) => void
}

const createCoreExtSlice = (
  set: SetState<MyState>,
  get: GetState<MyState>
): CoreExtSlice => ({
  roiImg: {
    url: undefined,
    width: 1280,
    height: 720
  },
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
  roiImgFetcher: undefined,
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
  setROIImgFetcher: (fetcher: ROIImgFetcher | undefined) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.roiImgFetcher = fetcher
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
  },
  fetchROIImgURL: async () => {
    const { roiImgFetcher, roiImg } = get()
    if (roiImgFetcher && roiImg.width > 0 && roiImg.height > 0) {
      const res = await roiImgFetcher(roiImg.width, roiImg.height)
      if (res.url) {
        set(
          produce((draft: MyState) => {
            const draft1 = draft
            draft1.roiImg.url = res.url
          })
        )
      }
    }
  },
  setROIImg: (url?: string, width?: number, height?: number) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        if (url) {
          draft1.roiImg.url = url
        }
        if (width) {
          draft1.roiImg.width = width
        }
        if (height) {
          draft1.roiImg.height = height
        }
      })
    )
  }
})

export default createCoreExtSlice
