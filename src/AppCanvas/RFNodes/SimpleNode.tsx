// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useMemo } from 'react'
import shallow from 'zustand/shallow'
import { Module } from '../types'
import { useStore } from '../store/useStore'
import { SimpleNodeHandles } from './SimpleNodeHandles'
import { NodeDropDown } from './NodeDropDown'
import { NodeDetail } from './NodeDetail'
// import { NodeRunner } from './NodeRunner'
import { DetectionNodeBody } from './DetectionNodeBody'
import { ROINodeBody } from './ROINodeBody'
import { guessQueryModelType, isModelNode } from './nodeHelperFunc'
import { QueryModelContext } from './NodeContext'
import { HtmlTooltip } from './../Components'
import { ModuleNameEdit } from './ModuleNameEdit'
import './SimpleNode.scss'

import Box from '@mui/material/Box'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

interface ModuleHeaderElementProps {
  nodeData: Module
}

export const ModuleHeaderElement = ({
  nodeData
}: ModuleHeaderElementProps): JSX.Element => {
  const { removeModule, moduleDescription } = useStore(
    (state) => ({
      removeModule: state.removeModule,
      moduleDescription: state.moduleDefinitions[nodeData.type].description
    }),
    shallow
  )

  const handleModDelete = useCallback(() => {
    removeModule(nodeData.id)
  }, [nodeData.id, removeModule])

  return (
    <>
      <Box className="gddi-aiappcanvas__simplenode-header-left">
        <label className="header-text">{nodeData.type}</label>
        {moduleDescription && (
          <HtmlTooltip title={moduleDescription}>
            <HelpOutlineIcon
              className="description-question-icon"
              sx={{ marginLeft: '0.2rem' }}
            />
          </HtmlTooltip>
        )}
      </Box>
      <Box className="gddi-aiappcanvas__simplenode-header-right">
        <NodeDropDown onDeleteClick={handleModDelete} />
      </Box>
    </>
  )
}

interface SimpleNodeBodyProps {
  nodeData: Module
}

const SimpleNodeBody = ({ nodeData }: SimpleNodeBodyProps): JSX.Element => {
  const { modifyModuleName, modifyModuleProp, propEditingDisabled } = useStore(
    (state) => ({
      modifyModuleName: state.modifyModuleName,
      modifyModuleProp: state.modifyModuleProp,
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

  return (
    <Box
      sx={{ bgcolor: 'background.default', color: 'text.primary' }}
      className="gddi-aiappcanvas__simplenode"
    >
      <Box className="gddi-aiappcanvas__section gddi-aiappcanvas__header">
        <ModuleHeaderElement nodeData={nodeData} />
      </Box>
      <Box className="gddi-aiappcanvas__section module-type-display">
        <ModuleNameEdit
          readonly={propEditingDisabled}
          name={nodeData.name}
          onChange={handleNodeNameChange}
        />
      </Box>
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
    if (isModelNode(nodeData)) {
      return (
        <QueryModelContext.Provider
          value={{ queryModelType: guessQueryModelType(nodeData) }}
        >
          <DetectionNodeBody
            nodeData={nodeData as Module}
            renderModuleHeaderContent={(nodeData) => (
              <ModuleHeaderElement nodeData={nodeData} />
            )}
          />
        </QueryModelContext.Provider>
      )
    }
    if (nodeData.type.toLocaleLowerCase().includes('roi')) {
      return (
        <ROINodeBody
          nodeData={nodeData as Module}
          renderModuleHeaderContent={(nodeData) => (
            <ModuleHeaderElement nodeData={nodeData} />
          )}
        />
      )
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
