// model list
export type ModelListFetcher = (
  page: number,
  pageSize: number
) => Promise<FetchModelRes>

export interface FetchModelRes {
  models: ModelRes[]
  totalCnt: number
}

export interface ModelRes {
  mod_id: string
  mod_iter_id: string
  mod_name: string
  mod_created_at: Date
  mod_version: string
  mod_version_id: string
  mod_result_id: string
}

// labels
export type LabelListFetcher = (modResultId: string) => Promise<FetchLabelRes>

export interface FetchLabelRes {
  labels: string[]
}
