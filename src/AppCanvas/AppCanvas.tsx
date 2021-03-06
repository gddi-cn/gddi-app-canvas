import React, { useState, useMemo, useEffect } from 'react'
import { Provider, createStore } from './store/useStore'
import {
  Pipeline,
  ModuleDefinitions,
  AIAppType,
  ModelListFetcher,
  ROIImgFetcher
} from './types'
import { AppCanvasChild } from './AppCanvasChild'
import { ColorModeContext } from './context'
import { getDesignTokens } from './theme'

import { ThemeProvider, createTheme } from '@mui/material/styles'

// import './AppCanvas.scss'

export interface AppCanvasProps {
  /**
   * Set dark theme when component loaded
   */
  dark?: boolean
  /**
   * Hide the button for toggling dark mode
   */
  hideDarkModeButton?: boolean
  /**
   * Object to define different types of modules
   */
  moduleDefinitions: ModuleDefinitions
  /**
   * Default value (App pipeline)
   */
  defaultValue?: Pipeline
  /**
   * Layout Nodes Vertically - default false
   */
   layoutVertically?: boolean
  /**
   * Callback when the AppCanvas get loaded
   */
  onLoad?: (app: AIAppType) => void
  /**
   * Callback when the content (value) of the AppCanvas changed
   */
  onValueChange?: (newValue: Pipeline) => void
  /**
   * async fetch models
   */
  fetchModelList?: ModelListFetcher
  /**
   * async fetch image for drawing ROIs
   */
  fetchROIImg?: ROIImgFetcher
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
  dark,
  hideDarkModeButton,
  defaultValue,
  moduleDefinitions,
  layoutVertically,
  onLoad,
  onValueChange,
  fetchModelList,
  fetchROIImg,
  graphEditingDisabled,
  propEditingDisabled
}: AppCanvasProps): JSX.Element => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])
  useEffect(() => {
    setMode(dark === true ? 'dark' : 'light')
  }, [dark])

  return (
    <Provider createStore={createStore}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <AppCanvasChild
            defaultValue={defaultValue}
            hideDarkModeButton={hideDarkModeButton}
            layoutVertically={layoutVertically}
            moduleDefinitions={moduleDefinitions}
            onLoad={onLoad}
            onValueChange={onValueChange}
            fetchModelList={fetchModelList}
            fetchROIImg={fetchROIImg}
            graphEditingDisabled={graphEditingDisabled}
            propEditingDisabled={propEditingDisabled}
          />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  )
}
