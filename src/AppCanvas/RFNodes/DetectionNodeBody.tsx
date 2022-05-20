// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropObject, ModLabelsValueType } from '../types'
import { useStore } from '../store/useStore'
// import { NodeRunner } from './NodeRunner'
import { ModelConfigDialog } from './ModelConfigDialog'
import { NodeDetail } from './NodeDetail'
import './DetectionNodeBody.scss'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'

interface DetectionNodeBodyProps {
  nodeData: Module
  renderModuleHeaderContent: (nodeData: Module) => JSX.Element
}

export const DetectionNodeBody = ({
  nodeData,
  renderModuleHeaderContent
}: DetectionNodeBodyProps): JSX.Element => {
  const [modelSelectDialogOpen, setModelSelectDialogOpen] =
    useState<boolean>(false)
  const { modifyModuleProp, propEditingDisabled } = useStore(
    (state) => ({
      modifyModuleProp: state.modifyModuleProp,
      propEditingDisabled: state.propEditingDisabled
    }),
    shallow
  )
  // const handleRunnerChange = useCallback(
  //   (runner) => {
  //     modifyModuleRunner(nodeData.id, runner)
  //   },
  //   [modifyModuleRunner, nodeData.id]
  // )

  const handleSelectModClick = useCallback(() => {
    setModelSelectDialogOpen(true)
  }, [setModelSelectDialogOpen])

  const handleModSelectClose = useCallback(() => {
    setModelSelectDialogOpen(false)
  }, [])

  const handleModConfigChange = useCallback(
    (newProp: PropObject) => {
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
    },
    [modifyModuleProp, nodeData.id]
  )

  const handleNodePropChange = useCallback(
    (propName, propVal) => {
      modifyModuleProp(nodeData.id, propName, propVal)
    },
    [modifyModuleProp, nodeData.id]
  )

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
    [propObj]
  )

  return (
    <Box
      sx={{ bgcolor: 'background.default', color: 'text.primary' }}
      className="gddi-aiappcanvas__simplenode"
    >
      <Box className="gddi-aiappcanvas__section gddi-aiappcanvas__header">
        {renderModuleHeaderContent(nodeData)}
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
            {`选择标签数量：${numLabelsChecked}`}
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
      {Object.keys(propObj).length > 1 ? (
        <Box>
          <NodeDetail
            hidePropsWithName={[
              'mod_iter_id',
              'mod_labels',
              'mod_id',
              'mod_name',
              'mod_created_at',
              'mod_version',
              'mod_version_id',
              'mod_license',
              'mod_result_id'
            ]}
            readonly={propEditingDisabled}
            nodeData={nodeData}
            onPropChange={handleNodePropChange}
          />
        </Box>
      ) : null}
    </Box>
  )
}
