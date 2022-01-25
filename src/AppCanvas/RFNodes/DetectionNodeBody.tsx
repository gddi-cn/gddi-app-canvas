// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropObject, ModelRes } from '../types'
import { useStore } from '../store/useStore'
import { NodeDropDown } from './NodeDropDown'
import { NodeDetail } from './NodeDetail'
// import { NodeRunner } from './NodeRunner'
import { EditableText, MyDialog } from '../Components'
import { ModelSelectContent } from './../AsyncContents'
import './DetectionNodeBody.scss'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

interface DetectionNodeBodyProps {
  nodeData: Module
}

export const DetectionNodeBody = ({
  nodeData
}: DetectionNodeBodyProps): JSX.Element => {
  const [modelSelectDialogOpen, setModelSelectDialogOpen] =
    useState<boolean>(false)
  const {
    modDef,
    modifyModuleName,
    modifyModuleProp,
    removeModule,
    propEditingDisabled,
    fetchModelsWithLabels,
    setFetchLoading
  } = useStore(
    (state) => ({
      modDef: state.moduleDefinitions[nodeData.type],
      modifyModuleName: state.modifyModuleName,
      modifyModuleProp: state.modifyModuleProp,
      removeModule: state.removeModule,
      propEditingDisabled: state.propEditingDisabled,
      fetchModelsWithLabels: state.fetchModelsWithLabels,
      setFetchLoading: state.setFetchLoading
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
  const handleSelectModClick = useCallback(() => {
    setModelSelectDialogOpen(true)
    console.log(`🐸 select model clicked`)
  }, [setModelSelectDialogOpen])
  const handleModSelectClose = useCallback(() => {
    setModelSelectDialogOpen(false)
  }, [])

  const handleModelSelect = useCallback(
    (model: ModelRes) => {
      modifyModuleProp(nodeData.id, 'mod_result_id', model.mod_result_id)
      modifyModuleProp(nodeData.id, 'mod_name', model.mod_name)
      modifyModuleProp(nodeData.id, 'mod_version', model.mod_version)
      modifyModuleProp(
        nodeData.id,
        'mod_created_at',
        model.mod_created_at.toString()
      )
    },
    [nodeData.id]
  )
  const handleCheckedLabelsChange = useCallback(
    (checkedLabels: string[]) => {
      modifyModuleProp(nodeData.id, 'filter_labels', checkedLabels)
    },
    [nodeData.id]
  )

  const propObj = nodeData.props as PropObject

  const renderModSelect = useCallback(() => {
    // const propObj = nodeData.props as PropObject
    return (
      <ModelSelectContent
        checkedLabels={propObj['filter_labels'] as string[]}
        selectedModId={propObj['mod_result_id'] as string}
        onSelect={handleModelSelect}
        onCheckedLabelsChange={handleCheckedLabelsChange}
      />
    )
  }, [handleModelSelect, propObj['mod_result_id'], propObj['filter_labels']])

  const ModelSelector: JSX.Element = useMemo(() => {
    const modName =
      nodeData.props === undefined ? undefined : nodeData.props['mod_name']
    if (modName === undefined) {
      return (
        <Box>
          <Box>未指定具体模型</Box>
          <Box>
            <Button variant="contained" onClick={handleSelectModClick}>
              Select Model
            </Button>
          </Box>
        </Box>
      )
    }
    return (
      <Box className="model-specify">
        <Box className="model-info">
          <Box className="model-info-row modelname">{propObj['mod_name']}</Box>
          <Box className="model-info-row">{`v${propObj['mod_version']}`}</Box>
          {/* <Box className="model-info-row">{`created at: ${propObj['mod_created_at']}`}</Box> */}
        </Box>
        <Box className="model-select-button">
          <Button
            sx={{ width: '10rem' }}
            variant="contained"
            size="small"
            onClick={handleSelectModClick}
          >
            Change
          </Button>
        </Box>
      </Box>
    )
  }, [nodeData.props])

  useEffect(() => {
    setFetchLoading(true)
    fetchModelsWithLabels(0)
  }, [fetchModelsWithLabels])

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
        <Box component="span">{nodeData.type}</Box>
        {modDef === undefined ? (
          <Box className="error-undefined" component="span">
            module type undefined
          </Box>
        ) : (
          <Box className="module-version" component="span">
            {modDef.version}
          </Box>
        )}
        {ModelSelector}
      </Box>
      {/* <Box className="gddi-aiappcanvas__section module-runner">
        <NodeRunner
          runner={nodeData1.runner}
          disabled={propEditingDisabled}
          onChange={handleRunnerChange}
        />
      </Box> */}
      <MyDialog
        open={modelSelectDialogOpen}
        title="选择模型和模型的具体标签"
        okTitle="OK"
        onClose={handleModSelectClose}
        renderContent={renderModSelect}
      />
    </Box>
  )
}
