import React, { useCallback } from 'react'
import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
  EdgeProps
} from 'react-flow-renderer'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'

const foreignObjectSize = 40

const SimpleEdge0 = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style
}: EdgeProps): JSX.Element => {
  const { removeConnection, graphEditingDisabled } = useStore(
    (state) => ({
      removeConnection: state.removeConnection,
      graphEditingDisabled: state.graphEditingDisabled
    }),
    shallow
  )
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })
  // const markerEnd = getMarkerEnd(arrowHeadType, markerEndId)
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  })
  const onEdgeClick = useCallback(
    (event, edgeId) => {
      event.stopPropagation()
      removeConnection(edgeId)
    },
    [removeConnection]
  )

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {!graphEditingDisabled && (
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={edgeCenterX - foreignObjectSize / 2}
          y={edgeCenterY - foreignObjectSize / 3}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <CancelRoundedIcon
            style={{ color: 'gray', cursor: 'pointer' }}
            className="edgebutton"
            onClick={(event) => onEdgeClick(event, id)}
          />
        </foreignObject>
      )}
    </>
  )
}

export const SimpleEdge = React.memo(SimpleEdge0)
