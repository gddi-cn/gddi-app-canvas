import React, { useMemo } from 'react'
import { ModelRes } from '../types'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import FolderIcon from '@mui/icons-material/Folder'
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported'

export interface ModelListItemContentProps {
  modelInfo?: ModelRes
}

export const ModelListItemContent = ({
  modelInfo
}: ModelListItemContentProps): JSX.Element => {
  const primaryText = useMemo(
    () =>
      modelInfo && modelInfo.mod_name && modelInfo.mod_version
        ? `${modelInfo.mod_name} - v${modelInfo.mod_version}`
        : '未选择模型',
    [modelInfo]
  )
  const secondaryElem = useMemo(() => {
    if (
      modelInfo === undefined ||
      modelInfo.mod_name === undefined ||
      modelInfo.mod_version === undefined
    ) {
      return undefined
    }
    const modelCreatedStr = `${modelInfo.mod_created_at.toLocaleDateString()} ${modelInfo.mod_created_at.getHours()}:${modelInfo.mod_created_at.getMinutes()}:${modelInfo.mod_created_at.getSeconds()}`
    const accIdentifier = modelInfo.accelerate
      ? modelInfo.accelerate
      : 'undefined accelerator'
    let chipColor = '#1c4cad'
    if (accIdentifier.toLocaleLowerCase().includes('npu')) {
      chipColor = '#9c1cad'
    }
    if (accIdentifier.toLocaleLowerCase().includes('gpu')) {
      chipColor = '#1cad7a'
    }
    return (
      <Box
        component="span"
        sx={{
          display: 'flex',
          alignItems: 'flexEnd'
        }}
      >
        <Box component="span">{modelCreatedStr}</Box>
        <Chip
          component="span"
          sx={{
            marginLeft: '0.8rem',
            fontSize: '0.65rem',
            height: '20px',
            color: chipColor,
            borderColor: chipColor
            // position: 'absolute',
            // left: '13rem',
            // top: '18px'
          }}
          label={accIdentifier}
          size="small"
          variant="outlined"
        />
      </Box>
    )
  }, [modelInfo])

  return (
    <>
      <ListItemAvatar>
        <Avatar>
          {modelInfo ? <FolderIcon /> : <BrowserNotSupportedIcon />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={primaryText} secondary={secondaryElem} />
    </>
  )
}
