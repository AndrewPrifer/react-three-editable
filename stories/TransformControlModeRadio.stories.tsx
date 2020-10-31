import React from 'react';
import { Meta, Story } from '@storybook/react';
import TransformControlsModeRadio from '../src/components/TransformControlModeRadio';
import { ChakraProvider } from '@chakra-ui/core';

const meta: Meta = {
  title: 'TransformControlsModeRadio',
  component: TransformControlsModeRadio,
  argTypes: { onChange: { action: 'onChange' } },
  parameters: {
    controls: { expanded: false },
  },
  decorators: [
    (Story) => (
      <ChakraProvider>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default meta;

const Template: Story = (args) => (
  <>
    <TransformControlsModeRadio {...args} />
  </>
);

export const Default = Template.bind({});

Default.args = {
  value: 'rotate',
};
