import React from 'react';
import { Meta, Story } from '@storybook/react';
import { IconButton } from '../src/components/elements';
import { Gi3DHammer } from 'react-icons/all';

const meta: Meta = {
  title: 'IconButton',
  component: IconButton,
  argTypes: { onClick: { action: 'onClick' } },
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => <IconButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  icon: <Gi3DHammer />,
  label: 'This a label',
};
