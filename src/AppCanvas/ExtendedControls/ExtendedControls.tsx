import React, { useCallback } from 'react'
import shallow from 'zustand/shallow'
import useStore from '../store/useStore'

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
      <button type="button" onClick={onLayout}>
        horizontal layout
      </button>
    </div>
  )
}
