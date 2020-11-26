import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Input } from '../src/components/elements';

const meta: Meta = {
  title: 'Input',
  component: Input,
  argTypes: { onChange: { action: 'onChange' } },
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => <Input {...args} />;

export const Default = Template.bind({});

Default.args = {};
