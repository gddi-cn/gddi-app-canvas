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
import { pipeline1 } from './data/pipelines'
import { modDef1 } from './data/moduleDefinitions'

const myPipeline: Pipeline = {
  version: '0.0.1',
  nodes: pipeline1.nodes.map((node) => node as Module),
  pipe: pipeline1.pipe.map((p) => p as Connection)
}

export default {
  title: 'AppCanvas',
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
export const Primary = Template.bind({})
Primary.args = {
  defaultValue: myPipeline,
  moduleDefinitions: modDef1,
  onLoad: handleCanvasLoad,
  onValueChange: handleValueChange
} as AppCanvasProps

export const PropEditingMode = Template.bind({})
PropEditingMode.args = {
  ...Primary.args,
  graphEditingDisabled: true
} as AppCanvasProps
