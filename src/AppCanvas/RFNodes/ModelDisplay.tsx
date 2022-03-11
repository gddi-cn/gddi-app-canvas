import React, { useMemo, useCallback, useState, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import { ModelRes } from '../types'
import { ModelSelectSearch } from './ModelSelectSearch'

import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Avatar from '@mui/material/Avatar'
import FolderIcon from '@mui/icons-material/Folder'
import EditIcon from '@mui/icons-material/Edit'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

export interface ModelDisplayProps {
  model: ModelRes
  onModelChange?: (newModel: ModelRes) => void
}

export const ModelDisplay = ({
  model,
  onModelChange
}: ModelDisplayProps): JSX.Element => {
  const {
    propEditingDisabled,
    fetchModelsWithLabels,
    setFetchLoading,
    modelListFetcher,
    labelListFetcher
  } = useStore(
    (state) => ({
      propEditingDisabled: state.propEditingDisabled,
      fetchModelsWithLabels: state.fetchModelsWithLabels,
      setFetchLoading: state.setFetchLoading,
      modelListFetcher: state.modelListFetcher,
      labelListFetcher: state.labelListFetcher
    }),
    shallow
  )
  const [openD, setOpenD] = useState<boolean>(false)
  const [selectedModel, setSelectedModel] = useState<ModelRes>(model)

  const handleClickEdit = useCallback(() => {
    setOpenD(true)
  }, [setOpenD])

  const handleCloseD = useCallback(() => {
    setOpenD(false)
  }, [])

  const handleSaveSelect = useCallback(() => {
    console.log(`save selected model`)
    setOpenD(false)
    if (onModelChange) {
      onModelChange(selectedModel)
    }
  }, [selectedModel, onModelChange])

  const handleSelectChange = useCallback((val: ModelRes) => {
    setSelectedModel(val)
  }, [])

  const modelCreated = useMemo(() => {
    return `${model.mod_created_at.toLocaleDateString()} ${model.mod_created_at.getHours()}:${model.mod_created_at.getMinutes()}:${model.mod_created_at.getSeconds()}`
  }, [model.mod_created_at])

  const disableEdit = useMemo(
    () => propEditingDisabled || modelListFetcher === undefined,
    [propEditingDisabled, modelListFetcher]
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
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${model.mod_name}`}
          secondary={`ver: ${model.mod_version} created: ${modelCreated}`}
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
            selected={selectedModel}
            onSelect={handleSelectChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveSelect}>确认</Button>
          <Button color="secondary" onClick={handleCloseD}>
            取消
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  )
}
