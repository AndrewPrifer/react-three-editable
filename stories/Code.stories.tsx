import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Code } from '../src/components/elements';

const meta: Meta = {
  title: 'Code',
  component: Code,
  argTypes: { onClick: { action: 'onClick' } },
  parameters: {
    controls: { expanded: false },
  },
  decorators: [
    (Story) => (
      <div className="bg-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;

const Template: Story = (args) => (
  <div className="p-5">
    Surrounding <Code {...args} /> text
  </div>
);

export const Inline = Template.bind({});
export const Block = Template.bind({});

Inline.args = {
  children: '<Editor />',
};

Block.args = {
  block: true,
  children: '<Canvas>\n  <EditableManager /> {/* !!! */}\n</Canvas>',
};
