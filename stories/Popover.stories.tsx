import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Popover,
  PopoverDisclosure,
  PortalManager,
  usePopoverState,
} from '../src/components/elements';
import EnvironmentPreview from '../src/components/EnvironmentPreview';

const meta: Meta = {
  title: 'Popover',
  component: Popover,
  parameters: {
    controls: { expanded: false },
  },
  decorators: [
    (Story) => (
      <PortalManager>
        <Story />
      </PortalManager>
    ),
  ],
};

export default meta;

const Template: Story = (args) => {
  const popover = usePopoverState();
  return (
    <>
      <PopoverDisclosure
        // @ts-ignore
        {...popover}
      >
        Popover target
      </PopoverDisclosure>
      <Popover {...popover} {...args} />
    </>
  );
};

export const Default = Template.bind({});

Default.args = {
  children: (
    <div className="grid grid-cols-2 gap-4 auto-rows-14">
      <EnvironmentPreview url="/equi.hdr" />
      <EnvironmentPreview url="/equi.hdr" />
    </div>
  ),
  visible: true,
};
