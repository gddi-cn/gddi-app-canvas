import React, { useCallback, useMemo } from 'react'
import { PropValue, PropDefinitionType, BasicTypeName } from '../types'
import { StringArrayInput } from './StringArrayInput'

import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box'

const sxInput = { bgcolor: 'background.default', color: 'text.primary' }

// BasicInput handles type -- number, string, boolean
const BasicInputTypes = ['string', 'number', 'boolean']
export const BasicInput = ({
  readonly,
  propName,
  value,
  propDefinition,
  onChange
}: PropRowProps): JSX.Element => {
  const inferredType: BasicTypeName = useMemo(() => {
    if (BasicInputTypes.includes(typeof value)) {
      return typeof value as BasicTypeName
    }
    if (propDefinition?.type && BasicInputTypes.includes(propDefinition?.type)) {
      return propDefinition?.type as BasicTypeName
    }
    return 'string'
  }, [value, propDefinition?.type])


  const inputTypeStr = useMemo(() => (
    inferredType === 'string' ? 'text': 'number'
  ), [inferredType])

  //TODO: set step using propDefinition
  // const inputProps = useMemo(() => {
  //   if (inputTypeStr === 'number') {
  //     const valStr = value.toString()
  //     console.log(valStr)
  //     console.log(valStr.indexOf('.'))
  //     if (valStr.indexOf('.') > -1) {
  //       return {
  //         step: '0.1'
  //       }
  //     } else {
  //       return {
  //         step: '1'
  //       }
  //     }
  //   } else {
  //     return {}
  //   }
  // }, [inputTypeStr, value])

  const handleSwitchChange = useCallback((evt, checked: boolean) => {
    onChange(checked)
  }, [onChange])

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const valStr = event.target.value
    if (inputTypeStr === 'number') {
      onChange(+valStr)
    } else {
      onChange(valStr)
    }
  }

  if (inferredType === 'boolean') {
    return (
      <Box className='label-input-wrapper'>
        <Box className="propname-row">
          <label className="propname-area">{propName}</label>
        </Box>
        <Switch size='small' disabled={readonly} checked={value === true} onChange={handleSwitchChange} />
      </Box>
    )
  }

  return (
    <TextField
      sx={sxInput}
      style={{ width: '100%' }}
      size="small"
      disabled={readonly}
      id={`${propName}-row`}
      label={propName}
      variant="standard"
      type={inputTypeStr}
      value={value}
      onChange={handleTextFieldChange}
    />
  )
}

export interface PropRowProps {
  readonly: boolean
  propName: string
  value: PropValue | undefined
  propDefinition: PropDefinitionType | undefined
  dependentNodeIds?: number[]
  onChange: (newVal: PropValue) => void
}

export const PropRow = ({
  readonly,
  propName,
  value,
  propDefinition,
  dependentNodeIds,
  onChange
}: PropRowProps): JSX.Element => {
  const inputEle = useMemo(() => {
    if (Array.isArray(value) || propDefinition?.type === 'stringArray') {
      return (
        <StringArrayInput
          readonly={readonly}
          propName={propName}
          value={value}
          propDefinition={propDefinition}
          dependentNodeIds={dependentNodeIds}
          onChange={onChange}
        />
      )
    }
    return (
      <BasicInput
        readonly={readonly}
        propName={propName}
        value={value}
        propDefinition={propDefinition}
        onChange={onChange}
      />
    )
  }, [readonly, propName, value, propDefinition, dependentNodeIds, onChange])

  return <div className="gddi-aiappcanvas__simplenode-proprow">{inputEle}</div>
}
