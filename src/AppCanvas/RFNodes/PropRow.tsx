import React, { useMemo } from 'react'
import { PropValue, PropDefinitionType } from '../types'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const sxInput = { bgcolor: 'background.default', color: 'text.primary' }

type StringInputProps = PropRowProps

export const StringInput = ({
  readonly,
  propName,
  value,
  propDefinition,
  onChange
}: StringInputProps): JSX.Element => {
  if (propDefinition && propDefinition.enum && propDefinition.enum.length > 0) {
    //TODO:
    return <span>StringInput with enum</span>
  }
  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onChange(event.target.value)
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
  //   const inputEle: JSX.Element = useMemo(() => {
  //     if (propDefinition && propDefinition.options.length > 0) {
  //       const { options } = propDefinition
  //       const handleSelectChange = (e: SelectChangeEvent): void => {
  //         onChange(e.target.value)
  //       }
  //       return (
  //         <FormControl
  //           variant="standard"
  //           sx={{
  //             m: 1,
  //             width: 256,
  //             margin: 0,
  //             bgcolor: 'background.default',
  //             color: 'text.primary'
  //           }}
  //         >
  //           <InputLabel
  //             id={`prop-label-${propName}`}
  //             sx={{ bgcolor: 'background.default', color: 'text.primary' }}
  //           >
  //             {propName}
  //           </InputLabel>
  //           <Select
  //             disabled={readonly}
  //             labelId={`prop-label-${propName}`}
  //             id={`prop-select-${propName}`}
  //             value={value?.toString()}
  //             onChange={handleSelectChange}
  //             label="Age"
  //             sx={{
  //               fontSize: '0.8rem',
  //               bgcolor: 'background.default',
  //               color: 'text.primary'
  //             }}
  //           >
  //             {options.map((op) => (
  //               <MenuItem
  //                 key={op?.toString()}
  //                 value={op?.toString()}
  //                 sx={{
  //                   fontSize: '0.8rem',
  //                   bgcolor: 'background.default',
  //                   color: 'text.primary'
  //                 }}
  //               >
  //                 {op}
  //               </MenuItem>
  //             ))}
  //           </Select>
  //         </FormControl>
  //       )
  //     }
  //     const handleTextFieldChange = (
  //       event: React.ChangeEvent<HTMLInputElement>
  //     ): void => {
  //       onChange(event.target.value)
  //     }
  //     return (
  //       <TextField
  //         sx={{ bgcolor: 'background.default', color: 'text.primary' }}
  //         style={{ width: '100%' }}
  //         size="small"
  //         disabled={readonly}
  //         id={`${propName}-row`}
  //         label={propName}
  //         variant="standard"
  //         value={value}
  //         onChange={handleTextFieldChange}
  //       />
  //     )
  //   }, [onChange, propDefinition, propName, readonly, value])

  const inputEle = useMemo(() => {
    //TODO: propDefinition.type is number, boolean
    return (
      <StringInput
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
