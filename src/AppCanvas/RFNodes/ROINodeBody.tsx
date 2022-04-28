// custom node: https://reactflow.dev/examples/custom-node/

import React, { useCallback, useEffect, useState } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropObject } from '../types'
import { useStore } from '../store/useStore'
// import { NodeRunner } from './NodeRunner'
import { ROIDialog } from './ROIDialog'
import { NodeDetail } from './NodeDetail'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

interface ROINodeBodyProps {
  nodeData: Module
  renderModuleHeaderContent: (nodeData: Module) => JSX.Element
}

export const ROINodeBody = ({
  nodeData,
  renderModuleHeaderContent
}: ROINodeBodyProps): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const {
    modifyModuleProp,
    propEditingDisabled,
    setFetchROIImgLoading,
    fetchROIImgURL,
    roiImgFetcher
  } = useStore(
    (state) => ({
      modDef: state.moduleDefinitions[nodeData.type],
      modifyModuleProp: state.modifyModuleProp,
      propEditingDisabled: state.propEditingDisabled,
      setFetchROIImgLoading: state.setFetchROIImgLoading,
      fetchROIImgURL: state.fetchROIImgURL,
      roiImgFetcher: state.roiImgFetcher
    }),
    shallow
  )
  // const handleRunnerChange = useCallback(
  //   (runner) => {
  //     modifyModuleRunner(nodeData.id, runner)
  //   },
  //   [modifyModuleRunner, nodeData.id]
  // )

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

  const handleNodePropChange = useCallback(
    (propName, propVal) => {
      modifyModuleProp(nodeData.id, propName, propVal)
    },
    [modifyModuleProp, nodeData.id]
  )

  const propObj = nodeData.props as PropObject
  const regions = propObj['regions'] as number[][][]

  useEffect(() => {
    // console.log('aaaa - roiImgFetcher changes')
    setFetchROIImgLoading(true)
    fetchROIImgURL()
  }, [fetchROIImgURL, roiImgFetcher, setFetchROIImgLoading])

  return (
    <Box
      sx={{ bgcolor: 'background.default', color: 'text.primary' }}
      className="gddi-aiappcanvas__simplenode"
    >
      <Box className="gddi-aiappcanvas__section gddi-aiappcanvas__header">
        {renderModuleHeaderContent(nodeData)}
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
      <ROIDialog
        readonly={propEditingDisabled}
        open={dialogOpen}
        title="画 ROI"
        okTitle="保存修改"
        defaultRegions={regions}
        onClose={handleDialogClose}
        onOK={handleDialogOk}
      />
      {Object.keys(propObj).length > 1 ? (
        <Box>
          <NodeDetail
            hidePropsWithName={['regions']}
            readonly={propEditingDisabled}
            nodeData={nodeData}
            onPropChange={handleNodePropChange}
          />
        </Box>
      ) : null}
    </Box>
  )
}
