import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import {
  AIAppType,
  AppCanvas,
  AppCanvasProps,
  Pipeline,
  Module,
  Connection
} from '../AppCanvas'
import modDef from './datav2/md_v2.json'
import pipeline from './datav2/pipeline_v2.json'

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
  console.log(`value changed!`)
  console.log(val)
}

const Template: Story<AppCanvasProps> = (args) => (
  <div
    className="app-canvas-wrapper"
    style={{ width: '1000px', height: '500px' }}
  >
    <AppCanvas {...args} />
  </div>
)

// Reuse that template for creating different stories
export const BasicUsage = Template.bind({})
BasicUsage.args = {
  dark: false,
  hideDarkModeButton: false,
  defaultValue: myPipeline,
  moduleDefinitions: modDef,
  onLoad: handleCanvasLoad,
  onValueChange: handleValueChange
} as AppCanvasProps

BasicUsage.storyName = 'Usage: Basic'
