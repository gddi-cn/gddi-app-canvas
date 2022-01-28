import React, { useCallback, useState } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import './ImgSourceCam.scss'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

export const ImgSourceCam = (): JSX.Element => {
  const [radioVal, setRadioVal] = useState<string>('720')

  const { roiImgFetcher, setROIImg, setFetchROIImgLoading, fetchROIImgURL } =
    useStore(
      (state) => ({
        roiImgFetcher: state.roiImgFetcher,
        setROIImg: state.setROIImg,
        setFetchROIImgLoading: state.setFetchROIImgLoading,
        fetchROIImgURL: state.fetchROIImgURL
      }),
      shallow
    )

  const handleRadioValChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const radioVal = (e.target as HTMLInputElement).value
      setRadioVal(radioVal)
      let w: number | undefined
      let h: number | undefined
      if (radioVal === '720') {
        w = 1280
        h = 720
      } else if (radioVal === '1080') {
        w = 1920
        h = 1080
      } else if (radioVal === '4k') {
        w = 3840
        h = 2160
      } else if (radioVal === '8k') {
        w = 7680
        h = 4320
      }
      setROIImg(undefined, w, h)
    },
    []
  )

  const handleUseImageClick = useCallback(() => {
    setFetchROIImgLoading(true)
    fetchROIImgURL()
  }, [fetchROIImgURL])

  return (
    <Box className="content-wrapper">
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">分辨率</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={radioVal}
          onChange={handleRadioValChange}
        >
          <FormControlLabel
            value="720"
            control={<Radio />}
            label="1280 x 720"
          />
          <FormControlLabel
            value="1080"
            control={<Radio />}
            label="1920 x 1080"
          />
          <FormControlLabel
            value="4k"
            control={<Radio />}
            label="3840 x 2160"
          />
          <FormControlLabel
            value="8k"
            control={<Radio />}
            label="7680 x 4320"
          />
        </RadioGroup>
      </FormControl>
      <Button
        disabled={roiImgFetcher === undefined}
        onClick={handleUseImageClick}
        variant="contained"
      >
        使用
      </Button>
    </Box>
  )
}
