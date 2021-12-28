import { SimpleEdge } from './SimpleEdge'

export * from './SimpleEdge'

export const SIMPLE_EDGE = 'simpleEdge'

export const rfEdgeTypes: Record<string, any> = {}
rfEdgeTypes[SIMPLE_EDGE] = SimpleEdge
