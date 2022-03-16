import React, { useMemo } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '../store/useStore'
import { FilterLabelsValueType } from '../types'
import { RgbColor, HexColorInput } from 'react-colorful'
import produce from 'immer'
import { PopoverColorPicker } from './../Components'
import { stringToHex, rgbToHex, hexToRgb } from './../helpers'

import './FilterLabelsDisplay.scss'

import Box from '@mui/material/Box'
import { alpha } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'

interface Data {
  labelKey: string
  checked: boolean
  map_label: string
  color: [number, number, number]
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'labelKey',
    numeric: false,
    disablePadding: true,
    label: 'Label'
  },
  {
    id: 'map_label',
    numeric: false,
    disablePadding: false,
    label: 'Map Label'
  },
  {
    id: 'color',
    numeric: false,
    disablePadding: false,
    label: 'Display Color'
  }
]

interface EnhancedTableProps {
  numSelected: number
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowCount: number
  checkDisabled?: boolean
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount, checkDisabled } = props

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            disabled={checkDisabled}
            inputProps={{
              'aria-label': 'select all labels'
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
  deleteDisabled?: boolean
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, deleteDisabled } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            )
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          模型标签（Filter Labels）
        </Typography>
      )}
      {numSelected > 0 && !deleteDisabled ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  )
}

export interface FilterLabelsDisplayProps {
  labels: FilterLabelsValueType
  onLabelsChange?: (newLabels: FilterLabelsValueType) => void
}

export const FilterLabelsDisplay = ({
  labels,
  onLabelsChange
}: FilterLabelsDisplayProps): JSX.Element => {
  const { propEditingDisabled } = useStore(
    (state) => ({
      propEditingDisabled: state.propEditingDisabled
    }),
    shallow
  )
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const isSelected = (name: string) => selected.indexOf(name) !== -1
  const rows = useMemo(
    () =>
      Object.keys(labels).map(
        (labelKey) =>
          ({
            labelKey,
            ...labels[labelKey]
          } as Data)
      ),
    [labels]
  )

  const handleCheckboxClick = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.labelKey)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }
  console.log(labels, 211)

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          deleteDisabled={propEditingDisabled}
        />
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table
            sx={{ minWidth: 460 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
              checkDisabled={propEditingDisabled}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.labelKey)
                const labelId = `enhanced-table-checkbox-${index}`
                const rgbColor: RgbColor = {
                  r: row.color[0],
                  g: row.color[1],
                  b: row.color[2]
                }
                const hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b)
                const randomColorHex = stringToHex(row.map_label)
                const handleColorChange = (newColor: RgbColor) => {
                  const newLabels = produce(labels, (draft) => {
                    draft[row.labelKey] = {
                      ...labels[row.labelKey],
                      color: [newColor.r, newColor.g, newColor.b]
                    }
                  })
                  if (onLabelsChange) {
                    onLabelsChange(newLabels)
                  }
                }
                const handleHexChange = (newHex: string) => {
                  const newColor = hexToRgb(newHex)
                  if (onLabelsChange && newColor !== null) {
                    const newLabels = produce(labels, (draft) => {
                      draft[row.labelKey] = {
                        ...labels[row.labelKey],
                        color: [newColor.r, newColor.g, newColor.b]
                      }
                    })
                    onLabelsChange(newLabels)
                  }
                }

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.labelKey}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                        disabled={propEditingDisabled}
                        onClick={(event) =>
                          handleCheckboxClick(event, row.labelKey)
                        }
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={`${labelId}-labelKey`}
                      scope="row"
                      padding="none"
                    >
                      {row.labelKey}
                    </TableCell>
                    <TableCell id={`${labelId}-mapLabel`} align="left">
                      {row.map_label}
                    </TableCell>
                    <TableCell id={`${labelId}-color`} align="left">
                      <Box className="tablecell-color">
                        <PopoverColorPicker
                          color={rgbColor}
                          onChange={handleColorChange}
                        />
                        <HexColorInput
                          className="hex-color-input"
                          color={hexColor}
                          onChange={handleHexChange}
                        />
                        {randomColorHex}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
