import * as t from 'io-ts';

export const tEndpoint = t.type({
    id: t.number,
    name: t.string
})

export const tBasicTypeName = t.union([t.literal('string'), t.literal('boolean'), t.literal('number')])
export const tBasicType = t.union([t.string, t.boolean, t.number])

export const tSimplePropDefinition = t.type({
    type: t.union([tBasicTypeName, t.literal('stringArray'), t.literal('array')]),
    description: t.union([t.undefined, t.string]),
    default: t.union([tBasicType, t.undefined]),
    // [case] type is number or integer
    maximum: t.union([t.undefined, t.number]),
    minimum: t.union([t.undefined, t.number]),
    // [case] type is BasicType; single select
    enum: t.union([t.undefined, t.array(tBasicType)])
})

export const tROIPropDefinition = t.type({
    type: t.union([tBasicTypeName, t.literal('stringArray'), t.literal('array')]),
    description: t.union([t.undefined, t.string]),
    minDimension: t.union([t.undefined, t.number]),
    maxDimension: t.union([t.undefined, t.number]),
})

export const tPropDefinitionType = t.intersection([tSimplePropDefinition, tROIPropDefinition])

export const tPropDefinitionObject = t.record(t.string, tPropDefinitionType)

export const tModuleDefinition = t.type({
    version: t.string,
    name: t.string,
    description: t.string,
    inputs: t.union([t.array(tEndpoint), t.undefined]),
    outputs: t.union([t.array(tEndpoint), t.undefined]),
    props: t.union([tPropDefinitionObject, t.undefined])
})
export type ModuleDefinition = t.TypeOf<typeof tModuleDefinition>

export const tModuleDefinitions = t.record(t.string, tModuleDefinition)
export type ModuleDefinitions = t.TypeOf<typeof tModuleDefinitions>