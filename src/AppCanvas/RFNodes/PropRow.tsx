import React, { useMemo } from 'react'
import { PropValue, PropDefinitionType } from '../types'
import TextField from '@mui/material/TextField'

const sxInput = { bgcolor: 'background.default', color: 'text.primary' }

export const BasicInput = ({
  readonly,
  propName,
  value,
  propDefinition,
  onChange
}: PropRowProps): JSX.Element => {
  if (propDefinition && propDefinition.enum && propDefinition.enum.length > 0) {
    //TODO:
    return <span>StringInput with enum</span>
  }

  const inputTypeStr = useMemo(() => {
    if (typeof value === 'number') {
      return 'number'
    }
    return 'text'
  }, [value])

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

interface PropRowProps {
  readonly: boolean
  propName: string
  value: PropValue
  propDefinition: PropDefinitionType | undefined
  onChange: (newVal: PropValue) => void
}

export const PropRow = ({
  readonly,
  propName,
  value,
  propDefinition,
  onChange
}: PropRowProps): JSX.Element => {
  const inputEle = useMemo(() => {
    return (
      <BasicInput
        readonly={readonly}
        propName={propName}
        value={value}
        propDefinition={propDefinition}
        onChange={onChange}
      />
    )
  }, [readonly, propName, value, propDefinition, onChange])

  return <div className="gddi-aiappcanvas__simplenode-proprow">{inputEle}</div>
}
