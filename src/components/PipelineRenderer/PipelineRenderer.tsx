import React from 'react'
import ReactFlow, { FlowElement } from 'react-flow-renderer'

export interface PipelineRendererProps {
  elements: FlowElement[]
}

export const PipelineRenderer = ({
  elements
}: PipelineRendererProps): JSX.Element => {
  return <ReactFlow elements={elements} />
}
