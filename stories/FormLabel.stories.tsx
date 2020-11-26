import React from 'react';
import { Meta, Story } from '@storybook/react';
import { FormLabel } from '../src/components/elements';

const meta: Meta = {
  title: 'FormLabel',
  component: FormLabel,
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => <FormLabel {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: "I'm a label",
};
