// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropObject, ModelRes } from '../types'
import { useStore } from '../store/useStore'
import { NodeDropDown } from './NodeDropDown'
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
    setFetchLoading,
    modelListFetcher,
    labelListFetcher
  } = useStore(
    (state) => ({
      modDef: state.moduleDefinitions[nodeData.type],
      modifyModuleName: state.modifyModuleName,
      modifyModuleProp: state.modifyModuleProp,
      removeModule: state.removeModule,
      propEditingDisabled: state.propEditingDisabled,
      fetchModelsWithLabels: state.fetchModelsWithLabels,
      setFetchLoading: state.setFetchLoading,
      modelListFetcher: state.modelListFetcher,
      labelListFetcher: state.labelListFetcher
    }),
    shallow
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
  }, [setModelSelectDialogOpen])

  const handleModSelectClose = useCallback(() => {
    setModelSelectDialogOpen(false)
  }, [])

  const handleModelSelect = useCallback(
    (model: ModelRes) => {
      //TODO: setModelRes in global store
      Object.keys(model).forEach((propName) => {
        modifyModuleProp(
          nodeData.id,
          propName,
          (model as Record<string, any>)[propName]
        )
      })
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
  const filterLabels =
    propObj['filter_labels'] === undefined
      ? undefined
      : (propObj['filter_labels'] as string[])

  const renderModSelect = useCallback(() => {
    // const propObj = nodeData.props as PropObject
    return (
      <ModelSelectContent
        disable={propEditingDisabled}
        checkedLabels={propObj['filter_labels'] as string[]}
        selectedModId={propObj['mod_result_id'] as string}
        onSelect={handleModelSelect}
        onCheckedLabelsChange={handleCheckedLabelsChange}
      />
    )
  }, [
    propEditingDisabled,
    handleModelSelect,
    propObj['mod_result_id'],
    propObj['filter_labels']
  ])

  useEffect(() => {
    // console.log('bbbb -  modelListFetcher or labelListFetcher changes')
    setFetchLoading(true)
    fetchModelsWithLabels(0)
  }, [fetchModelsWithLabels, modelListFetcher, labelListFetcher])

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
      <Button
        className="gddi-aiappcanvas__section model-select-button"
        variant="outlined"
        size="large"
        onClick={handleSelectModClick}
      >
        <Box className="model-name" component="span">
          {`${
            propObj['mod_name'] === '' || propObj['mod_name'] === undefined
              ? 'no model selected'
              : propObj['mod_name']
          }`}
        </Box>
        <Box className="filterlabel-display" component="span">
          {`${
            filterLabels === undefined ? 0 : filterLabels.length
          } label(s) selected`}
        </Box>
      </Button>
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
