import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SettingsButton } from '../src/components/elements';
import {
  AiFillEye,
  AiFillSetting,
  AiTwotoneSetting,
  FaEye,
  Gi3DHammer,
} from 'react-icons/all';

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
