import React, { useCallback, useState } from 'react'
// eslint-disable-next-line max-len
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone'
import KeyboardArrowUpTwoToneIcon from '@mui/icons-material/KeyboardArrowUpTwoTone'
import './CollapseContainer.scss'

export interface CollapseContainerProps {
  title: string
  children?: React.ReactNode
}

export const CollapseContainer = ({
  title,
  children
}: CollapseContainerProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  const handleHeaderClick = useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  return (
    <div>
      <div
        className="gddi-aiappcanvas__collapse-header"
        role="button"
        tabIndex={-1}
        onClick={handleHeaderClick}
        onKeyDown={handleHeaderClick}
      >
        <span>{title}</span>
        {open ? (
          <KeyboardArrowUpTwoToneIcon />
        ) : (
          <KeyboardArrowDownTwoToneIcon />
        )}
      </div>
      <div hidden={!open} className="gddi-aiappcanvas__collapse-body">
        {children}
      </div>
    </div>
  )
}
