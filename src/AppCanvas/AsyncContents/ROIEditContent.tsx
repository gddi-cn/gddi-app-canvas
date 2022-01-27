import React, { useCallback, useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import { ROICanvas } from './../Components'
import { ImgSourceCam } from './ImgSourceCam'
import { ImgSourceLocal } from './ImgSourceLocal'
import './ROIEditContent.scss'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
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
      className="tabpanel"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  // [topx, topy, width, heigh] all in percentage
  regions: number[][]
  onRegionsChange: (newRegions: number[][]) => void
}

export const ROIEditContent = ({
  regions,
  onRegionsChange
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

  const handleRegionsChange = useCallback((r: number[][]) => {
    onRegionsChange(r)
  }, [])

  return (
    <Box className="editor-content">
      <Box className="tab-area">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabId}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="图片源：摄像头" {...a11yProps(0)} />
            <Tab label="图片源：本地上传" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={tabId} index={0}>
          <ImgSourceCam />
        </TabPanel>
        <TabPanel value={tabId} index={1}>
          <ImgSourceLocal />
        </TabPanel>
      </Box>
      <Box className="canvas-and-control-area">
        <Box className="canvas-area">
          <ROICanvas
            imgUrl={roiImg.url}
            regions={regions}
            onRegionsChange={handleRegionsChange}
          />
        </Box>
      </Box>
    </Box>
  )
}
