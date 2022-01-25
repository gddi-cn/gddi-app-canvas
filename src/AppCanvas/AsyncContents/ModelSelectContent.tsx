import React, { useMemo, useCallback, useState, useEffect } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import { ModelRes } from '../types'
import { PageSize } from './constance'
import { debounce } from 'lodash'

import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Checkbox from '@mui/material/Checkbox'
import FolderIcon from '@mui/icons-material/Folder'
import Pagination from '@mui/material/Pagination'

import './ModelSelectContent.scss'

export interface ModelSelectContentProps {
  selectedModId: string
  checkedLabels: string[]
  onSelect: (selectedMod: ModelRes) => void
  onCheckedLabelsChange: (checkedLabels: string[]) => void
}

export const ModelSelectContent = ({
  selectedModId,
  checkedLabels,
  onSelect,
  onCheckedLabelsChange
}: ModelSelectContentProps): JSX.Element => {
  // const [modelListRes, setModelListRes] = useState<FetchModelRes>({
  //   models: [],
  //   totalCnt: 0
  // })
  const [page, setPage] = useState<number>(1)
  const {
    modelListFetcher,
    fetchModelRes,
    setFetchModelRes,
    labelListFetcher,
    fetchLabelRes,
    setFetchLabelRes
  } = useStore(
    (state) => ({
      modelListFetcher: state.modelListFetcher,
      fetchModelRes: state.fetchModelRes,
      setFetchModelRes: state.setFetchModelRes,
      labelListFetcher: state.labelListFetcher,
      fetchLabelRes: state.fetchLabelRes,
      setFetchLabelRes: state.setFetchLabelRes
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

  const LabelList = useMemo(() => {
    return fetchLabelRes.labels.map((label) => {
      const handleToggle = () => {
        const currentIndex = checkedLabels.indexOf(label)
        const newChecked = [...checkedLabels]

        if (currentIndex === -1) {
          newChecked.push(label)
        } else {
          newChecked.splice(currentIndex, 1)
        }

        onCheckedLabelsChange(newChecked)
      }
      return (
        <ListItem key={label} disablePadding>
          <ListItemButton role={undefined} onClick={handleToggle} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checkedLabels.indexOf(label) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': label }}
              />
            </ListItemIcon>
            <ListItemText id={label} primary={`${label}`} />
          </ListItemButton>
        </ListItem>
      )
    })
  }, [fetchLabelRes.labels, checkedLabels])

  useEffect(() => {
    if (labelListFetcher && selectedModId) {
      labelListFetcher(selectedModId)
        .then((res) => {
          setFetchLabelRes(res)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [labelListFetcher, selectedModId])

  if (fetchModelRes === undefined) {
    return <Box>🐸 呱~</Box>
  }
  //TODO: style pagenation and totalCnt
  return (
    <Box className="model-select-content">
      <Box className="model-and-labels">
        <Box className="model-list">
          <List dense={true}>
            {fetchModelRes.models.map((modInfo) => {
              const handleClick = () => {
                onSelect(modInfo)
                onCheckedLabelsChange([])
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
                    secondary={`${modInfo.mod_created_at.toLocaleDateString()} ${modInfo.mod_created_at.getHours()}:${modInfo.mod_created_at.getMinutes()}:${modInfo.mod_created_at.getSeconds()}`}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Box>
        <Box className="label-list">
          {fetchLabelRes.labels.length >= 0 ? (
            LabelList
          ) : (
            <Box>该模型无labels可选</Box>
          )}
        </Box>
      </Box>
      <Box className="pagination-area">
        <Pagination
          page={page}
          count={Math.ceil(fetchModelRes.totalCnt / PageSize)}
          size="small"
          onChange={debouncedHandlePageChange}
        />
        <Box>{`total: ${fetchModelRes.totalCnt}`}</Box>
      </Box>
    </Box>
  )
}
