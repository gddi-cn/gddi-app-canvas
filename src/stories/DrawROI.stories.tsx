import React, { useState } from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import { DrawROI, DrawROIProps, DrawPolygonControl } from '../AppCanvas'

export default {
  title: 'Example/DrawROI',
  component: DrawROI
} as Meta

const imgUrl = 'https://placekitten.com/1080/720'
const regions0 = [
  [
    [0.14703369140625, 0.16278211805555556],
    [0.07437744140625, 0.2613932291666667],
    [0.19468994140625, 0.36139322916666666],
    [0.24312744140625, 0.25028211805555556],
    [0.22359619140625, 0.16417100694444445],
    [0.17906494140625, 0.25028211805555556]
  ],
  [
    [0.30484619140625, 0.15861545138888888],
    [0.21890869140625, 0.3308376736111111],
    [0.29547119140625, 0.36278211805555555],
    [0.37125244140625, 0.36278211805555555],
    [0.37047119140625, 0.2613932291666667]
  ]
]

// Create a master template for mapping args to render the component
const Template: Story<DrawROIProps> = () => {
  const [roi, setROI] = useState<number[][][]>(regions0)

  const handleRegionsChange = (newVal) => {
    console.log(`🍑 ROI changes`)
    console.log(newVal)
    // setROI([...newVal])
  }

  return (
    <>
      <div style={{ width: '1000px', height: '500px' }}>
        <DrawROI
          imgUrl={imgUrl}
          defaultROIs={roi}
          onROIsChange={handleRegionsChange}
        >
          <DrawPolygonControl />
        </DrawROI>
      </div>
    </>
  )
}

// Reuse that template for creating different stories
export const DrawROIUsage = Template.bind({})
DrawROIUsage.args = {} as DrawROIProps

DrawROIUsage.storyName = 'Draw ROI'
