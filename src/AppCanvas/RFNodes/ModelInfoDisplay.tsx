import React, { useMemo } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'

const body2Styles: React.CSSProperties = {
  marginBottom: '1.5rem',
  marginLeft: '0.6rem'
}

export interface ModelInfoDisplayProps {
  modelName: string
  modelVersion: string
  modelCreated: string
  labels: string[]
}

export const ModelInfoDisplay = ({
  modelName,
  modelVersion,
  modelCreated,
  labels
}: ModelInfoDisplayProps): JSX.Element => {
  const createdDate = useMemo(() => {
    return new Date(modelCreated)
  }, [modelCreated])

  const createdFormatted = useMemo(() => {
    return `${createdDate.toLocaleDateString()} ${createdDate.getHours()}:${createdDate.getMinutes()}:${createdDate.getSeconds()}`
  }, [createdDate])

  return (
    <Box className="model-select-content">
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom component="div">
          模型名称
        </Typography>
        <Typography
          style={body2Styles}
          variant="body2"
          gutterBottom
          component="div"
        >
          {`${modelName}`}
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
          模型版本
        </Typography>
        <Typography
          style={body2Styles}
          variant="body2"
          gutterBottom
          component="div"
        >
          {`${modelVersion}`}
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
          模型创建时间
        </Typography>
        <Typography
          style={body2Styles}
          variant="body2"
          gutterBottom
          component="div"
        >
          {`${createdFormatted}`}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom component="div">
          选择的标签 (label selected)
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 2 }}
        >
          {labels.map((label) => (
            <Chip key={label} label={label} />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
