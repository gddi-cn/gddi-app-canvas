import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
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
import { TabPanel } from './components'
import modDef from './datav2/md_v2.json'
import pipeline from './datav2/pipeline_v2.json'
import { fetchModelResult, modelLabels } from './datav2/fetchExample'

import './AddThings.scss'

const myPipeline: Pipeline = {
  version: '0.0.0',
  nodes: pipeline.nodes.map((node) => node as Module),
  pipe: pipeline.pipe.map((p) => p as Connection)
}

const desString =
  `AppCanvas is a react component to visualize GDDi's AI APPs in flow chart fashion.` +
  '\nUsage:' +
  `\n1. Add Module (node)` +
  `\n2. Add Template (pipeline)` +
  `\n3. Get Current Pipeline Value`

export default {
  title: 'Example/AppCanvas',
  component: AppCanvas,
  parameters: {
    docs: {
      source: {
        type: 'code'
      },
      description: {
        component: desString
      }
    }
  }
} as Meta

const Template: Story<AppCanvasProps> = (args) => {
  const canvasRef = useRef<AIAppType | null>(null)
  const [tabVal, setTabVal] = useState<number>(0)
  const [appVal, setAppVal] = useState<Pipeline>({
    version: '0.0.1',
    nodes: [],
    pipe: []
  })

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabVal(newValue)
    },
    []
  )
  const handleCanvasLoad = (canvas: AIAppType): void => {
    canvasRef.current = canvas
    // canvasRef.current.layoutGraph()
  }
  const handleValueChange = useCallback((val: Pipeline): void => {
    console.log(`value changed!`)
    setAppVal(val)
    // console.log(val)
  }, [])
  const handleAddDemuxer = (): void => {
    if (canvasRef.current) {
      canvasRef.current.addModule({
        type: 'Demuxer_v1_1',
        name: 'Demuxer_v1_1',
        runner: 'default',
        props: {
          stream_url:
            'rtsp://admin:gddi1234@192.168.1.233:554/h264/ch1/main/av_stream'
        }
      })
    }
  }
  const handleAddDecoder = (): void => {
    if (canvasRef.current) {
      canvasRef.current.addModule({
        type: 'Decoder_v1_1',
        name: 'Decoder_v1_1',
        runner: 'default',
        props: {
          prefer_hw: 0,
          disable_hw_acc: 0
        }
      })
    }
  }
  const handleAddTemplate = (): void => {
    if (canvasRef.current) {
      canvasRef.current.addPipeline(
        myPipeline.nodes as any,
        myPipeline.pipe as any
      )
    }
  }
  const handleClear = (): void => {
    if (canvasRef.current) {
      canvasRef.current.clear()
    }
  }

  const fetchModelList = useCallback(
    (page: number, pageSize: number): Promise<FetchModelRes> => {
      return new Promise<FetchModelRes>((resolve, reject) => {
        setTimeout(() => {
          const { models, totalCnt } = fetchModelResult
          resolve({
            models: models.slice(pageSize * page, pageSize * (page + 1)),
            totalCnt
          })
        }, 2000)
      })
    },
    [fetchModelResult]
  )

  const fetchLabelList = useCallback(
    (mod_result_id: string): Promise<FetchLabelRes> => {
      const fetchLabelRes: FetchLabelRes = {
        labels:
          modelLabels[mod_result_id] === undefined
            ? []
            : modelLabels[mod_result_id].labels
      }
      return new Promise<FetchLabelRes>((resolve, reject) => {
        setTimeout(() => {
          resolve(fetchLabelRes)
        }, 2000)
      })
    },
    [modelLabels]
  )

  const fetchROIImg = useCallback(
    (width: number, height: number): Promise<FetchROIImgRes> => {
      return new Promise<FetchROIImgRes>((resolve, reject) => {
        setTimeout(() => {
          resolve({ url: `https://place-puppy.com/${width}x${height}` })
        }, 1100)
      })
    },
    []
  )

  const appCanvas = useMemo(() => {
    return (
      <AppCanvas
        {...args}
        onLoad={handleCanvasLoad}
        onValueChange={handleValueChange}
        fetchModelList={fetchModelList}
        fetchLabelList={fetchLabelList}
        fetchROIImg={fetchROIImg}
      />
    )
  }, [
    args,
    appVal,
    handleCanvasLoad,
    handleValueChange,
    fetchModelList,
    fetchLabelList,
    fetchROIImg
  ])

  return (
    <div className="story-wrapper">
      <div className="row">
        <Button size="medium" variant="contained" onClick={handleAddDemuxer}>
          + Demuxer
        </Button>
        <Button size="medium" variant="contained" onClick={handleAddDecoder}>
          + Decoder
        </Button>
      </div>
      <div className="row">
        <Button size="medium" variant="contained" onClick={handleAddTemplate}>
          + Chris' App Template
        </Button>
      </div>
      <div className="row">
        <Button size="medium" onClick={handleClear}>
          Clear
        </Button>
      </div>
      <Tabs
        value={tabVal}
        onChange={handleTabChange}
        aria-label="pipeline-vs-tab"
      >
        <Tab label="Visualization" />
        <Tab label="Value" />
      </Tabs>
      <TabPanel value={tabVal} index={0}>
        <div
          className="row app-canvas-wrapper"
          style={{ width: '1000px', height: '400px' }}
        >
          {appCanvas}
        </div>
      </TabPanel>
      <TabPanel value={tabVal} index={1}>
        <div
          className="row app-canvas-wrapper"
          style={{ width: '1000px', height: '400px' }}
        >
          {JSON.stringify(appVal, null, '\t')}
        </div>
      </TabPanel>
    </div>
  )
}

export const AddModules = Template.bind({})
AddModules.args = {
  dark: false,
  hideDarkModeButton: false,
  moduleDefinitions: modDef
} as AppCanvasProps

AddModules.storyName = 'Usage: Add Modules'
