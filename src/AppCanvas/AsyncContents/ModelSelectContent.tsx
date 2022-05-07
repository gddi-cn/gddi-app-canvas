// [Deprecated] currently not in use

import React, { useMemo, useCallback, useState } from 'react'
import shallow from 'zustand/shallow'
import { useStore, pageSize } from '../store/useStore'
import { FetchModelRes, ModelRes } from '../types'
import { debounce } from 'lodash'
import { SearchBar } from './../Components'

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
import LinearProgress from '@mui/material/LinearProgress'

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
  const [page, setPage] = useState<number>(1)
  const {
    fetchModelRes,
    fetchLoading,
    searchModelRes,
    fetchModelsWithLabels,
    setFetchLoading
  } = useStore(
    (state) => ({
      fetchModelRes: state.fetchModelRes,
      fetchLoading: state.fetchLoading,
      searchModelRes: state.searchModelRes,
      fetchModelsWithLabels: state.fetchModelsWithLabels,
      setFetchLoading: state.setFetchLoading
    }),
    shallow
  )
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false)

  const handlePageChange = useCallback(
    (evt, pageNum) => {
      setPage(pageNum)
      setFetchLoading(true)
      fetchModelsWithLabels(pageNum)
    },
    [fetchModelsWithLabels, setFetchLoading]
  )

  const debouncedHandlePageChange = useMemo(
    () => debounce(handlePageChange, 300),
    [handlePageChange]
  )

  const handleReqSearch = useCallback(
    (searchVal) => {
      // console.log(`req search on value - ${searchVal}`)
      setShowSearchResult(true)
      setPage(1)
      setFetchLoading(true)
      fetchModelsWithLabels(1, searchVal)
    },
    [setShowSearchResult, fetchModelsWithLabels, setFetchLoading, setPage]
  )

  const handleCancelSearch = () => {
    // console.log(`cancel search....`)
    setPage(1)
    setFetchLoading(false)
    setShowSearchResult(false)
  }

  const dispModels: FetchModelRes = useMemo(
    () => (showSearchResult ? searchModelRes : fetchModelRes),
    [showSearchResult, fetchModelRes, searchModelRes]
  )
  // const dispLabelMemo = useMemo(
  //   () => (showSearchResult ? searchModelResLabelMemo : fetchLabelMemo),
  //   [showSearchResult, searchModelResLabelMemo, fetchLabelMemo]
  // )
  const dispLabelMemo = useMemo(() => {
    const res: Record<string, string[]> = {}
    dispModels.models.forEach((mod) => {
      res[mod.mod_iter_id] = mod.labels
    })
    return res
  }, [dispModels])

  const LabelList = useMemo(() => {
    if (dispLabelMemo[selectedModId] === undefined) {
      return null
    }
    return dispLabelMemo[selectedModId].map((label) => {
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
  }, [dispLabelMemo, selectedModId, checkedLabels, onCheckedLabelsChange])

  const LoadingElem = useMemo(
    () => (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    ),
    []
  )

  const ModelListElem = useMemo(
    () => (
      <Box className="model-list-wrapper">
        <Box className="model-and-labels">
          <Box className="model-list">
            <List dense={true}>
              {dispModels.models.map((modInfo) => {
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
            {dispLabelMemo[selectedModId] === undefined ||
            dispLabelMemo[selectedModId].length >= 0 ? (
              LabelList
            ) : (
              <Box>该模型无labels可选</Box>
            )}
          </Box>
        </Box>
        <Box className="pagination-area">
          <Pagination
            page={page}
            count={Math.ceil(dispModels.totalCnt / pageSize)}
            size="small"
            onChange={debouncedHandlePageChange}
          />
          <Box>{`total: ${dispModels.totalCnt}`}</Box>
        </Box>
      </Box>
    ),
    [
      selectedModId,
      dispModels,
      dispLabelMemo,
      LabelList,
      page,
      debouncedHandlePageChange,
      onCheckedLabelsChange,
      onSelect
    ]
  )

  return (
    <Box className="model-select-content">
      <Box className="searchbar-wrapper">
        <SearchBar
          disabled={fetchLoading}
          onRequestSearch={handleReqSearch}
          onCancelSearch={handleCancelSearch}
        />
      </Box>
      {fetchLoading ? LoadingElem : ModelListElem}
    </Box>
  )
}
