import { SimpleNode } from './SimpleNode'

export * from './SimpleNode'

export const SIMPLE_NODE = 'simpleNode'

export const rfNodeTypes: Record<string, any> = {}
rfNodeTypes[SIMPLE_NODE] = SimpleNode
