import React, { useCallback, useState } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'

interface FormElements extends HTMLFormControlsCollection {
  searchValue: HTMLInputElement
}
interface SearchFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

export interface SearchBarProps {
  disabled?: boolean
  onRequestSearch?: (value: string) => void
  onCancelSearch?: () => void
}

export const SearchBar = ({
  disabled,
  onRequestSearch,
  onCancelSearch
}: SearchBarProps): JSX.Element => {
  const [value, setValue] = useState<string>('')

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(event.target.value)
    },
    []
  )

  const handleCancelClick = useCallback(() => {
    setValue('')
    if (onCancelSearch) {
      onCancelSearch()
    }
  }, [])

  const handleSubmitClick = useCallback(
    (event: React.FormEvent<SearchFormElement>) => {
      event.preventDefault()
      const form = event.currentTarget
      if (onRequestSearch) {
        onRequestSearch(form.elements.searchValue.value)
      }
    },
    []
  )

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}
      onSubmit={handleSubmitClick}
    >
      <IconButton
        disabled={disabled}
        type="submit"
        sx={{ p: '10px' }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        id="searchValue"
        disabled={disabled}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search By Model Name"
        inputProps={{ 'aria-label': 'search model name' }}
        value={value}
        onChange={handleInputChange}
      />
      {value === '' ? null : (
        <IconButton
          sx={{ p: '10px' }}
          aria-label="cancel"
          onClick={handleCancelClick}
        >
          <CancelIcon />
        </IconButton>
      )}
    </Paper>
  )
}
