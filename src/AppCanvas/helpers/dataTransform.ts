/* eslint-disable max-len */
import { Node, Edge, ArrowHeadType } from 'react-flow-renderer'
import { Module, Connection } from '../types'
import { SIMPLE_NODE } from '../RFNodes'
import { SIMPLE_EDGE } from '../RFEdges'

const getRandomInt = (min: number, max: number): number => {
  const min1 = Math.ceil(min)
  const max1 = Math.floor(max)
  return Math.floor(Math.random() * (max1 - min1) + min1)
}

export const getRFNode = (module: Module): Node => {
  const rfNode: Node = {
    id: `chris-pipenode-${module.id.toString()}`,
    type: SIMPLE_NODE,
    position: {
      x: 100 + getRandomInt(-30, 30),
      y: 100 + getRandomInt(-30, 30)
    },
    data: {
      id: module.id,
      elementType: 'node'
    }
  }
  return rfNode
}

export const getRFNodes = (modules: Module[]): Node[] => {
  const nodes: Node[] = modules.map((module) => getRFNode(module))
  return nodes
}

export const getRFEdge = (conn: Connection): Edge => {
  const rfEdge: Edge = {
    id: `chris-pipeedge-${conn.join('_')}`,
    source: `chris-pipenode-${conn[0].toString()}`,
    target: `chris-pipenode-${conn[2].toString()}`,
    sourceHandle: `chris-pipenode-${conn[0].toString()}-output-${conn[1].toString()}`,
    targetHandle: `chris-pipenode-${conn[2].toString()}-input-${conn[3].toString()}`,
    style: { strokeWidth: 2 },
    // animated: true,
    arrowHeadType: 'arrowclosed' as ArrowHeadType,
    data: {
      elementType: 'edge',
      connection: conn
    },
    type: SIMPLE_EDGE
  }
  return rfEdge
}

export const getRFEdges = (connections: Connection[]): Edge[] => {
  const edges: Edge[] = []
  connections.forEach((conn) => {
    edges.push(getRFEdge(conn))
  })
  return edges
}

export const getNextModuleId = (modules: Module[]): number => {
  let id = -1
  modules.forEach((mod) => {
    id = Math.max(mod.id, id)
  })
  id += 1
  return id
}
