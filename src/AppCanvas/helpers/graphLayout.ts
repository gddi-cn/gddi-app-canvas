/* eslint-disable @typescript-eslint/no-explicit-any */
import { Elements } from '../types'
import { Edge, Node } from 'react-flow-renderer'
import ELK from 'elkjs/lib/elk.bundled.js'

const MOD_WIDTH = 410
const MOD_HEIGHT = 400

const elk = new ELK()

export interface GraphLayoutHelperResult {
  nodeId: string
  x: number
  y: number
}

export const graphLayoutHelper = (
  elements: Elements
): Promise<GraphLayoutHelperResult[]> => {
  const graph = {
    id: 'root',
    layoutOption: { 'elk.algorithm': 'layered' },
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
  return new Promise<GraphLayoutHelperResult[]>((resolve, reject) => {
    elk
      .layout(graph)
      .then((newValue) => {
        const result: GraphLayoutHelperResult[] = []
        newValue.children?.forEach((elkNode) => {
          result.push({
            nodeId: elkNode.id,
            x: elkNode.x || 100,
            y: elkNode.y || 100
          })
        })
        resolve(result)
      })
      .catch(reject)
  })
}

// [!important] unused currently
export const layoutNodes = (
  rfNodes: Node[],
  rfEdges: Edge[]
): Promise<Node[]> => {
  const result = [...rfNodes]
  const elements = [...rfNodes, ...rfEdges]
  const graph = {
    id: 'root',
    layoutOption: { 'elk.algorithm': 'layered' },
    children: [],
    edges: []
  }
  elements.forEach((ele) => {
    if (ele.data.elementType === 'node') {
      const eleNode = ele as Node
      ;(graph.children as Record<string, any>[]).push({
        id: eleNode.id,
        width: 600,
        height: 200
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
  return new Promise<Node[]>((resolve, reject) => {
    elk
      .layout(graph)
      .then((newValue) => {
        newValue.children?.forEach((elkNode) => {
          const resElementIdx = result.findIndex((e) => e.id === elkNode.id)
          if (resElementIdx !== -1) {
            ;(result[resElementIdx] as Node).position = {
              x: elkNode.x || 100,
              y: elkNode.y || 100
            }
          }
        })
        resolve(result)
      })
      .catch(reject)
  })
}
