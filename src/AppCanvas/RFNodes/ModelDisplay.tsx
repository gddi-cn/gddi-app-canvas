import React, { useMemo, useCallback, useState, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import { ModelRes } from '../types'
import { ModelSelectSearch } from './ModelSelectSearch'

import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Avatar from '@mui/material/Avatar'
import FolderIcon from '@mui/icons-material/Folder'
import EditIcon from '@mui/icons-material/Edit'
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported'
import { ModelValueType } from './ModelConfigTool'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

export interface ModelDisplayProps {
  model: ModelValueType
  onModelChange?: (newModel: ModelValueType) => void
}

export const ModelDisplay = ({
  model,
  onModelChange
}: ModelDisplayProps): JSX.Element => {
  const { propEditingDisabled, modelListFetcher, labelListFetcher } = useStore(
    (state) => ({
      propEditingDisabled: state.propEditingDisabled,
      modelListFetcher: state.modelListFetcher,
      labelListFetcher: state.labelListFetcher
    }),
    shallow
  )
  const [openD, setOpenD] = useState<boolean>(false)
  const [selectedModel, setSelectedModel] = useState<ModelRes | undefined>(
    model
  )
  const [page, setPage] = useState(1)

  const handleClickEdit = useCallback(() => {
    setOpenD(true)
  }, [setOpenD])

  const handleCloseD = useCallback(() => {
    setOpenD(false)
  }, [])

  const handleConfirmSelect = useCallback(() => {
    setOpenD(false)
    if (onModelChange) {
      onModelChange(selectedModel)
    }
  }, [selectedModel, onModelChange])

  const handleSelectChange = useCallback((val: ModelRes) => {
    setSelectedModel(val)
  }, [])

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
    },
    [setPage]
  )

  const modelCreated = useMemo(() => {
    if (model === undefined) {
      return 'undefined'
    }
    return `${model.mod_created_at.toLocaleDateString()} ${model.mod_created_at.getHours()}:${model.mod_created_at.getMinutes()}:${model.mod_created_at.getSeconds()}`
  }, [model])

  // disable model change when
  // propEditingDisabled set OR fetchers needed are not defined
  const disableEdit = useMemo(
    () =>
      propEditingDisabled ||
      modelListFetcher === undefined ||
      labelListFetcher === undefined,
    [propEditingDisabled, modelListFetcher, labelListFetcher]
  )

  useEffect(() => {
    setSelectedModel(model)
  }, [model])

  return (
    <Box>
      <ListItem
        secondaryAction={
          disableEdit ? null : (
            <IconButton edge="end" aria-label="edit" onClick={handleClickEdit}>
              <EditIcon />
            </IconButton>
          )
        }
      >
        <ListItemAvatar>
          <Avatar>
            {model ? <FolderIcon /> : <BrowserNotSupportedIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${model ? model.mod_name : 'no model selected'}`}
          secondary={
            model ? `ver: ${model.mod_version} created: ${modelCreated}` : null
          }
        />
      </ListItem>
      <BootstrapDialog
        onClose={handleCloseD}
        aria-labelledby="customized-dialog-title"
        open={openD}
      >
        <DialogContent
          dividers
          sx={{ overflowY: 'hidden', width: '90vw', height: '90vh' }}
        >
          <ModelSelectSearch
            page={page}
            selected={selectedModel}
            onSelect={handleSelectChange}
            onPageChange={handlePageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmSelect}>确认</Button>
          <Button color="secondary" onClick={handleCloseD}>
            取消
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  )
}
