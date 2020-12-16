import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Slider } from '../src/components/elements';

const meta: Meta = {
  title: 'Slider',
  component: Slider,
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => <Slider {...args} />;

export const Default = Template.bind({});

Default.args = {};
