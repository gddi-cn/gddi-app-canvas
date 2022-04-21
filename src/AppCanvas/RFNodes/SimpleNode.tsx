// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useMemo, createContext } from 'react'
import shallow from 'zustand/shallow'
import { Module } from '../types'
import { useStore } from '../store/useStore'
import { SimpleNodeHandles } from './SimpleNodeHandles'
import { NodeDropDown } from './NodeDropDown'
import { NodeDetail } from './NodeDetail'
// import { NodeRunner } from './NodeRunner'
import { EditableText } from '../Components'
import { DetectionNodeBody } from './DetectionNodeBody'
import { ROINodeBody } from './ROINodeBody'
import { guessQueryModelType, isModelNode } from './nodeHelperFunc'
import { QueryModelContext } from './NodeContext'
import './SimpleNode.scss'

import Box from '@mui/material/Box'

interface SimpleNodeBodyProps {
  nodeData: Module
}

const SimpleNodeBody = ({ nodeData }: SimpleNodeBodyProps): JSX.Element => {
  const {
    modifyModuleName,
    modifyModuleProp,
    removeModule,
    propEditingDisabled
  } = useStore(
    (state) => ({
      modifyModuleName: state.modifyModuleName,
      modifyModuleProp: state.modifyModuleProp,
      removeModule: state.removeModule,
      propEditingDisabled: state.propEditingDisabled
    }),
    shallow
  )

  const handleNodePropChange = useCallback(
    (propName, propVal) => {
      modifyModuleProp(nodeData.id, propName, propVal)
    },
    [modifyModuleProp, nodeData.id]
  )
  const handleNodeNameChange = useCallback(
    (newName) => {
      modifyModuleName(nodeData.id, newName)
    },
    [modifyModuleName, nodeData.id]
  )
  // const handleRunnerChange = useCallback(
  //   (runner) => {
  //     modifyModuleRunner(nodeData.id, runner)
  //   },
  //   [modifyModuleRunner, nodeData.id]
  // )
  const handleModDelete = useCallback(() => {
    removeModule(nodeData.id)
  }, [nodeData.id, removeModule])

  return (
    <Box
      sx={{ bgcolor: 'background.default', color: 'text.primary' }}
      className="gddi-aiappcanvas__simplenode"
    >
      <Box className="gddi-aiappcanvas__section gddi-aiappcanvas__header">
        <Box className="gddi-aiappcanvas__simplenode-header-left">
          <EditableText
            value={nodeData.name}
            disabled={propEditingDisabled}
            onChange={handleNodeNameChange}
          />
        </Box>
        <Box className="gddi-aiappcanvas__simplenode-header-right">
          <NodeDropDown onDeleteClick={handleModDelete} />
        </Box>
      </Box>
      <Box className="gddi-aiappcanvas__section module-type-display">
        <Box className="module-type-type" component="span">
          Module Type
        </Box>
        <Box component="span">{nodeData.type}</Box>
      </Box>
      {/* <Box className="gddi-aiappcanvas__section module-runner">
        <NodeRunner
          runner={nodeData1.runner}
          disabled={propEditingDisabled}
          onChange={handleRunnerChange}
        />
      </Box> */}
      {nodeData.props ? (
        <Box>
          <NodeDetail
            readonly={propEditingDisabled}
            nodeData={nodeData}
            onPropChange={handleNodePropChange}
          />
        </Box>
      ) : null}
    </Box>
  )
}

export interface SimpleNodeProps {
  data: {
    id: number
  }
}

const SimpleNode0 = ({ data }: SimpleNodeProps): JSX.Element => {
  const { id } = data
  const { nodeData } = useStore(
    (state) => ({
      nodeData: state.value.nodes.find((n) => n.id === id)
    }),
    shallow
  )

  const NodeBodyEle = useMemo(() => {
    if (nodeData === undefined) {
      return null
    }
    // if (nodeData.type.toLocaleLowerCase().includes('detection')) {
    if (isModelNode(nodeData)) {
      return (
        <QueryModelContext.Provider
          value={{ queryModelType: guessQueryModelType(nodeData) }}
        >
          <DetectionNodeBody nodeData={nodeData as Module} />
        </QueryModelContext.Provider>
      )
      // return (
      //   <DetectionNodeBody
      //     nodeData={nodeData as Module}
      //     queryModelType={guessQueryModelType(nodeData)}
      //   />
      // )
    }
    if (nodeData.type.toLocaleLowerCase().includes('roi')) {
      return <ROINodeBody nodeData={nodeData as Module} />
    }
    return <SimpleNodeBody nodeData={nodeData as Module} />
  }, [nodeData])

  return (
    <>
      {nodeData && (
        <Box className="gddi-aiappcanvas__simplenode-wrapper">
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
        </Box>
      )}
    </>
  )
}

export const SimpleNode = React.memo(SimpleNode0)
