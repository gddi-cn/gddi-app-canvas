// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useEffect, useState } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropObject } from '../types'
import { useStore } from '../store/useStore'
import { NodeDropDown } from './NodeDropDown'
// import { NodeRunner } from './NodeRunner'
import { EditableText } from '../Components'
import { ROIDialog } from './ROIDialog'
import './ROINodeBody.scss'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

interface ROINodeBodyProps {
  nodeData: Module
}

export const ROINodeBody = ({ nodeData }: ROINodeBodyProps): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const {
    modifyModuleName,
    modifyModuleProp,
    removeModule,
    propEditingDisabled,
    setFetchROIImgLoading,
    fetchROIImgURL,
    roiImgFetcher
  } = useStore(
    (state) => ({
      modDef: state.moduleDefinitions[nodeData.type],
      modifyModuleName: state.modifyModuleName,
      modifyModuleProp: state.modifyModuleProp,
      removeModule: state.removeModule,
      propEditingDisabled: state.propEditingDisabled,
      setFetchROIImgLoading: state.setFetchROIImgLoading,
      fetchROIImgURL: state.fetchROIImgURL,
      roiImgFetcher: state.roiImgFetcher
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

  const handleDialogOk = useCallback(
    (okVal: number[][][]) => {
      setDialogOpen(false)
      modifyModuleProp(nodeData.id, 'regions', [...okVal])
    },
    [nodeData.id, modifyModuleProp]
  )

  const handleEditROIClick = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const propObj = nodeData.props as PropObject
  const regions = propObj['regions'] as number[][][]

  // const renderROIEditor = useCallback(
  //   ({ val, onValChange }) => {
  //     return (
  //       <ROIEditContent
  //         moduleId={nodeData.id}
  //         regions={propObj['regions'] as number[][]}
  //         onRegionsChange={onValChange}
  //       />
  //     )
  //   },
  //   [nodeData.id, propObj['regions']]
  // )

  useEffect(() => {
    // console.log('aaaa - roiImgFetcher changes')
    setFetchROIImgLoading(true)
    fetchROIImgURL()
  }, [fetchROIImgURL, roiImgFetcher])

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
        className="gddi-aiappcanvas__section roi-edit-button"
        variant="outlined"
        size="large"
        onClick={handleEditROIClick}
      >
        <Box component="span">{nodeData.type}</Box>
        <Box className="filterlabel-display" component="span">
          {`${regions.length} region${regions.length > 1 ? 's' : ''}`}
        </Box>
      </Button>
      {/* <Box className="gddi-aiappcanvas__section module-runner">
        <NodeRunner
          runner={nodeData1.runner}
          disabled={propEditingDisabled}
          onChange={handleRunnerChange}
        />
      </Box> */}
      {/* <MyFullScreenDialog
        open={dialogOpen}
        title="画 ROI"
        okTitle="Save Changes"
        onClose={handleDialogClose}
        onOK={handleDialogOk}
        renderContent={renderROIEditor}
      /> */}
      <ROIDialog
        readonly={propEditingDisabled}
        open={dialogOpen}
        title="画 ROI"
        okTitle="Save Changes"
        defaultRegions={regions}
        onClose={handleDialogClose}
        onOK={handleDialogOk}
      />
    </Box>
  )
}
