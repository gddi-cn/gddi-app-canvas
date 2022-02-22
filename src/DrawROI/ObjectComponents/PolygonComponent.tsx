import React, { useEffect, useRef } from 'react'
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
    console.log(`polygon useEffect`)
    if (fabCanvas === undefined) {
      return
    }
    if (objRef.current === undefined) {
      objRef.current = new MyPolygon({ id: polygon.id, points: polygon.points })
      fabCanvas.add(objRef.current)
    }
    return () => {
      console.log(`polygon useEffect - return`)
      if (fabCanvas && objRef.current) {
        fabCanvas.remove(objRef.current)
        objRef.current = undefined
      }
    }
  }, [polygon.id])

  return <></>
}
