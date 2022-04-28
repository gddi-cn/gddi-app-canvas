import React, {
  useCallback,
  useMemo,
  Fragment,
  useEffect,
  useState
} from 'react'
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
  const [value1, setValue1] = useState<string[] | undefined>(
    value === undefined && propDefinition?.default
      ? (propDefinition?.default as string[])
      : (value as string[] | undefined)
  )

  const options = useMemo(() => {
    const oSet = new Set<string>()
    if (propDefinition?.enum && propDefinition?.enum.length > 0) {
      const enumOpts = propDefinition?.enum as BasicType[]
      enumOpts.forEach((str) => {
        oSet.add(str.toString())
      })
    }
    return Array.from(oSet).sort()
  }, [propDefinition?.enum])

  const handleChipClick = useCallback(
    (opt: string) => {
      let newVal: string[] = []
      if (value1) {
        newVal = [...value1]
      }
      const optIdx = newVal.findIndex((val) => val === opt)
      if (optIdx >= 0) {
        newVal.splice(optIdx, 1)
      } else {
        newVal.push(opt)
      }
      onChange(newVal)
    },
    [value1, onChange]
  )

  const DependentToolTipTitle = useMemo(
    () => (
      <Fragment>
        <Typography color="inherit">依赖</Typography>
        {'这个属性的可选项依赖于以下几个节点的属性:'}
        <ul>
          {dependentNodeIds?.map((id) => (
            <li key={id}>{`Module Id: ${id}`}</li>
          ))}
        </ul>
      </Fragment>
    ),
    [dependentNodeIds]
  )

  const propLabel = useMemo(
    () => (propDefinition?.label ? propDefinition.label : propName),
    [propName, propDefinition?.label]
  )

  useEffect(() => {
    console.log(`value OR propDefinition?.default change!`)
    if (value === undefined && propDefinition?.default) {
      setValue1(propDefinition?.default as string[])
    } else {
      setValue1(value as string[] | undefined)
    }
  }, [value, propDefinition?.default])

  return (
    <>
      <Box className="propname-row">
        <label className="propname-area">{propLabel}</label>
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
              color={value1 && value1.includes(opt) ? 'primary' : 'default'}
              key={`${opt}-${idx}`}
              clickable={!readonly}
              onClick={() => handleChipClick(opt)}
            />
          )
        })}
      </Box>
    </>
  )
}
