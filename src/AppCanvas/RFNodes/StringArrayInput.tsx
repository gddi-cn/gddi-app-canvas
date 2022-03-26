import React, { useCallback, useMemo } from 'react'
import { BasicType } from '../types'
import { PropRowProps } from './PropRow'
import './StringArrayInput.scss'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

export const StringArrayInput = ({
  readonly,
  propName,
  value,
  propDefinition,
  onChange
}: PropRowProps): JSX.Element => {
  const arrayVal = value as string[]

  const options = useMemo(() => {
    const oSet = new Set<string>()
    // arrayVal.forEach((valStr) => {
    //   oSet.add(valStr)
    // })
    if (propDefinition?.enum && propDefinition?.enum.length > 0) {
      const enumOpts = propDefinition?.enum as BasicType[]
      enumOpts.forEach((str) => {
        oSet.add(str)
      })
    }
    return Array.from(oSet).sort()
  }, [propDefinition?.enum, arrayVal])

  const handleChipClick = useCallback(
    (opt: string) => {
      const newVal = [...arrayVal]
      const optIdx = newVal.findIndex((val) => val === opt)
      if (optIdx >= 0) {
        newVal.splice(optIdx, 1)
      } else {
        newVal.push(opt)
      }
      onChange(newVal)
    },
    [arrayVal, onChange]
  )

  return (
    <Box>
      <label className="propname-area">{propName}</label>
      <Box className="stringchips-area">
        {options.map((opt, idx) => {
          return (
            <Chip
              className="chip-item"
              label={opt}
              size="small"
              color={arrayVal.includes(opt) ? 'primary' : 'default'}
              key={`${opt}-${idx}`}
              clickable={!readonly}
              onClick={() => handleChipClick(opt)}
            />
          )
        })}
      </Box>
    </Box>
  )
}
