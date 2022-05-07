// model list
export type ModelListFetcher = (
  pageOffset: number,
  pageSize: number,
  // if queryModelName !== undefined: seach by model name
  queryModelName?: string,
  queryModelType?: string
) => Promise<FetchModelRes>

export interface FetchModelRes {
  models: ModelRes[]
  totalCnt: number
}

export interface ModelRes {
  mod_id: string
  mod_iter_id: string
  mod_license: string
  mod_name: string
  mod_created_at: Date
  mod_version: string
  mod_version_id: string
  mod_result_id: string
  accelerate: string
  labels: string[]
  best_threshold: number
}

// // labels
// export type LabelListFetcher = (modResultId: string) => Promise<FetchLabelRes>

// export interface FetchLabelRes {
//   labels: string[]
// }

// export interface FetchLabelMemo {
//   [modResultId: string]: string[]
// }

// ROI image
export type ROIImgFetcher = (
  width: number,
  height: number
) => Promise<FetchROIImgRes>

export interface FetchROIImgRes {
  url: string
}
