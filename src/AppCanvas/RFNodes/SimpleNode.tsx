// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useMemo } from 'react'
import shallow from 'zustand/shallow'
import { Module } from '../types'
import './SimpleNode.scss'
import { useStore } from '../store/useStore'
import { SimpleNodeHandles } from './SimpleNodeHandles'
import { NodeDropDown } from './NodeDropDown'
import { NodeDetail } from './NodeDetail'
// import { NodeRunner } from './NodeRunner'
import { EditableText } from '../Components'

export interface SimpleNodeProps {
  data: {
    id: number
  }
}

const SimpleNode0 = ({ data }: SimpleNodeProps): JSX.Element => {
  const { id } = data
  const {
    nodeData,
    modifyModuleName,
    modifyModuleProp,
    modifyModuleRunner,
    removeModule,
    propEditingDisabled
  } = useStore(
    (state) => ({
      nodeData: state.value.nodes.find((n) => n.id === id),
      modifyModuleName: state.modifyModuleName,
      modifyModuleProp: state.modifyModuleProp,
      modifyModuleRunner: state.modifyModuleRunner,
      removeModule: state.removeModule,
      propEditingDisabled: state.propEditingDisabled
    }),
    shallow
  )
  const handleNodePropChange = useCallback(
    (propName, propVal) => {
      modifyModuleProp(id, propName, propVal)
    },
    [modifyModuleProp, id]
  )
  const handleNodeNameChange = useCallback(
    (newName) => {
      modifyModuleName(id, newName)
    },
    [modifyModuleName, id]
  )
  const handleRunnerChange = useCallback(
    (runner) => {
      modifyModuleRunner(id, runner)
    },
    [modifyModuleRunner, id]
  )
  const handleModDelete = useCallback(() => {
    removeModule(id)
  }, [id, removeModule])

  const NodeBodyEle = useMemo(() => {
    if (nodeData === undefined) {
      return null
    }
    const nodeData1 = nodeData as Module
    return (
      <div className="gddi-aiappcanvas__simplenode">
        <div className="gddi-aiappcanvas__section gddi-aiappcanvas__header">
          <div className="gddi-aiappcanvas__simplenode-header-left">
            <EditableText
              value={nodeData1.name}
              disabled={propEditingDisabled}
              onChange={handleNodeNameChange}
            />
          </div>
          <div className="gddi-aiappcanvas__simplenode-header-right">
            <NodeDropDown onDeleteClick={handleModDelete} />
          </div>
        </div>
        <div className="gddi-aiappcanvas__section module-type-display">
          <span className="module-type-type">Module Type</span>
          <span>{nodeData1.type}</span>
        </div>
        {/* <div className="gddi-aiappcanvas__section module-runner">
          <NodeRunner
            runner={nodeData1.runner}
            disabled={propEditingDisabled}
            onChange={handleRunnerChange}
          />
        </div> */}
        {nodeData1.props ? (
          <div>
            <NodeDetail
              readonly={propEditingDisabled}
              nodeData={nodeData1}
              onPropChange={handleNodePropChange}
            />
          </div>
        ) : null}
      </div>
    )
  }, [
    name,
    nodeData,
    handleNodePropChange,
    handleNodeNameChange,
    handleModDelete,
    handleRunnerChange,
    propEditingDisabled
  ])

  return (
    <>
      {nodeData && (
        <div className="gddi-aiappcanvas__simplenode-wrapper">
          <SimpleNodeHandles
            handleIdPrefix={`chris-pipenode-${id.toString()}`}
            nodeType={(nodeData as Module).type}
            isInput
          />
          {NodeBodyEle}
          <SimpleNodeHandles
            handleIdPrefix={`chris-pipenode-${id.toString()}`}
            nodeType={(nodeData as Module).type}
            isInput={false}
          />
        </div>
      )}
    </>
  )
}

export const SimpleNode = React.memo(SimpleNode0)
