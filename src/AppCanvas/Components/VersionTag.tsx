import React from 'react'

import './VersionTag.scss'

import Box from '@mui/material/Box'

export interface VersionTagProps {
  version: string
}

export const VersionTag = ({ version }: VersionTagProps): JSX.Element => {
  return <Box className="versiontag-wrapper">{`version: ${version}`}</Box>
}
