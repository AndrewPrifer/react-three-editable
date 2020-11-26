import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Legend } from '../src/components/elements';

const meta: Meta = {
  title: 'Legend',
  component: Legend,
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => <Legend {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: "I'm a legend",
};
