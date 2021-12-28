import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Story } from '@storybook/react'
import { Composer, ComposerProps } from '../components/Composer'

export default {
  title: 'Components/Composer',
  component: Composer,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta

// Create a master template for mapping args to render the Button component
const Template: Story<ComposerProps> = (args) => <Composer {...args} />

// Reuse that template for creating different stories
export const Primary = Template.bind({})
Primary.args = { width: 600, height: 500 }

export const Secondary = Template.bind({})
Secondary.args = { ...Primary.args }
