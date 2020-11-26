import React from 'react';
import { Meta, Story } from '@storybook/react';
import { configure } from '../src/store';
// @ts-ignore
import Setup from './Setup';
import EditableManager from '../src/components/EditableManager';
import editableState from './editableState.json';
import Editor from '../src/components/Editor';

configure({ localStorageNamespace: 'Storybook', enablePersistence: true });

const meta: Meta = {
  title: 'Editor',
  component: Editor,
  argTypes: {},
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

const Template: Story = (args) => (
  <>
    <Editor />
    <Setup>
      <EditableManager state={args.editableState} />
    </Setup>
  </>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

export const WithInitialState = Template.bind({});

Default.args = {};
WithInitialState.args = { editableState };
