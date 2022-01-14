import React from 'react'
import { Provider, createStore } from './store/useStore'
import { Pipeline, ModuleDefinitions, AIAppType } from './types'
import { AppCanvasChild } from './AppCanvasChild'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './AppCanvas.scss'

export interface AppCanvasProps {
  /**
   * Object to define different types of modules
   */
  moduleDefinitions: ModuleDefinitions
  /**
   * Default value (App pipeline)
   */
  defaultValue?: Pipeline
  /**
   * Callback when the AppCanvas get loaded
   */
  onLoad?: (app: AIAppType) => void
  /**
   * Callback when the content (value) of the AppCanvas changed
   */
  onValueChange?: (newValue: Pipeline) => void
  /**
   * Disable graph editing (adding modules, deleting modules, connect modules, etc.)
   * false by default
   */
  graphEditingDisabled?: boolean
  /**
   * Disable module property editing.
   * false by default
   */
  propEditingDisabled?: boolean
}

/**
 * React component to visualize GDDi's AI APPs in flow chart fashion.
 */
export const AppCanvas = ({
  defaultValue,
  moduleDefinitions,
  onLoad,
  onValueChange,
  graphEditingDisabled,
  propEditingDisabled
}: AppCanvasProps): JSX.Element => {
  return (
    <Provider createStore={createStore}>
      <AppCanvasChild
        defaultValue={defaultValue}
        moduleDefinitions={moduleDefinitions}
        onLoad={onLoad}
        onValueChange={onValueChange}
        graphEditingDisabled={graphEditingDisabled}
        propEditingDisabled={propEditingDisabled}
      />
    </Provider>
  )
}
