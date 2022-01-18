export type ModulePropType = string | number | boolean | undefined

export interface ModulePropDefinition {
  // type: 'string' | 'boolean' | 'number' | 'select'
  options: ModulePropType[]
}

export interface Endpoint {
  id: number
  name: string
}

export interface ModuleDefinition {
  inputs?: Endpoint[]
  outputs?: Endpoint[]
  props?: { [propName: string]: ModulePropDefinition }
}

export interface ModuleDefinitions {
  [moduleType: string]: ModuleDefinition
}

// Module and Template
export interface Module {
  id: number
  type: string
  name: string
  runner: string
  props?: { [propName: string]: ModulePropType }
  // the props' value when the they were initially added
  propsInited?: { [propName: string]: ModulePropType }
}

// [sourceModuleId, sourceModuleOutputId, targetModuleId, targetModuleInputId]
export type Connection = [number, number, number, number]

export interface Pipeline {
  version: string
  nodes: Module[]
  pipe: Connection[]
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type RawModule = Optional<Module, 'id'>

export type AIAppType = {
  /**
   * Add a Module (node)
   */
  addModule: (module: RawModule) => void
  /**
   * Add a Pipeline (template)
   */
  addPipeline: (modules: Module[], connections: Connection[]) => void
  /**
   * Horizontally layout the graph
   */
  layoutGraph: () => void
  /**
   * Fit the graph in view
   */
  fitView: () => void
  /**
   * Clear content in canvas
   */
  clear: () => void
  /**
   * Reset all modules' properties to what they were when inited
   */
  resetModuleProps: () => void
}
