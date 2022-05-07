import produce from 'immer'
import { SetState, GetState } from 'zustand'
import { MyState } from './useStore'
import {
  PropValue,
  ModelListFetcher,
  FetchModelRes,
  ROIImgFetcher
} from '../types'

export const pageSize = 10
// export const pageSize = 5

export interface CoreExtSlice {
  roiImg: {
    url: string | undefined
    width: number
    height: number
  }
  fetchROIImgLoading: boolean
  fetchLoading: boolean
  fetchModelRes: FetchModelRes
  searchModelRes: FetchModelRes
  setFetchLoading: (loading: boolean) => void
  setFetchROIImgLoading: (loading: boolean) => void
  modelListFetcher?: ModelListFetcher
  roiImgFetcher?: ROIImgFetcher
  setModelListFetcher: (fetcher: ModelListFetcher | undefined) => void
  setROIImgFetcher: (fetcher: ROIImgFetcher | undefined) => void
  resetModuleProps: () => void
  setFetchModelRes: (res: FetchModelRes) => void
  fetchModelsWithLabels: (
    pageOffset: number,
    queryModelName?: string,
    queryModelType?: string
  ) => void
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
  fetchROIImgLoading: false,
  fetchModelRes: {
    models: [],
    totalCnt: 0
  },
  searchModelRes: {
    models: [],
    totalCnt: 0
  },
  modelListFetcher: undefined,
  roiImgFetcher: undefined,
  setFetchLoading: (loading: boolean) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.fetchLoading = loading
      })
    )
  },
  setFetchROIImgLoading: (loading: boolean) => {
    set(
      produce((draft: MyState) => {
        const draft1 = draft
        draft1.fetchROIImgLoading = loading
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
  fetchModelsWithLabels: async (
    pageOffset: number,
    queryModelName?: string,
    queryModelType?: string
  ) => {
    // 1-based; start from 1
    if (pageOffset <= 0) {
      return
    }
    const { modelListFetcher } = get()
    if (modelListFetcher) {
      if (queryModelName === undefined) {
        // fetch result
        const modRes = await modelListFetcher(
          pageOffset,
          pageSize,
          undefined,
          queryModelType
        )
        set(
          produce((draft: MyState) => {
            draft.fetchModelRes = modRes as FetchModelRes
            draft.fetchLoading = false
          })
        )
      } else {
        // search result
        const modRes = await modelListFetcher(
          pageOffset,
          pageSize,
          queryModelName,
          queryModelType
        )
        set(
          produce((draft: MyState) => {
            draft.searchModelRes = modRes as FetchModelRes
            draft.fetchLoading = false
          })
        )
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
            draft1.fetchROIImgLoading = false
          })
        )
      }
    } else if (roiImgFetcher === undefined) {
      set(
        produce((draft: MyState) => {
          const draft1 = draft
          draft1.fetchROIImgLoading = false
        })
      )
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
