import React from 'react';
import { Meta, Story } from '@storybook/react';
import { AiFillEye } from '@react-icons/all-files/ai/AiFillEye';
import { SettingsButton } from '../src/components/elements';

const meta: Meta = {
  title: 'SettingsButton',
  component: SettingsButton,
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => <SettingsButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  icon: <AiFillEye />,
  label: 'This a label',
  children: <div>Hi</div>,
};
