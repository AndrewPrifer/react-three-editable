import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PortalManager,
} from '../src/components/elements';

const meta: Meta = {
  title: 'Modal',
  component: Modal,
  argTypes: { onClick: { action: 'onClick' } },
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

const Template: Story = (args) => <Modal {...args} />;

export const Default = Template.bind({});

Default.args = {
  visible: true,
  children: (
    <>
      <ModalHeader>Saved state found</ModalHeader>
      <ModalBody>Would you like to use initial state or saved state?</ModalBody>
      <ModalFooter>
        <Button className="flex-1">Saved</Button>
        <Button className="flex-1">Initial</Button>
      </ModalFooter>
    </>
  ),
};
