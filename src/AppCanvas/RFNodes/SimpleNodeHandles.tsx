/* eslint-disable max-len */
import React, { useCallback, useMemo } from 'react'
import shallow from 'zustand/shallow'
import { Handle, Position, Connection } from 'react-flow-renderer'
import Tooltip from '@mui/material/Tooltip'
import { useStore } from '../store/useStore'

interface SimpleNodeHandlesProps {
  handleIdPrefix: string
  nodeType: string
  isInput: boolean
}

export const SimpleNodeHandles = ({
  handleIdPrefix,
  nodeType,
  isInput
}: SimpleNodeHandlesProps): JSX.Element => {
  const { layoutVertically, nodeDef, connectModules } = useStore(
    (state) => ({
      layoutVertically: state.layoutVertically,
      nodeDef: state.moduleDefinitions[nodeType],
      connectModules: state.connectModules
    }),
    shallow
  )
  const endpointList = useMemo(() => {
    if (isInput) {
      return nodeDef && nodeDef.inputs ? nodeDef.inputs : []
    }

    return nodeDef && nodeDef.outputs ? nodeDef.outputs : []
  }, [nodeDef, isInput])
  const handleConnectNodes = useCallback(
    (params: Connection) => {
      if (
        params.source &&
        params.sourceHandle &&
        params.target &&
        params.targetHandle
      ) {
        const srcSplit = params.source.split('-')
        const sHSplit = params.sourceHandle.split('-')
        const tarSplit = params.target.split('-')
        const tHSplit = params.targetHandle.split('-')
        const srcId = parseInt(srcSplit[srcSplit.length - 1], 10)
        const sHId = parseInt(sHSplit[sHSplit.length - 1], 10)
        const tarId = parseInt(tarSplit[tarSplit.length - 1], 10)
        const tHId = parseInt(tHSplit[tHSplit.length - 1], 10)
        connectModules(srcId, sHId, tarId, tHId)
      }
    },
    [connectModules]
  )

  const intervalHeight = 80 / endpointList.length

  const handlePosition: Position = useMemo(() => {
    if (layoutVertically) {
      return (isInput ? 'top' : 'bottom') as Position
    }
    return (isInput ? 'left' : 'right') as Position
  }, [isInput, layoutVertically])

  return (
    <>
      <div
        className={`gddi-aiappcanvas__simplenode-${
          isInput ? 'input' : 'output'
        }-wrapper`}
      >
        {endpointList.map((ep, idx) => {
          return (
            <div
              className={`gddi-aiappcanvas__simplenode-${
                isInput ? 'input' : 'output'
              }-wrapper-row`}
              key={`${isInput ? 'input' : 'output'}-${ep.name}`}
            >
              <Tooltip title={ep.name}>
                <Handle
                  id={`${handleIdPrefix}-${
                    isInput ? 'input' : 'output'
                  }-${ep.id.toString()}`}
                  type={isInput ? 'target' : 'source'}
                  position={handlePosition}
                  onConnect={handleConnectNodes}
                  style={
                    layoutVertically
                      ? {}
                      : { top: 70 + intervalHeight * (idx + 1) }
                  }
                  isConnectable
                />
              </Tooltip>
            </div>
          )
        })}
      </div>
    </>
  )
}
