import React, { useCallback, useEffect, useRef } from 'react'
import ReactFlow, { Controls, OnLoadParams } from 'react-flow-renderer'
import './AppCanvas.scss'
import shallow from 'zustand/shallow'
import { Pipeline, ModuleDefinitions, AIApp } from './types'
import { rfNodeTypes } from './RFNodes'
import { rfEdgeTypes } from './RFEdges'
import { ExtendedControls } from './ExtendedControls'
import useStore from './store/useStore'

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
  onLoad?: (app: AIApp) => void
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

export const AppCanvas = ({
  defaultValue,
  moduleDefinitions,
  onLoad,
  onValueChange,
  graphEditingDisabled,
  propEditingDisabled
}: AppCanvasProps): JSX.Element => {
  const appRef = useRef<AIApp | null>(null)
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
    setPropEditingDisabled
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
      setPropEditingDisabled: state.setPropEditingDisabled
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
        fitView
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

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)
    }
  }, [setValue, defaultValue])

  useEffect(() => {
    if (moduleDefinitions) {
      setModuleDefinitions(moduleDefinitions)
    }
  }, [setModuleDefinitions, moduleDefinitions])

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
      <link
        rel="stylesheet"
        // eslint-disable-next-line max-len
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <ReactFlow
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
        <Controls />
        {!graphEditingDisabled && <ExtendedControls />}
      </ReactFlow>
    </>
  )
}
