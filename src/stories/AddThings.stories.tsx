import React, { useCallback, useRef, useState } from 'react'
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
  Connection
} from '../AppCanvas'
import { TabPanel } from './components'
import { pipeline1 } from './data/pipelines'
import { modDef1 } from './data/moduleDefinitions'

import './AddThings.scss'

const myPipeline: Pipeline = {
  version: '0.0.1',
  nodes: pipeline1.nodes.map((node) => node as Module),
  pipe: pipeline1.pipe.map((p) => p as Connection)
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
    canvasRef.current.layoutGraph()
  }
  const handleValueChange = (val: Pipeline): void => {
    console.log(`value changed!`)
    setAppVal(val)
    console.log(val)
  }
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
          <AppCanvas
            {...args}
            onLoad={handleCanvasLoad}
            onValueChange={handleValueChange}
          />
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
  moduleDefinitions: modDef1
} as AppCanvasProps

AddModules.storyName = 'Usage: Add Modules'
