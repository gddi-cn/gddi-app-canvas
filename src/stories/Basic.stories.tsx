import React, { useState, useCallback, useMemo } from 'react'
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
  FetchROIImgRes,
  ModuleDefinitions
} from '../AppCanvas'
import { TabPanel } from './components'
import modDef from './datav2/md3.json'
import pipeline from './datav2/pipeline5.json'
// import pipeline from './datav2/pipelineTest4.json'
import { fetchModelResult, modelLabels } from './datav2/fetchExample2'
import Editor from '@monaco-editor/react'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

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
          models: models.slice(pageSize * (page - 1), pageSize * page),
          totalCnt
        })
      } else {
        // search by model name
        const searchRes = models.filter((mod) =>
          mod.mod_name.includes(queryModelName)
        )
        resolve({
          models: searchRes.slice(pageSize * (page - 1), pageSize * page),
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

const Template: Story<AppCanvasProps> = (args) => {
  const [tabVal, setTabVal] = useState<number>(0)
  const [pipelineVal, setPipelineVal] = useState<Pipeline>(myPipeline)
  const [pipelineVal0, setPipelineVal0] = useState<Pipeline>(myPipeline)
  const [modDef0, setModDef0] = useState<ModuleDefinitions>(modDef)

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabVal(newValue)
    },
    []
  )

  const handlePipelineEditorChange = useCallback(
    (newVal, event) => {
      console.log(`[Pipeline Editor onChange]`)
      try {
        const parsedVal = JSON.parse(newVal)
        setPipelineVal0(parsedVal)
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    [setPipelineVal0]
  )

  const handlePipelineEditorValidation = useCallback((markers) => {
    // model markers
    console.log(`[Pipeline Editor onValidation]`)
    markers.forEach((marker) => console.log('onValidate:', marker.message))
  }, [])

  const handleValueChange = useCallback(
    (val: Pipeline): void => {
      console.log(`🦍  value changed!`)
      console.log(val)
      setPipelineVal(val)
    },
    [setPipelineVal]
  )

  const pipelineValStr = useMemo(
    () => JSON.stringify(pipelineVal, null, '\t'),
    [pipelineVal]
  )
  const modDefStr = useMemo(
    () => JSON.stringify(modDef0, null, '\t'),
    [modDef0]
  )

  return (
    <>
      <Tabs
        value={tabVal}
        onChange={handleTabChange}
        aria-label="pipeline-vs-tab"
      >
        <Tab label="Visualization" />
        <Tab label="Pipeline Value" />
        <Tab label="Model Definitions Config" />
      </Tabs>
      <TabPanel value={tabVal} index={0}>
        <div
          className="app-canvas-wrapper"
          style={{ width: '1000px', height: '500px' }}
        >
          <AppCanvas {...args} onValueChange={handleValueChange} />
        </div>
      </TabPanel>
      <TabPanel value={tabVal} index={1}>
        <div
          className="row app-canvas-wrapper"
          style={{ width: '1000px', height: '500px' }}
        >
          <Editor
            height="100%"
            defaultLanguage="json"
            defaultValue={pipelineValStr}
            onChange={handlePipelineEditorChange}
            onValidate={handlePipelineEditorValidation}
          />
        </div>
      </TabPanel>
      <TabPanel value={tabVal} index={2}>
        <div
          className="row app-canvas-wrapper"
          style={{ width: '1000px', height: '500px' }}
        >
          <Editor
            height="100%"
            defaultLanguage="json"
            defaultValue={modDefStr}
          />
        </div>
      </TabPanel>
    </>
  )
}

// Reuse that template for creating different stories
export const BasicUsage = Template.bind({})
BasicUsage.args = {
  dark: false,
  hideDarkModeButton: false,
  defaultValue: myPipeline,
  moduleDefinitions: modDef,
  graphEditingDisabled: true,
  onLoad: handleCanvasLoad,
  fetchModelList: fetchModelList,
  fetchLabelList: fetchLabelList,
  fetchROIImg: fetchROIImg
} as AppCanvasProps

BasicUsage.storyName = 'Usage: Basic'
