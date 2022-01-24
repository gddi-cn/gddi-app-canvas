import React, { useMemo } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropValue } from '../types'
import { CollapseContainer } from '../Components'
import { PropRow } from './PropRow'
import { useStore } from '../store/useStore'

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
  const { propDefinition } = useStore(
    (state) => ({
      propDefinition: state.moduleDefinitions[nodeData.type]
        ? state.moduleDefinitions[nodeData.type].props
        : undefined
    }),
    shallow
  )

  const rowList: JSX.Element[] = useMemo(() => {
    if (nodeData.props) {
      const propList = nodeData.props as Record<string, PropValue>
      return Object.keys(propList).map((propName) => {
        const handlePropChange = (val: PropValue): void => {
          onPropChange(propName, val)
        }
        return (
          <PropRow
            key={`PropRow-${nodeData.id}-${propName}`}
            readonly={readonly === true}
            propName={propName}
            propDefinition={
              propDefinition === undefined
                ? undefined
                : propDefinition[propName]
            }
            value={propList[propName]}
            onChange={handlePropChange}
          />
        )
      })
    }
    return []
  }, [readonly, nodeData.props, nodeData.id, onPropChange, propDefinition])
  return <CollapseContainer title="Detail">{rowList}</CollapseContainer>
}
