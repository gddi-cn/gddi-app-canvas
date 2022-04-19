import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export const TabPanel = ({
  index,
  value,
  children
}: TabPanelProps): JSX.Element => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {/* <Typography variant="body2">{children}</Typography> */}
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  )
}
