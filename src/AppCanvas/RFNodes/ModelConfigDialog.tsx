import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PropObject } from '../types'
import {
  ModelConfigTool,
  ModelValueType,
  FilterLabelsType
} from './ModelConfigTool'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export interface ModelConfigDialogProps {
  readonly?: boolean
  open: boolean
  title: string
  okTitle: string
  defaultValue: PropObject
  onClose: () => void
  onOK: (newVal: PropObject) => void
}

export const ModelConfigDialog = ({
  readonly,
  open,
  title,
  okTitle,
  defaultValue,
  onClose,
  onOK
}: ModelConfigDialogProps): JSX.Element => {
  const [value, setValue] = useState<PropObject>(defaultValue)

  const handleClose = useCallback(() => {
    setValue({ ...defaultValue })
    onClose()
  }, [defaultValue])

  const handleOk = useCallback(() => {
    onOK(value)
  }, [value])

  const handleValueChange = useCallback(
    (newModel: ModelValueType, newLabels: FilterLabelsType) => {
      const newModelConvert = newModel
        ? {
            ...newModel,
            mod_created_at: newModel.mod_created_at.toISOString()
          }
        : undefined
      // console.log('handle value change')
      // console.log(newModel.mod_name)
      // console.log(newLabels)
      setValue(
        (old) =>
          ({
            ...old,
            ...newModelConvert,
            mod_labels: { ...newLabels }
          } as PropObject)
      )
    },
    [setValue]
  )

  // TODO: this makes the app less robost
  // some fields could be missing
  const modelVal = useMemo(
    () =>
      value['mod_iter_id']
        ? {
            mod_id: value['mod_id'] ? value['mod_id'].toString() : 'undefined',
            mod_iter_id: value['mod_iter_id'].toString(),
            mod_license: value['mod_license']
              ? (value['mod_license'] as string)
              : 'undefined',
            mod_name: value['mod_name']
              ? (value['mod_name'] as string)
              : 'undefined',
            mod_created_at: value['mod_created_at']
              ? new Date(value['mod_created_at'] as string)
              : new Date(),
            mod_version: value['mod_version'] as string,
            mod_version_id: value['mod_version_id'] as string,
            mod_result_id: value['mod_result_id'] as string,
            accelerate: value['accelerate'] as string,
            labels:
              value['labels'] === undefined
                ? []
                : (value['labels'] as string[]),
            best_threshold:
              value['best_threshold'] === undefined
                ? 0
                : (value['best_threshold'] as number)
          }
        : undefined,
    [value]
  )
  const labelsVal = useMemo(() => {
    if (!value['mod_labels']) {
      return {}
    }
    const res = {} as FilterLabelsType
    Object.keys(value['mod_labels']).forEach((key) => {
      const val = (value['mod_labels'] as Record<string, any>)[key]
      if (
        typeof val['checked'] === 'boolean' &&
        typeof val['label'] === 'string' &&
        typeof val['color'] === 'object' &&
        val['color'].length === 3
      ) {
        res[key] = {
          checked: val['checked'],
          label: val['label'],
          color: val['color']
        }
      }
    })
    return res
  }, [value])

  useEffect(() => {
    setValue({ ...defaultValue })
  }, [defaultValue])

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <Button
            autoFocus
            disabled={readonly === true}
            color="inherit"
            onClick={handleOk}
          >
            {okTitle}
          </Button>
        </Toolbar>
      </AppBar>
      <ModelConfigTool
        modelValue={modelVal}
        filterLabelsValue={labelsVal}
        onChange={handleValueChange}
      />
    </Dialog>
  )
}
