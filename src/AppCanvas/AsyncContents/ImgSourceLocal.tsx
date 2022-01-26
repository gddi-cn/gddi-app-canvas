import React, { useCallback, useState } from 'react'
import shallow from 'zustand/shallow'
import ImageUploading, {
  ImageListType,
  ImageType
} from 'react-images-uploading'
import { useStore } from '../store/useStore'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload'

export const ImgSourceLocal = (): JSX.Element => {
  const [images, setImages] = useState<ImageType[]>([])
  const [imgWH, setImgWH] = useState<number[]>([0, 0])

  const { setROIImg } = useStore(
    (state) => ({
      setROIImg: state.setROIImg
    }),
    shallow
  )

  const handleUploadChange = useCallback(
    (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
      setImages(imageList)
    },
    []
  )

  const handleImgLoad = useCallback(
    (evt) => {
      setImgWH([evt.target.width, evt.target.height])
    },
    [setImgWH]
  )

  const handleUseImageClick = useCallback(() => {
    if (images.length > 0 && images[0].dataURL) {
      const url = images[0].dataURL as string
      const [width, height] = imgWH
      setROIImg(url, width, height)
    }
  }, [images[0], imgWH])

  return (
    <Box>
      <ImageUploading
        multiple
        value={images}
        onChange={handleUploadChange}
        maxNumber={1}
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          isDragging,
          dragProps
        }) => {
          const handleUploadClick = () => {
            if (imageList.length === 0) {
              onImageUpload()
            } else {
              onImageUpdate(0)
            }
          }
          return (
            <Box className="upload__image-wrapper">
              <Button
                style={isDragging ? { color: 'red' } : undefined}
                onClick={handleUploadClick}
                variant="contained"
                startIcon={<FileUploadIcon />}
                {...dragProps}
              >
                upload
              </Button>
              {imageList.length > 0 && (
                <div className="image-item">
                  <img
                    hidden={true}
                    src={imageList[0].dataURL}
                    alt=""
                    onLoad={handleImgLoad}
                  />
                  <div>{imageList[0].file?.name}</div>
                  <Box>{`${imgWH[0]} x ${imgWH[1]}`}</Box>
                  <Button onClick={handleUseImageClick} variant="contained">
                    使用
                  </Button>
                </div>
              )}
            </Box>
          )
        }}
      </ImageUploading>
    </Box>
  )
}
