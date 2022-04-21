// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropObject, ModLabelsValueType } from '../types'
import { useStore } from '../store/useStore'
import { NodeDropDown } from './NodeDropDown'
// import { NodeRunner } from './NodeRunner'
import { EditableText } from '../Components'
import { ModelConfigDialog } from './ModelConfigDialog'
import './DetectionNodeBody.scss'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'

interface DetectionNodeBodyProps {
  nodeData: Module
}

export const DetectionNodeBody = ({
  nodeData
}: DetectionNodeBodyProps): JSX.Element => {
  const [modelSelectDialogOpen, setModelSelectDialogOpen] =
    useState<boolean>(false)
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

  const handleModConfigChange = useCallback((newProp: PropObject) => {
    // console.log(`🍓🍓 propObj changed!`)
    // console.log(newProp)
    //TODO: modify in global store; modify in ONE action
    Object.keys(newProp).forEach((propName) => {
      modifyModuleProp(
        nodeData.id,
        propName,
        (newProp as Record<string, any>)[propName]
      )
    })
    setModelSelectDialogOpen(false)
  }, [])

  const propObj = nodeData.props as PropObject
  const numLabelsChecked = propObj['mod_labels']
    ? Object.values(propObj['mod_labels'] as ModLabelsValueType).filter(
        (label) => label.checked
      ).length
    : 0

  const modelNameDisplay = useMemo(
    () =>
      `${
        propObj['mod_name'] === '' ||
        propObj['mod_name'] === undefined ||
        !propObj['mod_iter_id']
          ? '未选择模型'
          : propObj['mod_name']
      }`,
    [propObj['mod_name']]
  )

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
      <Tooltip title={modelNameDisplay}>
        <Button
          className="gddi-aiappcanvas__section model-select-button"
          variant="outlined"
          size="large"
          onClick={handleSelectModClick}
        >
          <Box className="model-name" component="span">
            {modelNameDisplay}
          </Box>
          <Box className="filterlabel-display" component="span">
            {`${numLabelsChecked} label(s) selected`}
          </Box>
        </Button>
      </Tooltip>
      {/* <Box className="gddi-aiappcanvas__section module-runner">
        <NodeRunner
          runner={nodeData1.runner}
          disabled={propEditingDisabled}
          onChange={handleRunnerChange}
        />
      </Box> */}
      <ModelConfigDialog
        readonly={propEditingDisabled}
        open={modelSelectDialogOpen}
        title="模型和标签配置"
        okTitle="保存修改"
        defaultValue={propObj}
        onClose={handleModSelectClose}
        onOK={handleModConfigChange}
      />
    </Box>
  )
}
