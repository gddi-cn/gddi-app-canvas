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
  onPropChange: (propName: string, propVal: PropValue) => void
}

export const NodeDetail = ({
  readonly,
  nodeData,
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
  console.log(`depend on these nodes: `)
  console.log(dependentNodeIds)

  const isBoxFilter = useMemo(() => {
    return isBoxFilterNode(nodeData)
  }, [nodeData])

  const rowList: JSX.Element[] = useMemo(() => {
    if (nodeData.props) {
      const propList = nodeData.props as Record<string, PropValue>
      return Object.keys(propList).map((propName) => {
        const handlePropChange = (val: PropValue): void => {
          onPropChange(propName, val)
        }
        let propDef =
          propDefinition === undefined ? undefined : propDefinition[propName]
        if (isBoxFilter && propName === 'box_labels') {
          propDef = {
            type: 'stringArray',
            enum: boxLabelsEnums
          } as PropDefinitionType
        }
        return (
          <PropRow
            key={`PropRow-${nodeData.id}-${propName}`}
            readonly={readonly === true}
            propName={propName}
            propDefinition={propDef}
            value={propList[propName]}
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
    boxLabelsEnums
  ])
  return <CollapseContainer title="Detail">{rowList}</CollapseContainer>
}
