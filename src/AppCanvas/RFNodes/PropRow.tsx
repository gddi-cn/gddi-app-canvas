import React, { useCallback, useMemo, useState, useEffect } from 'react'
import {
  PropValue,
  PropDefinitionType,
  BasicTypeName,
  BasicType
} from '../types'
import { StringArrayInput } from './StringArrayInput'
import { HtmlTooltip } from './../Components'

import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import Box from '@mui/material/Box'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

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
    if (
      propDefinition?.type &&
      BasicInputTypes.includes(propDefinition?.type)
    ) {
      return propDefinition?.type as BasicTypeName
    }
    return 'string'
  }, [value, propDefinition?.type])

  const [value1, setValue1] = useState<BasicType | undefined>(
    value === undefined && propDefinition?.default
      ? (propDefinition?.default as BasicType)
      : (value as BasicType | undefined)
  )

  const inputTypeStr = useMemo(
    () => (inferredType === 'string' ? 'text' : 'number'),
    [inferredType]
  )

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

  const handleSwitchChange = useCallback(
    (evt, checked: boolean) => {
      onChange(checked)
    },
    [onChange]
  )

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

  const propLabel = useMemo(
    () => (propDefinition?.label ? propDefinition.label : propName),
    [propName, propDefinition?.label]
  )

  useEffect(() => {
    console.log(`value OR propDefinition?.default change!`)
    if (value === undefined && propDefinition?.default) {
      setValue1(propDefinition?.default as BasicType)
    } else {
      setValue1(value as BasicType | undefined)
    }
  }, [value, propDefinition?.default])

  if (inferredType === 'boolean') {
    return (
      <Box className="label-input-wrapper">
        <Box className="propname-row">
          <label className="propname-area">{propLabel}</label>
          {propDefinition?.description && (
            <HtmlTooltip title={propDefinition?.description}>
              <HelpOutlineIcon
                className="propname-question-icon"
                sx={{ marginLeft: '0.5rem' }}
              />
            </HtmlTooltip>
          )}
        </Box>
        <Switch
          size="small"
          disabled={readonly}
          checked={value1 === true}
          onChange={handleSwitchChange}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <TextField
        sx={sxInput}
        style={{ width: '100%' }}
        size="small"
        disabled={readonly}
        id={`${propName}-row`}
        label={propLabel}
        variant="standard"
        type={inputTypeStr}
        value={value1}
        onChange={handleTextFieldChange}
      />
      {propDefinition?.description && (
        <HtmlTooltip title={propDefinition?.description}>
          <HelpOutlineIcon className="propname-question-icon" />
        </HtmlTooltip>
      )}
    </Box>
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
    console.log(`propRow - ${propName}`)
    console.log(propDefinition?.label)
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
