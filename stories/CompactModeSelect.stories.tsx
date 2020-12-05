import React from 'react';
import { Meta, Story } from '@storybook/react';
import { CompactModeSelect } from '../src/components/elements';
import { BiAbacus, BiBullseye, BiCube } from 'react-icons/all';

const meta: Meta = {
  title: 'CompactModeSelect',
  component: CompactModeSelect,
  argTypes: { onChange: { action: 'onChange' } },
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => <CompactModeSelect {...args} />;

export const Default = Template.bind({});

Default.args = {
  value: 'first',
  options: [
    {
      option: 'first',
      label: 'First',
      icon: <BiBullseye />,
    },
    {
      option: 'second',
      label: 'Second',
      icon: <BiCube />,
    },
    {
      option: 'third',
      label: 'Third',
      icon: <BiAbacus />,
    },
  ],
  settingsPanel: <div>Hi</div>,
};
