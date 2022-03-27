import React, { useCallback, useMemo, Fragment } from 'react'
import { BasicType } from '../types'
import { PropRowProps } from './PropRow'
import { HtmlTooltip } from './../Components'
import Typography from '@mui/material/Typography'

import './StringArrayInput.scss'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

export const StringArrayInput = ({
  readonly,
  propName,
  value,
  propDefinition,
  dependentNodeIds,
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

  const DependentToolTipTitle = useMemo(
    () => (
      <Fragment>
        <Typography color="inherit">依赖</Typography>
        {'这个属性的可选项依赖于以下几个节点（module）:'}
        <ul>
          {dependentNodeIds?.map((id) => (
            <li key={id}>{`Module Id: ${id}`}</li>
          ))}
        </ul>
      </Fragment>
    ),
    [dependentNodeIds]
  )

  return (
    <Box>
      <Box className="propname-row">
        <label className="propname-area">{propName}</label>
        {dependentNodeIds && (
          <HtmlTooltip title={DependentToolTipTitle}>
            <HelpOutlineIcon className="propname-question-icon" />
          </HtmlTooltip>
        )}
      </Box>
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
