import React, { useCallback, useMemo } from 'react'
import { ModelRes } from '../types'
import { ModelDisplay } from './ModelDisplay'
import './ModelConfigTool.scss'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'

const body2Styles: React.CSSProperties = {
  marginBottom: '1.5rem',
  marginLeft: '0.6rem'
}

type ModelValueType = ModelRes
type FilterLabelsType = string[]

export interface ModelConfigToolProps {
  modelValue: ModelValueType
  filterLabelsValue: FilterLabelsType
  onChange?: (newModel: ModelValueType, newLabels: FilterLabelsType) => void
}

export const ModelConfigTool = ({
  modelValue,
  filterLabelsValue,
  onChange
}: ModelConfigToolProps): JSX.Element => {
  const handleModelChange = useCallback(
    (newModel: ModelValueType) => {
      if (onChange) {
        // clear filter_labels when selecting new model
        onChange(newModel, [])
      }
    },
    [onChange]
  )

  return (
    <Box className="config-content">
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom component="div">
          模型
        </Typography>
        <ModelDisplay model={modelValue} onModelChange={handleModelChange} />
      </Box>
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ marginTop: '1rem' }}
        >
          标签 (filter labels)
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 2 }}
        >
          {filterLabelsValue.map((label) => (
            <Chip key={label} label={label} />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
