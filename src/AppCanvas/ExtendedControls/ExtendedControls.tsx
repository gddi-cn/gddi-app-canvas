import React, { useCallback } from 'react'
import shallow from 'zustand/shallow'
import useStore from '../store/useStore'
import Tooltip from '@mui/material/Tooltip'
import HorizontalSplitOutlinedIcon from '@mui/icons-material/HorizontalSplitOutlined'

export const ExtendedControls = (): JSX.Element => {
  const { layoutGraph } = useStore(
    (state) => ({
      layoutGraph: state.layoutGraph
    }),
    shallow
  )

  const onLayout = useCallback(() => {
    layoutGraph()
  }, [layoutGraph])

  return (
    <div className="custom-controls">
      <Tooltip title={`horizontally layout graph`}>
        <div className="control-button">
          <HorizontalSplitOutlinedIcon
            className="control-button-icon"
            onClick={onLayout}
          />
        </div>
      </Tooltip>
    </div>
  )
}
