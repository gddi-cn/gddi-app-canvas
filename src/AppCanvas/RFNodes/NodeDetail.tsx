import React, { useMemo } from 'react'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import shallow from 'zustand/shallow'
import { Module, ModulePropType, ModulePropDefinition } from '../types'
import { CollapseContainer } from '../Components'
import { useStore } from '../store/useStore'

interface PropRowProps {
  readonly: boolean
  propName: string
  value: ModulePropType
  propDefinition: ModulePropDefinition | undefined
  onChange: (newVal: ModulePropType) => void
}

const PropRow = ({
  readonly,
  propName,
  value,
  propDefinition,
  onChange
}: PropRowProps): JSX.Element => {
  const inputEle: JSX.Element = useMemo(() => {
    if (propDefinition && propDefinition.options.length > 0) {
      const { options } = propDefinition
      const handleSelectChange = (e: SelectChangeEvent): void => {
        onChange(e.target.value)
      }
      return (
        <FormControl
          variant="standard"
          sx={{
            m: 1,
            width: 256,
            margin: 0,
            bgcolor: 'background.default',
            color: 'text.primary'
          }}
        >
          <InputLabel
            id={`prop-label-${propName}`}
            sx={{ bgcolor: 'background.default', color: 'text.primary' }}
          >
            {propName}
          </InputLabel>
          <Select
            disabled={readonly}
            labelId={`prop-label-${propName}`}
            id={`prop-select-${propName}`}
            value={value?.toString()}
            onChange={handleSelectChange}
            label="Age"
            sx={{
              fontSize: '0.8rem',
              bgcolor: 'background.default',
              color: 'text.primary'
            }}
          >
            {options.map((op) => (
              <MenuItem
                key={op?.toString()}
                value={op?.toString()}
                sx={{
                  fontSize: '0.8rem',
                  bgcolor: 'background.default',
                  color: 'text.primary'
                }}
              >
                {op}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }
    const handleTextFieldChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      onChange(event.target.value)
    }
    return (
      <TextField
        sx={{ bgcolor: 'background.default', color: 'text.primary' }}
        style={{ width: '100%' }}
        size="small"
        disabled={readonly}
        id={`${propName}-row`}
        label={propName}
        variant="standard"
        value={value}
        onChange={handleTextFieldChange}
      />
    )
  }, [onChange, propDefinition, propName, readonly, value])

  return <div className="gddi-aiappcanvas__simplenode-proprow">{inputEle}</div>
}

export interface NodeDetailProps {
  readonly?: boolean
  nodeData: Module
  onPropChange: (propName: string, propVal: ModulePropType) => void
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
      const propList = nodeData.props as Record<string, ModulePropType>
      return Object.keys(propList).map((propName) => {
        const handlePropChange = (val: ModulePropType): void => {
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
