import React, { useCallback } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import Tooltip from '@mui/material/Tooltip'
import HorizontalSplitOutlinedIcon from '@mui/icons-material/HorizontalSplitOutlined'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

import './ExtendedControls.scss'

export const ExtendedControls = (): JSX.Element => {
  const { graphEditingDisabled, layoutGraph, resetModuleProps } = useStore(
    (state) => ({
      graphEditingDisabled: state.graphEditingDisabled,
      layoutGraph: state.layoutGraph,
      resetModuleProps: state.resetModuleProps
    }),
    shallow
  )

  const onLayout = useCallback(() => {
    layoutGraph()
  }, [layoutGraph])
  const resetProps = useCallback(() => {
    resetModuleProps()
  }, [resetModuleProps])

  return (
    <div className="custom-controls">
      {!graphEditingDisabled && (
        <Tooltip title={`horizontally layout graph`}>
          <div className="control-button">
            <HorizontalSplitOutlinedIcon
              className="control-button-icon"
              onClick={onLayout}
            />
          </div>
        </Tooltip>
      )}
      <Tooltip title={`reset all modules' properties`}>
        <div className="control-button">
          <RestartAltIcon
            className="control-button-icon"
            onClick={resetProps}
          />
        </div>
      </Tooltip>
    </div>
  )
}
