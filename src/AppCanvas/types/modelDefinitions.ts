import * as t from 'io-ts'

export const tEndpoint = t.type({
  id: t.number,
  name: t.string
})

export const tVisibilityAndReadonly = t.union([
  t.literal('visible_editable'),
  t.literal('visible_readonly'),
  t.literal('invisible')
])

export const tBasicTypeName = t.union([
  t.literal('string'),
  t.literal('boolean'),
  t.literal('number')
])
export type BasicTypeName = t.TypeOf<typeof tBasicTypeName>
export const tBasicType = t.union([t.string, t.boolean, t.number])
export type BasicType = t.TypeOf<typeof tBasicType>

export const tPropDefBasic = t.type({
  type: t.union([tBasicTypeName, t.literal('stringArray'), t.literal('array')])
})

export const tSimplePropDefinition = t.intersection([
  tPropDefBasic,
  t.partial({
    label: t.string,
    description: t.string,
    default: t.union([tBasicType, t.array(tBasicType)]),
    // [case] type is number or integer
    maximum: t.number,
    minimum: t.number,
    // [case] type is BasicType; single select
    enum: t.array(tBasicType),
    visibility_and_readonly: tVisibilityAndReadonly
  })
])

export const tROIPropDefinition = t.intersection([
  tPropDefBasic,
  t.partial({
    description: t.string,
    minDimension: t.number,
    maxDimension: t.number
  })
])

export const tPropDefinitionType = t.intersection([
  tSimplePropDefinition,
  tROIPropDefinition
])

export type PropDefinitionType = t.TypeOf<typeof tPropDefinitionType>

export const tPropDefinitionObject = t.record(t.string, tPropDefinitionType)

export const tModuleDefinition = t.intersection([
  t.type({
    version: t.string,
    description: t.string
  }),
  t.partial({
    inputs: t.array(tEndpoint),
    outputs: t.array(tEndpoint),
    props: tPropDefinitionObject
  })
])
export type ModuleDefinition = t.TypeOf<typeof tModuleDefinition>

export const tModuleDefinitions = t.record(t.string, tModuleDefinition)
export type ModuleDefinitions = t.TypeOf<typeof tModuleDefinitions>
