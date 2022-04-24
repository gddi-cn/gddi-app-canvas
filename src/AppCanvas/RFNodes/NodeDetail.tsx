import React, { useMemo } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropValue, PropDefinitionType } from '../types'
import { CollapseContainer } from '../Components'
import { PropRow } from './PropRow'
import { useStore } from '../store/useStore'
import { useBoxFilterLabelOptions, isBoxFilterNode } from './propHooks'

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

  const isBoxFilter = useMemo(() => {
    return isBoxFilterNode(nodeData)
  }, [nodeData])

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
          let propVal: PropValue | undefined = propList[propName]
          let propDef =
            propDefinition === undefined ? undefined : propDefinition[propName]
          if (isBoxFilter && propName === 'box_labels') {
            propDef = {
              type: 'stringArray',
              enum: boxLabelsEnums,
              default: boxLabelsEnums
            } as PropDefinitionType
            // if any of the value does not belong to boxLabelsEnums, set
            //  value to undefined -- to use default value
            if (propVal) {
              let isValueValid = true
              for (let label of propVal as string[]) {
                if (!boxLabelsEnums.includes(label)) {
                  isValueValid = false
                  break
                }
              }
              if (!isValueValid) {
                propVal = undefined
              }
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
    boxLabelsEnums,
    isBoxFilter,
    dependentNodeIds,
    hidePropsWithName
  ])
  return <CollapseContainer title="Detail">{rowList}</CollapseContainer>
}
