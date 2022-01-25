import React, { useMemo, useCallback, useState } from 'react'
import shallow from 'zustand/shallow'
import { useStore, pageSize } from '../store/useStore'
import { ModelRes } from '../types'
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
import LinearProgress from '@mui/material/LinearProgress'

import './ModelSelectContent.scss'

export interface ModelSelectContentProps {
  disable?: boolean
  selectedModId: string
  checkedLabels: string[]
  onSelect: (selectedMod: ModelRes) => void
  onCheckedLabelsChange: (checkedLabels: string[]) => void
}

export const ModelSelectContent = ({
  disable,
  selectedModId,
  checkedLabels,
  onSelect,
  onCheckedLabelsChange
}: ModelSelectContentProps): JSX.Element => {
  const [page, setPage] = useState<number>(1)
  const {
    fetchModelRes,
    fetchLabelMemo,
    fetchLoading,
    fetchModelsWithLabels,
    setFetchLoading
  } = useStore(
    (state) => ({
      fetchModelRes: state.fetchModelRes,
      fetchLabelMemo: state.fetchLabelMemo,
      fetchLoading: state.fetchLoading,
      fetchModelsWithLabels: state.fetchModelsWithLabels,
      setFetchLoading: state.setFetchLoading
    }),
    shallow
  )

  const handlePageChange = useCallback(
    (evt, pageNum) => {
      setPage(pageNum)
      setFetchLoading(true)
      fetchModelsWithLabels(pageNum - 1)
    },
    [fetchModelsWithLabels, setFetchLoading]
  )

  const debouncedHandlePageChange = useMemo(
    () => debounce(handlePageChange, 300),
    [handlePageChange]
  )

  const LabelList = useMemo(() => {
    if (fetchLabelMemo[selectedModId] === undefined) {
      return null
    }
    return fetchLabelMemo[selectedModId].map((label) => {
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
          <ListItemButton
            disabled={disable}
            role={undefined}
            onClick={handleToggle}
            dense
          >
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
  }, [fetchLabelMemo[selectedModId], checkedLabels])

  if (fetchModelRes === undefined) {
    return <Box>🐸 呱~</Box>
  }
  //TODO: style pagenation and totalCnt
  return (
    <Box className="model-select-content">
      <Box className="model-and-labels">
        {fetchLoading ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ) : (
          <>
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
                      disabled={disable}
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
              {fetchLabelMemo[selectedModId] === undefined ||
              fetchLabelMemo[selectedModId].length >= 0 ? (
                LabelList
              ) : (
                <Box>该模型无labels可选</Box>
              )}
            </Box>
          </>
        )}
      </Box>
      <Box className="pagination-area">
        <Pagination
          page={page}
          count={Math.ceil(fetchModelRes.totalCnt / pageSize)}
          size="small"
          onChange={debouncedHandlePageChange}
        />
        <Box>{`total: ${fetchModelRes.totalCnt}`}</Box>
      </Box>
    </Box>
  )
}