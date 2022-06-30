/* eslint-disable @typescript-eslint/no-explicit-any */
import { Elements } from '../types'
import { Edge, Node } from 'react-flow-renderer'
import ELK, { ElkEdgeSection } from 'elkjs/lib/elk.bundled.js'

const MOD_WIDTH = 410
const MOD_HEIGHT = 400

const elk = new ELK()

export interface LayoutResNode {
  nodeId: string
  x: number
  y: number
}

export interface LayoutResEdge {
  edgeId: string
  startPoint: {
    x: number
    y: number
  }
  endPoint: {
    x: number
    y: number
  }
}

export interface GraphLayoutHelperResult {
  nodes: LayoutResNode[]
  edges: LayoutResEdge[]
}

export const graphLayoutHelper = (
  elements: Elements,
  verticalDirection?: boolean
): Promise<GraphLayoutHelperResult> => {
  const layoutOption: { [key: string]: string } = { 'elk.algorithm': 'layered' }
  if (verticalDirection) {
    layoutOption['elk.direction'] = 'DOWN'
  }
  const graph = {
    id: 'root',
    children: [],
    edges: []
  }
  elements.forEach((ele) => {
    if (ele.data.elementType === 'node') {
      const eleNode = ele as Node
      ;(graph.children as Record<string, any>[]).push({
        id: eleNode.id,
        width: MOD_WIDTH,
        height: MOD_HEIGHT
      })
    } else {
      const eleEdge = ele as Edge
      const graphEdgeArray = graph.edges as Record<string, any>[]
      const graphEdge = graphEdgeArray.find((ge) => ge.id === eleEdge.id)
      if (graphEdge === undefined) {
        graphEdgeArray.push({
          id: eleEdge.id,
          sources: [eleEdge.source],
          targets: [eleEdge.target]
        })
      } else {
        ;(graphEdge.sources as string[]).push(eleEdge.source)
        ;(graphEdge.targets as string[]).push(eleEdge.target)
      }
    }
  })
  return new Promise<GraphLayoutHelperResult>((resolve, reject) => {
    elk
      .layout(graph, { layoutOptions: layoutOption })
      .then((newValue) => {
        const result: GraphLayoutHelperResult = {
          nodes: [],
          edges: []
        }
        newValue.children?.forEach((elkNode) => {
          result.nodes.push({
            nodeId: elkNode.id,
            x: elkNode.x || 100,
            y: elkNode.y || 100
          })
        })
        // TODO: maybe remove this, this is NOT IN USE
        newValue.edges?.forEach((elkEdge) => {
          if (elkEdge.sections) {
            const section = elkEdge.sections[0] as ElkEdgeSection
            result.edges.push({
              edgeId: elkEdge.id,
              startPoint: {
                x: section.startPoint.x,
                y: section.startPoint.y
              },
              endPoint: {
                x: section.endPoint.x,
                y: section.endPoint.y
              }
            })
          }
        })
        resolve(result)
      })
      .catch(reject)
  })
}
