import React, { useCallback, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import shallow from 'zustand/shallow'
import { MyPolygon } from './../Controls/PolygonGraph'
import { Polygon } from '../types'

export interface PolygonProps {
  polygon: Polygon
}

export const PolygonComponent = ({ polygon }: PolygonProps): JSX.Element => {
  const { fabCanvas } = useStore(
    (state) => ({ fabCanvas: state.fabCanvas }),
    shallow
  )
  const objRef = useRef<MyPolygon | undefined>()

  useEffect(() => {
    if (fabCanvas === undefined) {
      return
    }
    if (objRef.current === undefined) {
      objRef.current = new MyPolygon({ id: polygon.id, points: polygon.points })
      fabCanvas.add(objRef.current)
    }
  }, [polygon])

  return <></>
}
