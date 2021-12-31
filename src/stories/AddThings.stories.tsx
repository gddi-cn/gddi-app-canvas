import React from 'react'
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
import { pipeline1 } from './data/pipelines'
import { modDef1 } from './data/moduleDefinitions'

import './AddThings.scss'

const myPipeline: Pipeline = {
  version: '0.0.1',
  nodes: pipeline1.nodes.map((node) => node as Module),
  pipe: pipeline1.pipe.map((p) => p as Connection)
}

export default {
  title: 'Example/AppCanvas',
  component: AppCanvas
} as Meta

let canvasIns: AIAppType | null
// Create a master template for mapping args to render the component
const handleCanvasLoad = (canvas: AIAppType): void => {
  canvasIns = canvas
  canvas.layoutGraph()
}
const handleValueChange = (val: Pipeline): void => {
  console.log(`value changed!`)
  console.log(val)
}
const handleAddDemuxer = (): void => {
  if (canvasIns) {
    canvasIns.addModule({
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
  if (canvasIns) {
    canvasIns.addModule({
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
  if (canvasIns) {
    canvasIns.addPipeline(myPipeline.nodes as any, myPipeline.pipe as any)
  }
}

const Template: Story<AppCanvasProps> = (args) => (
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
    {/* <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
      <Tab label="App Canvas" />
      <Tab label="Value" />
    </Tabs>
    <TabPanel value={value} index={0}>
      Item One
    </TabPanel>
    <TabPanel value={value} index={1}>
      Item Two
    </TabPanel> */}

    <div
      className="row app-canvas-wrapper"
      style={{ width: '1000px', height: '400px' }}
    >
      <AppCanvas {...args} />
    </div>
  </div>
)

export const AddModules = Template.bind({})
AddModules.args = {
  moduleDefinitions: modDef1,
  onLoad: handleCanvasLoad,
  onValueChange: handleValueChange
} as AppCanvasProps
