import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button } from '../src/components/elements';

const meta: Meta = {
  title: 'Button',
  component: Button,
  argTypes: { onClick: { action: 'onClick' } },
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: 'Button',
};
