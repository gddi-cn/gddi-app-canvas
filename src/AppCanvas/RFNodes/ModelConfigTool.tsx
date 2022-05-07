import React, { useCallback, useEffect, useContext } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import { ModelRes, ModLabelsValueType } from '../types'
import { ModelDisplay } from './ModelDisplay'
import { FilterLabelsDisplay } from './FilterLabelsDisplay'
import { stringToHex, hexToRgb } from './../helpers'
import { QueryModelContext } from './NodeContext'
import './ModelConfigTool.scss'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

export type ModelValueType = ModelRes | undefined
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
  const { queryModelType } = useContext(QueryModelContext)
  const { fetchModelsWithLabels, setFetchLoading, modelListFetcher } = useStore(
    (state) => ({
      fetchModelsWithLabels: state.fetchModelsWithLabels,
      setFetchLoading: state.setFetchLoading,
      modelListFetcher: state.modelListFetcher
    }),
    shallow
  )

  const handleModelChange = useCallback(
    (newModel: ModelValueType) => {
      // console.log(`model changed`)
      // console.log(fetchLabelMemo)
      // console.log(searchModelResLabelMemo)
      let newLabelList: string[] = []
      if (newModel) {
        newLabelList = newModel.labels
      }
      const newLabels = initLabelsObject(newLabelList)
      if (onChange) {
        onChange(newModel, newLabels)
      }
    },
    [onChange]
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

  useEffect(() => {
    console.log(`config toolllllll`)
    console.log('bbbb -  modelListFetcher changes')
    console.log(queryModelType)
    setFetchLoading(true)
    fetchModelsWithLabels(1, undefined, queryModelType)
  }, [fetchModelsWithLabels, modelListFetcher, setFetchLoading, queryModelType])

  return (
    <Box className="config-content">
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom component="div">
          {`模型（${queryModelType}）`}
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
          模型标签
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
