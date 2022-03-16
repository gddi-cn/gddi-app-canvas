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

// Improved version of https://usehooks.com/useOnClickOutside/
type HandlerType = (event: MouseEvent | TouchEvent) => void
export const useOutsideClick2 = (
  ref: React.RefObject<any>,
  handler: HandlerType
) => {
  useEffect(() => {
    let startedInside = false
    let startedWhenMounted = false

    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) return

      handler(event)
    }

    const validateEventStart = (event: MouseEvent | TouchEvent) => {
      startedWhenMounted = ref.current
      startedInside = ref.current && ref.current.contains(event.target)
    }

    document.addEventListener('mousedown', validateEventStart)
    document.addEventListener('touchstart', validateEventStart)
    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('mousedown', validateEventStart)
      document.removeEventListener('touchstart', validateEventStart)
      document.removeEventListener('click', listener)
    }
  }, [ref, handler])
}
