import React, { useCallback, useEffect, useMemo, useState } from 'react'

export interface ROICanvasProps {
  imgUrl: string | undefined
  imgWidth: number
  imgHeight: number
  defaultRegions: number[][]
}

export function ROICanvas({
  imgUrl,
  imgWidth,
  imgHeight,
  defaultRegions
}: ROICanvasProps) {
  return <img src={imgUrl} />
}
