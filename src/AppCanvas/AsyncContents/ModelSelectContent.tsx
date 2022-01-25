import React, { useMemo, useCallback, useState } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import { ModelRes } from '../types'
import { PageSize } from './constance'
import { debounce } from 'lodash'

import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import FolderIcon from '@mui/icons-material/Folder'
import Pagination from '@mui/material/Pagination'

import './ModelSelectContent.scss'

export interface ModelSelectContentProps {
  selectedModId: string
  onSelect: (selectedMod: ModelRes) => void
}

export const ModelSelectContent = ({
  selectedModId,
  onSelect
}: ModelSelectContentProps): JSX.Element => {
  // const [modelListRes, setModelListRes] = useState<FetchModelRes>({
  //   models: [],
  //   totalCnt: 0
  // })
  const [page, setPage] = useState<number>(1)
  const { modelListFetcher, fetchModelRes, setFetchModelRes } = useStore(
    (state) => ({
      modelListFetcher: state.modelListFetcher,
      fetchModelRes: state.fetchModelRes,
      setFetchModelRes: state.setFetchModelRes
    }),
    shallow
  )

  const handlePageChange = useCallback(
    (evt, pageNum) => {
      setPage(pageNum)
      if (modelListFetcher) {
        modelListFetcher(pageNum - 1, PageSize)
          .then((res) => {
            setFetchModelRes(res)
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
    [modelListFetcher]
  )
  const debouncedHandlePageChange = useMemo(
    () => debounce(handlePageChange, 300),
    [handlePageChange]
  )

  if (fetchModelRes === undefined) {
    return <Box>🐸 呱~</Box>
  }
  return (
    <Box className="model-select-content">
      <Box className="model-list">
        <List dense={true}>
          {fetchModelRes.models.map((modInfo) => {
            const handleClick = () => {
              onSelect(modInfo)
            }
            return (
              <ListItemButton
                key={`${modInfo.mod_id}}`}
                selected={selectedModId === modInfo.mod_result_id}
                onClick={handleClick}
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${modInfo.mod_name} - v${modInfo.mod_version}`}
                  secondary={modInfo.mod_created_at.toString()}
                />
              </ListItemButton>
            )
          })}
        </List>
      </Box>
      <Pagination
        page={page}
        count={Math.ceil(fetchModelRes.totalCnt / PageSize)}
        size="small"
        onChange={debouncedHandlePageChange}
      />
      <Box>{`total cnt: ${fetchModelRes.totalCnt}`}</Box>
    </Box>
  )
}
