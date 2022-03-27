import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import {
  AIAppType,
  AppCanvas,
  AppCanvasProps,
  Pipeline,
  Module,
  Connection,
  FetchLabelRes,
  FetchModelRes,
  FetchROIImgRes
} from '../AppCanvas'
import modDef from './datav2/md3.json'
// import pipeline from './datav2/pipeline4.json'
import pipeline from './datav2/pipelineTest4.json'
import { fetchModelResult, modelLabels } from './datav2/fetchExample'

const myPipeline: Pipeline = {
  version: '0.0.1',
  nodes: pipeline.nodes.map((node) => node as Module),
  pipe: pipeline.pipe.map((p) => p as Connection)
}

export default {
  title: 'Example/AppCanvas',
  component: AppCanvas
} as Meta

// Create a master template for mapping args to render the component
const handleCanvasLoad = (canvas: AIAppType): void => {
  canvas.layoutGraph()
}
const handleValueChange = (val: Pipeline): void => {
  console.log(`🦍  value changed!`)
  console.log(val)
}
const fetchModelList = (
  page: number,
  pageSize: number,
  queryModelName?: string
): Promise<FetchModelRes> => {
  return new Promise<FetchModelRes>((resolve, reject) => {
    setTimeout(() => {
      const { models, totalCnt } = fetchModelResult
      if (queryModelName === undefined || queryModelName === '') {
        resolve({
          models: models.slice(pageSize * page, pageSize * (page + 1)),
          totalCnt
        })
      } else {
        // search by model name
        const searchRes = models.filter((mod) =>
          mod.mod_name.includes(queryModelName)
        )
        resolve({
          models: searchRes.slice(pageSize * page, pageSize * (page + 1)),
          totalCnt: searchRes.length
        })
      }
    }, 2000)
  })
}

const fetchLabelList = (mod_result_id: string): Promise<FetchLabelRes> => {
  const fetchLabelRes: FetchLabelRes = {
    labels:
      modelLabels[mod_result_id] === undefined
        ? []
        : modelLabels[mod_result_id].labels
  }
  return new Promise<FetchLabelRes>((resolve, reject) => {
    setTimeout(() => {
      resolve(fetchLabelRes)
    }, 200)
  })
}

const fetchROIImg = (
  width: number,
  height: number
): Promise<FetchROIImgRes> => {
  return new Promise<FetchROIImgRes>((resolve, reject) => {
    setTimeout(() => {
      resolve({ url: `https://place-puppy.com/${width}x${height}` })
    }, 1100)
  })
}

const Template: Story<AppCanvasProps> = (args) => (
  <>
    <div
      className="app-canvas-wrapper"
      style={{ width: '1000px', height: '500px' }}
    >
      <AppCanvas {...args} />
    </div>
  </>
)

// Reuse that template for creating different stories
export const BasicUsage = Template.bind({})
BasicUsage.args = {
  dark: false,
  hideDarkModeButton: false,
  defaultValue: myPipeline,
  moduleDefinitions: modDef,
  onLoad: handleCanvasLoad,
  onValueChange: handleValueChange,
  fetchModelList: fetchModelList,
  fetchLabelList: fetchLabelList,
  fetchROIImg: fetchROIImg
} as AppCanvasProps

BasicUsage.storyName = 'Usage: Basic'
