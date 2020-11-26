import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Heading } from '../src/components/elements';

const meta: Meta = {
  title: 'Heading',
  component: Heading,
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

const Template: Story = (args) => <Heading {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: "I'm a Heading",
};
