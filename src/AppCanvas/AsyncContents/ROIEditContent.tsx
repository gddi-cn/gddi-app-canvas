import React, { useCallback, useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { Module, PropObject } from '../types'
import { useStore } from '../store/useStore'
import { ROICanvas } from './../Components'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export interface ROIEditContentProps {
  moduleId: number
  defaultRegions: number[][]
}

export const ROIEditContent = ({
  moduleId,
  defaultRegions
}: ROIEditContentProps): JSX.Element => {
  const [tabId, setTabId] = useState<number>(0)
  const { modifyModuleProp, propEditingDisabled, roiImg } = useStore(
    (state) => ({
      modifyModuleProp: state.modifyModuleProp,
      propEditingDisabled: state.propEditingDisabled,
      roiImg: state.roiImg
    }),
    shallow
  )

  const handleTabChange = useCallback((evt, newVal) => {
    setTabId(newVal)
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabId}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="使用摄像头图片" {...a11yProps(0)} />
          <Tab label="使用本地图片" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabId} index={0}>
        <ROICanvas
          imgUrl={roiImg.url}
          imgWidth={roiImg.width}
          imgHeight={roiImg.height}
          defaultRegions={defaultRegions}
        />
      </TabPanel>
      <TabPanel value={tabId} index={1}>
        么么么
      </TabPanel>
    </Box>
  )
}
