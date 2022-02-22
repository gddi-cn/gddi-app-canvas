import React, { useCallback, useEffect, useState } from 'react'

import { ROIEditContent } from './../AsyncContents'

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

export interface ContentProps {
  val: any
  onValChange: (okVal: any) => void
}

export interface ROIDialogProps {
  open: boolean
  title: string
  okTitle: string
  defaultRegions: number[][][]
  onClose: () => void
  onOK: (newRegions: number[][][]) => void
}

export const ROIDialog = ({
  open,
  title,
  okTitle,
  defaultRegions,
  onClose,
  onOK
}: ROIDialogProps): JSX.Element => {
  const [regions, setRegions] = useState<number[][][]>([])

  const handleClose = useCallback(() => {
    setRegions([...defaultRegions])
    onClose()
  }, [defaultRegions])

  const handleOk = useCallback(() => {
    onOK(regions)
  }, [regions])

  const handleRegionsChange = useCallback(
    (newR: number[][][]) => {
      setRegions((old) => [...newR])
    },
    [setRegions]
  )

  const handleAddRegion = useCallback((newEle: number[]) => {
    // setRegions((oldR) => [...oldR, newEle])
  }, [])

  const handlePopRegion = useCallback(() => {
    setRegions((oldR) => oldR.slice(0, oldR.length - 1))
  }, [])

  useEffect(() => {
    setRegions([...defaultRegions])
  }, [defaultRegions])

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
          <Button autoFocus color="inherit" onClick={handleOk}>
            {okTitle}
          </Button>
        </Toolbar>
      </AppBar>
      <ROIEditContent
        regions={regions}
        onRegionsChange={handleRegionsChange}
        addRegion={handleAddRegion}
        popRegion={handlePopRegion}
      />
    </Dialog>
  )
}
