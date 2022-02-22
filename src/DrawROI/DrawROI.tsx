import React from 'react'
import { Provider, createStore } from './store/useStore'
import { DrawROICore } from './DrawROICore'

export interface DrawROIProps {
  /**
   * Set if ROIs are readonly
   */
  readonly?: boolean
  /**
   * Image to drawROI on
   */
  imgUrl: string | undefined
  /**
   * ROI array; Each region is described in SVG path
   */
  ROIs: string[]
  /**
   * Callback function when ROIs change
   */
  onROIsChange?: (newROIs: number[][][]) => void
  children?: React.ReactNode
}

/**
 * React component to edit regions of interests on an image
 */
export const DrawROI = (props: DrawROIProps): JSX.Element => {
  return (
    <Provider createStore={createStore}>
      <DrawROICore {...props} />
    </Provider>
  )
}
