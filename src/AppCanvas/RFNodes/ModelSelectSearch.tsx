import React, { useMemo, useCallback, useState, useContext } from 'react'
import shallow from 'zustand/shallow'
import { useStore, pageSize } from '../store/useStore'
import { ModelRes } from '../types'
import { SearchBar } from './../Components'
import { debounce } from 'lodash'
import { QueryModelContext } from './NodeContext'
import './ModelSelectSearch.scss'

import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import FolderIcon from '@mui/icons-material/Folder'
import Pagination from '@mui/material/Pagination'
import LinearProgress from '@mui/material/LinearProgress'

export interface ModelSelectSearchProps {
  page: number
  selected: ModelRes | undefined
  onSelect: (val: ModelRes) => void
  onPageChange: (newPage: number) => void
}

export const ModelSelectSearch = ({
  page,
  selected,
  onSelect,
  onPageChange
}: ModelSelectSearchProps): JSX.Element => {
  const { queryModelType } = useContext(QueryModelContext)
  const {
    fetchLoading,
    fetchModelRes,
    searchModelRes,
    fetchModelsWithLabels,
    setFetchLoading
  } = useStore(
    (state) => ({
      fetchLoading: state.fetchLoading,
      fetchModelRes: state.fetchModelRes,
      searchModelRes: state.searchModelRes,
      fetchModelsWithLabels: state.fetchModelsWithLabels,
      setFetchLoading: state.setFetchLoading
    }),
    shallow
  )
  const [searchPageNum, setSearchPageNum] = useState<number>(1)
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false)

  const handlePageChange = useCallback(
    (evt, pageNum) => {
      // setPage(pageNum)
      onPageChange(pageNum)
      setFetchLoading(true)
      fetchModelsWithLabels(pageNum, undefined, queryModelType)
    },
    [fetchModelsWithLabels, setFetchLoading, onPageChange, queryModelType]
  )

  const debouncedHandlePageChange = useMemo(
    () => debounce(handlePageChange, 300),
    [handlePageChange]
  )

  const handleReqSearch = useCallback(
    (searchVal) => {
      // console.log(`req search on value - ${searchVal}`)
      setShowSearchResult(true)
      setSearchPageNum(1)
      setFetchLoading(true)
      fetchModelsWithLabels(1, searchVal, queryModelType)
    },
    [
      setShowSearchResult,
      fetchModelsWithLabels,
      setFetchLoading,
      queryModelType
    ]
  )

  const handleCancelSearch = () => {
    setFetchLoading(false)
    setShowSearchResult(false)
  }

  const dispModels = useMemo(
    () => (showSearchResult ? searchModelRes : fetchModelRes),
    [showSearchResult, fetchModelRes, searchModelRes]
  )

  const LoadingElem = useMemo(
    () => (
      <Box sx={{ width: '100%', flex: 1 }}>
        <LinearProgress sx={{ top: '50%' }} />
      </Box>
    ),
    []
  )

  const ModelListElem = useMemo(
    () => (
      <Box className="list-with-page">
        <Box className="list-area">
          <List dense={true}>
            {dispModels.models.map((modInfo) => {
              const handleClick = () => {
                onSelect(modInfo)
              }
              return (
                <ListItemButton
                  key={`${modInfo.mod_iter_id}}`}
                  selected={
                    selected && selected.mod_iter_id === modInfo.mod_iter_id
                  }
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
        <Box className="pagination-area">
          <Pagination
            page={showSearchResult ? searchPageNum : page}
            count={Math.ceil(dispModels.totalCnt / pageSize)}
            size="small"
            onChange={debouncedHandlePageChange}
          />
          <Box>{`total: ${dispModels.totalCnt}`}</Box>
        </Box>
      </Box>
    ),
    [
      selected,
      dispModels,
      showSearchResult,
      page,
      pageSize,
      debouncedHandlePageChange
    ]
  )

  return (
    <Box className="model-selectsearch-wraper">
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
