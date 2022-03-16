import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RgbColorPicker, RgbColor } from 'react-colorful'
import './PopoverColorPicker.scss'

import { useOutsideClick2 } from './../hooks'

export interface PopoverColorPickerProps {
  color: RgbColor
  onChange: (newColor: RgbColor) => void
}

export const PopoverColorPicker = ({
  color,
  onChange
}: PopoverColorPickerProps): JSX.Element => {
  const [colorTmp, setColorTmp] = useState<RgbColor>(color)
  const popover = useRef<HTMLDivElement | null>(null)
  const [isOpen, toggle] = useState(false)

  const close = useCallback(() => {
    toggle(false)
    if (
      colorTmp.r !== color.r ||
      colorTmp.g !== color.g ||
      colorTmp.b !== color.b
    ) {
      onChange(colorTmp)
    }
  }, [colorTmp])

  const handlePickerChange = useCallback((newColor) => {
    setColorTmp(newColor)
  }, [])

  useOutsideClick2(popover, close)

  useEffect(() => {
    setColorTmp(color)
  }, [color])

  return (
    <div className="picker">
      <div
        className="swatch"
        style={{ backgroundColor: `rgb(${color.r} ${color.g} ${color.b})` }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div className="popover" ref={popover}>
          <RgbColorPicker color={colorTmp} onChange={handlePickerChange} />
        </div>
      )}
    </div>
  )
}
