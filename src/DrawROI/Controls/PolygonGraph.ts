import { fabric } from 'fabric'

export type Point = {
  x: number
  y: number
}

export type MyPolygonOption = {
  id: number
  points: Point[]
}

const defaultOption: fabric.IPolylineOptions = {
  stroke: '#ffd000',
  strokeWidth: 0.5,
  fill: '#fff200',
  opacity: 0.5,
  hasBorders: false,
  hasControls: false,
  selectable: false
}

export class MyPolygon extends fabric.Polygon {
  constructor({ id, points }: MyPolygonOption) {
    if (points.length > 2) {
      super(points, {
        ...defaultOption,
        data: {
          id,
          type: 'polygon'
        }
      })
    }
  }
}
