import React, { useCallback } from 'react'
import { ModulePropType } from '../types'

export interface PropertyInputProps {
  label: string
  value: ModulePropType
  disabled?: boolean
  onChange: (newVal: ModulePropType) => void
}

export const PropertyInput = ({
  label,
  value,
  disabled = false,
  onChange
}: PropertyInputProps): JSX.Element => {
  let inputType = 'text'
  if (typeof value === 'number') {
    inputType = 'number'
  }
  const handleInputChange = useCallback(
    (e) => {
      if (typeof value === 'number') {
        onChange(+e.target.value)
      } else {
        onChange(e.target.value)
      }
    },
    [onChange, value]
  )
  return (
    <>
      <div className="gddi-pipeline-editor__basicnode-content-label">
        {label}
      </div>
      <div className="gddi-pipeline-editor__basicnode-content-input-wrapper">
        <input
          disabled={disabled}
          type={inputType}
          name={label}
          value={value === undefined ? undefined : value.toString()}
          style={{ width: '100%' }}
          onChange={handleInputChange}
        />
      </div>
    </>
  )
}
