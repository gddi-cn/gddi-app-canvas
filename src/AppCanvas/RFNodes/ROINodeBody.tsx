// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropObject } from '../types'
import { useStore } from '../store/useStore'
import { NodeDropDown } from './NodeDropDown'
// import { NodeRunner } from './NodeRunner'
import { EditableText, MyFullScreenDialog } from '../Components'
import { ROIEditContent } from './../AsyncContents'
import './ROINodeBody.scss'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

interface ROINodeBodyProps {
  nodeData: Module
}

export const ROINodeBody = ({ nodeData }: ROINodeBodyProps): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const {
    modDef,
    modifyModuleName,
    modifyModuleProp,
    removeModule,
    propEditingDisabled,
    fetchROIImgURL
  } = useStore(
    (state) => ({
      modDef: state.moduleDefinitions[nodeData.type],
      modifyModuleName: state.modifyModuleName,
      modifyModuleProp: state.modifyModuleProp,
      removeModule: state.removeModule,
      propEditingDisabled: state.propEditingDisabled,
      fetchROIImgURL: state.fetchROIImgURL
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

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  const handleEditROIClick = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const propObj = nodeData.props as PropObject

  const renderROIEditor = useCallback(() => {
    return (
      <ROIEditContent
        moduleId={nodeData.id}
        defaultRegions={propObj['regions'] as number[][]}
      />
    )
  }, [nodeData.id, propObj['regions']])

  useEffect(() => {
    fetchROIImgURL()
  }, [fetchROIImgURL])

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
        <Button variant="contained" onClick={handleEditROIClick}>
          Edit ROI
        </Button>
      </Box>
      {/* <Box className="gddi-aiappcanvas__section module-runner">
        <NodeRunner
          runner={nodeData1.runner}
          disabled={propEditingDisabled}
          onChange={handleRunnerChange}
        />
      </Box> */}
      <MyFullScreenDialog
        open={dialogOpen}
        title="画 ROI"
        okTitle="Save Changes"
        onClose={handleDialogClose}
        renderContent={renderROIEditor}
      />
    </Box>
  )
}