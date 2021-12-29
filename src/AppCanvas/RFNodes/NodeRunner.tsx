import React, { useCallback, useMemo } from 'react'
import Button from '@mui/material/Button'
import AddBoxIcon from '@mui/icons-material/AddBox'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox'
import './NodeRunner.scss'

export interface NodeRunnerProps {
  runner: string
  disabled: boolean
  onChange: (runner: string) => void
}

export const NodeRunner = ({
  runner,
  disabled,
  onChange
}: NodeRunnerProps): JSX.Element => {
  const handleButtonClick = useCallback(() => {
    if (runner !== 'default') {
      onChange('default')
    } else {
      onChange('0')
    }
  }, [runner, onChange])
  const handleAddNum = useCallback(() => {
    if (!Number.isNaN(parseInt(runner, 10))) {
      const newNum = parseInt(runner, 10) + 1
      onChange(newNum.toString())
    }
  }, [runner, onChange])
  const handleMinusNum = useCallback(() => {
    if (!Number.isNaN(parseInt(runner, 10))) {
      const newNum = parseInt(runner, 10) - 1
      onChange(newNum.toString())
    }
  }, [runner, onChange])

  const runnerValue: JSX.Element = useMemo(() => {
    if (runner === 'default') {
      return <div className="runner-value runner-default">default</div>
    }
    return (
      <div className="runner-value runner-number">
        {disabled ? null : (
          <IndeterminateCheckBoxIcon
            className="runner-operator"
            onClick={handleMinusNum}
          />
        )}
        <div className="runner-number-number">{runner}</div>
        {disabled ? null : (
          <AddBoxIcon className="runner-operator" onClick={handleAddNum} />
        )}
      </div>
    )
  }, [runner, disabled, handleAddNum, handleMinusNum])

  return (
    <div className="gddi-aiappcanvas__runner-wrapper">
      <span className="gddi-aiappcanvas__runner-label">Runner</span>
      {runnerValue}
      <Button
        sx={{
          width: 110,
          height: '1.5rem',
          fontSize: '0.7rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }}
        variant="contained"
        size="small"
        onClick={handleButtonClick}
        disabled={disabled}
      >
        {runner === 'default' ? 'Change' : 'Set Default'}
      </Button>
    </div>
  )
}
