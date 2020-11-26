import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Tooltip,
  Button,
  useTooltipState,
  TooltipReference,
} from '../src/components/elements';

const meta: Meta = {
  title: 'Tooltip',
  component: Tooltip,
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => {
  const tooltip = useTooltipState();

  return (
    <>
      <TooltipReference {...tooltip} as={Button}>
        Hover me
      </TooltipReference>
      <Tooltip {...tooltip} {...args} />
    </>
  );
};

export const Default = Template.bind({});

Default.args = {
  children: "I'm a tooltip!",
};
