import React, { useCallback, useMemo } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropValue, PropDefinitionType } from '../types'
import { CollapseContainer } from '../Components'
import { PropRow } from './PropRow'
import { useStore } from '../store/useStore'
import {
  useBoxFilterLabelOptions,
  isBoxFilterNode,
  useBoxFilterBestThreshold
} from './propHooks'

export interface NodeDetailProps {
  readonly?: boolean
  nodeData: Module
  // props with name exist in this array will not be rendered
  hidePropsWithName?: string[]
  onPropChange: (propName: string, propVal: PropValue) => void
}

export const NodeDetail = ({
  readonly,
  nodeData,
  hidePropsWithName,
  onPropChange
}: NodeDetailProps): JSX.Element => {
  const { propDefinition, pipeline } = useStore(
    (state) => ({
      propDefinition: state.moduleDefinitions[nodeData.type]
        ? state.moduleDefinitions[nodeData.type].props
        : undefined,
      pipeline: state.value
    }),
    shallow
  )
  const [boxLabelsEnums, dependentNodeIds] = useBoxFilterLabelOptions(
    nodeData,
    pipeline
  )
  const [boxFilterBestThreshold, boxFilterBTId] = useBoxFilterBestThreshold(
    dependentNodeIds,
    pipeline
  )

  const boxFilterBTNodeName = useMemo(() => {
    const node = pipeline.nodes.find((n) => n.id === boxFilterBTId)
    return node ? node.name : undefined
  }, [boxFilterBTId, pipeline.nodes])

  const isBoxFilter = useMemo(() => {
    return isBoxFilterNode(nodeData)
  }, [nodeData])

  const generatePropDefinition = useCallback(
    (propName: string, propVal: PropValue | undefined) => {
      if (propName === 'box_labels') {
        const propDef = {
          type: 'stringArray',
          enum: boxLabelsEnums,
          default: boxLabelsEnums
        } as PropDefinitionType
        // if any of the value does not belong to boxLabelsEnums -> invalid -> set
        //  value to undefined -- to use default value
        if (propVal) {
          let isValueValid = true
          for (const label of propVal as string[]) {
            if (!boxLabelsEnums.includes(label)) {
              isValueValid = false
              break
            }
          }
          if (!isValueValid) {
            propVal = undefined
          }
        }
        return propDef
      }
      // if (propName === 'best_threshold') {
      if (propName === 'box_prob') {
        const propDef = {
          type: 'number',
          default: boxFilterBestThreshold,
          description: `默认值来自模块：${boxFilterBTNodeName}（id: ${boxFilterBTId}）`
        } as PropDefinitionType
        return propDef
      }
      return undefined
    },
    [boxLabelsEnums, boxFilterBestThreshold, boxFilterBTNodeName, boxFilterBTId]
  )

  const rowList: JSX.Element[] = useMemo(() => {
    if (nodeData.props) {
      const propList = nodeData.props
      const propNameSet = new Set<string>(Object.keys(propList))
      if (propDefinition) {
        Object.keys(propDefinition).forEach((pn) => {
          propNameSet.add(pn)
        })
      }
      const propNameCombine = Array.from(propNameSet).sort()
      return propNameCombine
        .filter((pn) => !(hidePropsWithName && hidePropsWithName.includes(pn)))
        .map((propName) => {
          const handlePropChange = (val: PropValue): void => {
            onPropChange(propName, val)
          }
          const propVal: PropValue | undefined = propList[propName]
          let propDef =
            propDefinition === undefined ? undefined : propDefinition[propName]
          if (isBoxFilter) {
            const propDefExt = generatePropDefinition(propName, propVal)
            if (propDefExt !== undefined && propDef !== undefined) {
              propDef = { ...propDef, ...propDefExt }
            }
          }
          return (
            <PropRow
              key={`PropRow-${nodeData.id}-${propName}`}
              readonly={readonly === true}
              propName={propName}
              propDefinition={propDef}
              value={propVal}
              dependentNodeIds={dependentNodeIds}
              onChange={handlePropChange}
            />
          )
        })
    }
    return []
  }, [
    readonly,
    nodeData.props,
    nodeData.id,
    onPropChange,
    propDefinition,
    isBoxFilter,
    dependentNodeIds,
    hidePropsWithName,
    generatePropDefinition
  ])
  return <CollapseContainer title="属性详情">{rowList}</CollapseContainer>
}
