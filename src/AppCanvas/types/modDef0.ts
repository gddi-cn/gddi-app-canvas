export interface ModuleDefinitions {
  [moduleType: string]: ModuleDefinition
}

export interface ModuleDefinition {
  version: string
  name: string
  description: string
  inputs?: Endpoint[]
  outputs?: Endpoint[]
  props?: PropDefinitionObject
}

export interface Endpoint {
  id: number
  name: string
}

type PropDefinitionObject = {
  [propName: string]: SimplePropDefinition | ROIPropDefinition
}

type BasicType = 'string' | 'boolean' | 'number'

interface PropDefBasic {
  type: BasicType | 'array'
  description?: string
}

export interface SimplePropDefinition extends PropDefBasic {
  default?: BasicType
  // [case] type is number or integer
  maximum?: number
  minimum?: number
  // [case] type is BasicType; single select
  enum?: BasicType[]
  // // [case] type is object -- props must be defined
  // props?: PropDefinitionObject
}

// For ROI模块的特殊设定参数
export interface ROIPropDefinition extends PropDefBasic {
  // minimum width or height allowed in pixels
  minDimension?: number
  // maximum width or height allowed in pixels
  maxDimension?: number
}
