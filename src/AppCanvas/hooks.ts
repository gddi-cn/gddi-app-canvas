import React, { useEffect, useState } from 'react'

export const useOutsideClick = (ref: React.RefObject<any>): boolean => {
  const [isClickOutside, setIsClickOutside] = useState<boolean>(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsClickOutside(true)
      } else {
        setIsClickOutside(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref])
  return isClickOutside
}
