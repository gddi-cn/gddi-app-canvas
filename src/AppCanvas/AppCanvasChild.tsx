/* eslint-disable @typescript-eslint/no-var-requires */
import React, {
  useCallback,
  useEffect,
  useRef,
  useContext,
  useMemo
} from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  ReactFlowInstance,
  ReactFlowProvider
} from 'react-flow-renderer'
import shallow from 'zustand/shallow'
import {
  Pipeline,
  ModuleDefinitions,
  AIAppType,
  ModelListFetcher,
  ROIImgFetcher
} from './types'
import { rfNodeTypes } from './RFNodes'
import { rfEdgeTypes } from './RFEdges'
import { ExtendedControls } from './ExtendedControls'
import { useStore } from './store/useStore'
import { ColorModeContext } from './context'
import { VersionTag } from './Components'

import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

import './AppCanvas.scss'

// const version = require('./../../package.json')['version']

export interface AppCanvasChildProps {
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
   * Callback when the AppCanvas get loaded
   */
  onLoad?: (app: AIAppType) => void
  /**
   * Callback when the content (value) of the AppCanvas changed
   */
  onValueChange?: (newValue: Pipeline) => void
  /**
   * async fetch models
   * pageNumber start from 1
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
export const AppCanvasChild = ({
  hideDarkModeButton,
  defaultValue,
  moduleDefinitions,
  onLoad,
  onValueChange,
  fetchModelList,
  fetchROIImg,
  graphEditingDisabled,
  propEditingDisabled
}: AppCanvasChildProps): JSX.Element => {
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)
  const appRef = useRef<AIAppType | null>(null)
  const loadParaRef = useRef<ReactFlowInstance<any> | null>(null)
  const {
    value,
    rfElements,
    setRfInstance,
    setModuleDefinitions,
    setValue,
    layoutGraph,
    addModule,
    addPipeline,
    setGraphEditingDisabled,
    setPropEditingDisabled,
    clear,
    resetModuleProps,
    setModelListFetcher,
    setROIImgFetcher
  } = useStore(
    (state) => ({
      value: state.value,
      rfElements: state.rfElements,
      setRfInstance: state.setRfInstance,
      setModuleDefinitions: state.setModuleDefinitions,
      setValue: state.setValue,
      layoutGraph: state.layoutGraph,
      addModule: state.addModule,
      addPipeline: state.addPipeline,
      setGraphEditingDisabled: state.setGraphEditingDisabled,
      setPropEditingDisabled: state.setPropEditingDisabled,
      clear: state.clear,
      resetModuleProps: state.resetModuleProps,
      setModelListFetcher: state.setModelListFetcher,
      setROIImgFetcher: state.setROIImgFetcher
    }),
    shallow
  )

  const fitView = useCallback(() => {
    if (loadParaRef.current) {
      loadParaRef.current.fitView({ padding: 0.01 })
    }
  }, [])
  const initAppRef = useCallback(() => {
    if (appRef.current === null) {
      appRef.current = {
        addModule,
        addPipeline,
        layoutGraph,
        fitView,
        clear,
        resetModuleProps
      }
    } else {
      appRef.current.addModule = addModule
    }
  }, [addModule, addPipeline, layoutGraph, fitView, clear, resetModuleProps])
  const handleLoaded = useCallback(
    (params: ReactFlowInstance<any>) => {
      // console.log('[gddi-aiappcanvas] loaded')
      params.fitView({ padding: 0.01 })
      loadParaRef.current = params
      setRfInstance(params)
      layoutGraph()
      initAppRef()
      if (onLoad && appRef.current) {
        onLoad(appRef.current)
      }
    },
    [layoutGraph, initAppRef, onLoad, setRfInstance]
  )

  const handleFitView = useCallback(() => {
    if (loadParaRef.current) {
      loadParaRef.current.fitView({ padding: 0.01 })
    }
  }, [])

  const style = useMemo(
    () => ({
      background: theme.palette.mode === 'dark' ? '#444444' : '#e8eaed'
    }),
    [theme]
  )

  const rfNodes = useMemo(
    () => rfElements.filter((v) => v.id.includes('node')) as Node[],
    [rfElements]
  )

  const rfEdges = useMemo(
    () => rfElements.filter((v) => v.id.includes('edge')) as Edge[],
    [rfElements]
  )

  useEffect(() => {
    // console.log('EEEE - modDef')
    if (moduleDefinitions) {
      setModuleDefinitions(moduleDefinitions)
    }
  }, [setModuleDefinitions, moduleDefinitions])

  useEffect(() => {
    // Set Default Value
    if (defaultValue) {
      setValue(defaultValue)
    }
  }, [setValue, defaultValue])

  useEffect(() => {
    if (onValueChange) {
      const nodesRe = value.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        name: node.name,
        runner: node.runner,
        props: { ...node.props }
      }))

      onValueChange({
        version: value.version,
        pipe: value.pipe,
        nodes: nodesRe
      })
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

  useEffect(() => {
    setModelListFetcher(fetchModelList)
  }, [setModelListFetcher, fetchModelList])

  useEffect(() => {
    setROIImgFetcher(fetchROIImg)
  }, [setROIImgFetcher, fetchROIImg])

  return (
    <ReactFlowProvider>
      <ReactFlow
        className={theme.palette.mode}
        style={style}
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={rfNodeTypes}
        edgeTypes={rfEdgeTypes}
        onInit={handleLoaded}
        // snapToGrid
        // snapGrid={[15, 15]}
        minZoom={0.1}
        nodesDraggable={!graphEditingDisabled}
        nodesConnectable={!graphEditingDisabled}
      >
        {(hideDarkModeButton === false || hideDarkModeButton === undefined) && (
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
        )}
        <Controls
          className={theme.palette.mode}
          showInteractive={false}
          onFitView={handleFitView}
        />
        <ExtendedControls />
        {/* <VersionTag version={process.env.VER ? process.env.VER.toString() : 'undefined'} /> */}
        {/* <VersionTag version={version} /> */}
      </ReactFlow>
    </ReactFlowProvider>
  )
}
