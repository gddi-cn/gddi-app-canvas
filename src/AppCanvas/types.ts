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
  moduleType: string
  name: string
  runner: string
  props?: { [propName: string]: ModulePropType }
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
  addModule: (module: RawModule) => void
  addPipeline: (modules: Module[], connections: Connection[]) => void
  layoutGraph: () => void
  fitView: () => void
}
