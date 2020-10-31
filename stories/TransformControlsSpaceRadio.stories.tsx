import React from 'react';
import { Meta, Story } from '@storybook/react';
import TransformControlsSpaceRadio from '../src/components/TransformControlsSpaceRadio';
import { ChakraProvider } from '@chakra-ui/core';

const meta: Meta = {
  title: 'TransformControlsSpaceRadio',
  component: TransformControlsSpaceRadio,
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
    <TransformControlsSpaceRadio {...args} />
  </>
);

export const Default = Template.bind({});

Default.args = {
  value: 'world',
};
