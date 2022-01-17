import React, { useState, useMemo } from 'react'
import { Provider, createStore } from './store/useStore'
import { Pipeline, ModuleDefinitions, AIAppType } from './types'
import { AppCanvasChild } from './AppCanvasChild'
import { ColorModeContext } from './context'
import { getDesignTokens } from './theme'

import { ThemeProvider, createTheme } from '@mui/material/styles'

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
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )

  // const theme = useMemo(
  //   () =>
  //     createTheme({
  //       palette: {
  //         mode
  //       }
  //     }),
  //   [mode]
  // )
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <Provider createStore={createStore}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <AppCanvasChild
            defaultValue={defaultValue}
            moduleDefinitions={moduleDefinitions}
            onLoad={onLoad}
            onValueChange={onValueChange}
            graphEditingDisabled={graphEditingDisabled}
            propEditingDisabled={propEditingDisabled}
          />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  )
}
