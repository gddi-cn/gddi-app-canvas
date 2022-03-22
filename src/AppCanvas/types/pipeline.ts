export interface Pipeline {
  version: string
  nodes: Module[]
  pipe: Connection[]
}

// [sourceModuleId, sourceModuleOutputId, targetModuleId, targetModuleInputId]
export type Connection = [number, number, number, number]

export interface Module {
  id: number
  type: string
  name: string
  runner: string
  props?: PropObject
  // the props' value when the they were first added -- internal use
  propsInited?: PropObject
}

export type PropObject = { [propName: string]: PropValue }

export type ModLabelsValueType = {
  [label: string]: {
    checked: boolean
    label: string
    color: number[]
  }
}

// export type PropValue = PropValueBaiscType | PropObject | PropValue[]
export type PropValue =
  | PropValueBaiscType
  | PropValueBaiscType[]
  | PropValueBaiscType[][]
  | PropValueBaiscType[][][]
  | ModLabelsValueType

export type PropValueBaiscType = string | number | boolean
