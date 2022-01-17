import React, {
  useCallback,
  useEffect,
  useRef,
  useContext,
  useMemo
} from 'react'
import ReactFlow, { Controls, OnLoadParams } from 'react-flow-renderer'
import shallow from 'zustand/shallow'
import { Pipeline, ModuleDefinitions, AIAppType } from './types'
import { rfNodeTypes } from './RFNodes'
import { rfEdgeTypes } from './RFEdges'
import { ExtendedControls } from './ExtendedControls'
import { useStore } from './store/useStore'
import { ColorModeContext } from './context'

import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

export interface AppCanvasChildProps {
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
export const AppCanvasChild = ({
  defaultValue,
  moduleDefinitions,
  onLoad,
  onValueChange,
  graphEditingDisabled,
  propEditingDisabled
}: AppCanvasChildProps): JSX.Element => {
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)
  const appRef = useRef<AIAppType | null>(null)
  const loadParaRef = useRef<OnLoadParams<any> | null>(null)
  const {
    value,
    rfElements,
    setModuleDefinitions,
    setValue,
    layoutGraph,
    addModule,
    addPipeline,
    setGraphEditingDisabled,
    setPropEditingDisabled,
    clear
  } = useStore(
    (state) => ({
      value: state.value,
      rfElements: state.rfElements,
      setModuleDefinitions: state.setModuleDefinitions,
      setValue: state.setValue,
      layoutGraph: state.layoutGraph,
      addModule: state.addModule,
      addPipeline: state.addPipeline,
      setGraphEditingDisabled: state.setGraphEditingDisabled,
      setPropEditingDisabled: state.setPropEditingDisabled,
      clear: state.clear
    }),
    shallow
  )

  const fitView = useCallback(() => {
    if (loadParaRef.current) {
      loadParaRef.current.fitView()
    }
  }, [])
  const initAppRef = useCallback(() => {
    if (appRef.current === null) {
      appRef.current = {
        addModule,
        addPipeline,
        layoutGraph,
        fitView,
        clear
      }
    } else {
      appRef.current.addModule = addModule
    }
  }, [addModule, addPipeline, layoutGraph, fitView])
  const handleLoaded = useCallback(
    (params: OnLoadParams<any>) => {
      console.log('[gddi-aiappcanvas] loaded')
      params.fitView()
      loadParaRef.current = params
      layoutGraph()
      initAppRef()
      if (onLoad && appRef.current) {
        onLoad(appRef.current)
      }
    },
    [layoutGraph, initAppRef, onLoad]
  )

  const style = useMemo(
    () => ({
      background: theme.palette.mode === 'dark' ? '#444444' : '#e8eaed'
    }),
    [theme]
  )
  const controlStyle = useMemo(
    () => ({
      background: theme.palette.mode === 'dark' ? '#444444' : 'white',
      color: theme.palette.mode === 'dark' ? 'yellow' : 'black'
    }),
    [theme]
  )

  useEffect(() => {
    // console.log('EEEE - modDef')
    if (moduleDefinitions) {
      setModuleDefinitions(moduleDefinitions)
    }
  }, [setModuleDefinitions, moduleDefinitions])

  useEffect(() => {
    // console.log(`EEEE ${name} - defaultValue`)
    // console.log(defaultValue)
    if (defaultValue) {
      setValue(defaultValue)
    }
  }, [setValue, defaultValue, name])

  useEffect(() => {
    if (onValueChange) {
      onValueChange(value)
    }
  }, [value, onValueChange])

  useEffect(() => {
    initAppRef()
  }, [initAppRef])

  useEffect(() => {
    setGraphEditingDisabled(
      graphEditingDisabled === undefined ? false : graphEditingDisabled
    )
  }, [graphEditingDisabled, setGraphEditingDisabled])

  useEffect(() => {
    setPropEditingDisabled(
      propEditingDisabled === undefined ? false : propEditingDisabled
    )
  }, [propEditingDisabled, setPropEditingDisabled])

  return (
    <>
      <ReactFlow
        style={style}
        elements={rfElements}
        nodeTypes={rfNodeTypes}
        edgeTypes={rfEdgeTypes}
        onLoad={handleLoaded}
        snapToGrid
        snapGrid={[15, 15]}
        minZoom={0.2}
        nodesDraggable={!graphEditingDisabled}
        nodesConnectable={!graphEditingDisabled}
      >
        <div className="togglemode-button">
          <IconButton
            size="small"
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === 'dark' ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </div>
        <Controls className={theme.palette.mode} showInteractive={false} />
        {!graphEditingDisabled && <ExtendedControls />}
      </ReactFlow>
    </>
  )
}
