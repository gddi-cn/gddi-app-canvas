/* eslint-disable max-len */
import { Node, Edge, MarkerType, Position } from 'react-flow-renderer'
import { Module, Connection, Pipeline } from '../types'
import { SIMPLE_NODE } from '../RFNodes'
import { SIMPLE_EDGE } from '../RFEdges'
import { RawModule } from '..'

const getRandomInt = (min: number, max: number): number => {
  const min1 = Math.ceil(min)
  const max1 = Math.floor(max)
  return Math.floor(Math.random() * (max1 - min1) + min1)
}

export const getRFNode = (module: Module, layoutVertically?: boolean): Node => {
  const rfNode: Node = {
    id: `chris-pipenode-${module.id.toString()}`,
    type: SIMPLE_NODE,
    position: {
      x: 100 + getRandomInt(-30, 30),
      y: 100 + getRandomInt(-30, 30)
    },
    sourcePosition: layoutVertically
      ? ('bottom' as Position)
      : ('right' as Position),
    targetPosition: layoutVertically
      ? ('top' as Position)
      : ('left' as Position),
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
    markerEnd: { type: 'arrowclosed' as MarkerType },
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

export const updateIds = (
  modules: Module[],
  connections: Connection[],
  modules0: Module[]
): [Module[], Connection[]] => {
  const mods1 = [...modules]
  const conns1 = connections.map((conn) => [...conn] as Connection)
  // replace module id with new one -- mods1, conns1
  let modIdNew = getNextModuleId(modules0)
  modules.forEach((mod, modIdx) => {
    const modId0 = mod.id
    if (modId0 !== modIdNew) {
      mods1[modIdx] = { ...mod, id: modIdNew }
      // also replace connectionIds
      connections.forEach((conn, connIdx) => {
        if (conn[0] === modId0) {
          conns1[connIdx][0] = modIdNew
        }
        if (conn[2] === modId0) {
          conns1[connIdx][2] = modIdNew
        }
      })
    }
    modIdNew += 1
  })
  return [mods1, conns1]
}

export const setPipelinePropsInited = (defaultValue: Pipeline): void => {
  defaultValue.nodes.forEach((mod) => {
    if (mod.props) {
      mod.propsInited = { ...mod.props }
    }
  })
}

export const setModulesPropInited = (modules: (Module | RawModule)[]): void => {
  modules.forEach((mod) => {
    if (mod.props) {
      mod.propsInited = { ...mod.props }
    }
  })
}

export const setModulePropInited = (
  module: Module | RawModule
): Module | RawModule => {
  const res = { ...module }
  if (module.props) {
    res.propsInited = { ...res.props }
  }
  return res
}
