import React, { useCallback } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import { ModelRes, ModLabelsValueType } from '../types'
import { ModelDisplay } from './ModelDisplay'
import { FilterLabelsDisplay } from './FilterLabelsDisplay'
import { stringToHex, hexToRgb } from './../helpers'
import './ModelConfigTool.scss'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

export type ModelValueType = ModelRes
export type FilterLabelsType = ModLabelsValueType

function initLabelsObject(labels: string[]): FilterLabelsType {
  const labelObj: FilterLabelsType = {}
  labels.forEach((labelKey) => {
    const randomColor = hexToRgb(stringToHex(labelKey)) || {
      r: 255,
      g: 255,
      b: 0
    }
    labelObj[labelKey] = {
      label: labelKey,
      checked: true,
      color: [randomColor.r, randomColor.g, randomColor.b]
    }
  })
  return labelObj
}

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
  const { fetchLabelMemo } = useStore(
    (state) => ({
      fetchLabelMemo: state.fetchLabelMemo
    }),
    shallow
  )

  const handleModelChange = useCallback(
    (newModel: ModelValueType) => {
      // console.log(`model changed`)
      const newLabelList = fetchLabelMemo[newModel.mod_result_id]
      const newLabels = initLabelsObject(newLabelList)
      if (onChange) {
        onChange(newModel, newLabels)
      }
    },
    [onChange, fetchLabelMemo]
  )

  const handleLabelsChange = useCallback(
    (newLabels: FilterLabelsType) => {
      // console.log(`labels changed`)
      if (onChange) {
        onChange(modelValue, newLabels)
      }
    },
    [modelValue, onChange]
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
          <FilterLabelsDisplay
            labels={filterLabelsValue}
            onLabelsChange={handleLabelsChange}
          />
        </Stack>
      </Box>
    </Box>
  )
}
