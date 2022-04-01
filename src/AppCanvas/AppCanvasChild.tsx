import React, {
  useCallback,
  useEffect,
  useRef,
  useContext,
  useMemo
} from 'react'
import ReactFlow, {
  Controls,
  OnLoadParams,
  ReactFlowProvider
} from 'react-flow-renderer'
import shallow from 'zustand/shallow'
import {
  Pipeline,
  ModuleDefinitions,
  AIAppType,
  ModelListFetcher,
  LabelListFetcher,
  ROIImgFetcher
} from './types'
import { rfNodeTypes } from './RFNodes'
import { rfEdgeTypes } from './RFEdges'
import { ExtendedControls } from './ExtendedControls'
import { useStore } from './store/useStore'
import { ColorModeContext } from './context'
import { VersionTag } from './Components'
import * as pj from './../../package.json'

import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

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
   * async fetch labels
   */
  fetchLabelList?: LabelListFetcher
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
  fetchLabelList,
  fetchROIImg,
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
    setLabelListFetcher,
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
      setLabelListFetcher: state.setLabelListFetcher,
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
  }, [addModule, addPipeline, layoutGraph, fitView])
  const handleLoaded = useCallback(
    (params: OnLoadParams<any>) => {
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
  }, [loadParaRef.current])

  const style = useMemo(
    () => ({
      background: theme.palette.mode === 'dark' ? '#444444' : '#e8eaed'
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
    setLabelListFetcher(fetchLabelList)
  }, [setLabelListFetcher, fetchLabelList])

  useEffect(() => {
    setROIImgFetcher(fetchROIImg)
  }, [setROIImgFetcher, fetchROIImg])

  return (
    <ReactFlowProvider>
      <ReactFlow
        className={theme.palette.mode}
        style={style}
        elements={rfElements}
        nodeTypes={rfNodeTypes}
        edgeTypes={rfEdgeTypes}
        onLoad={handleLoaded}
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
        <VersionTag version={pj.version} />
      </ReactFlow>
    </ReactFlowProvider>
  )
}
