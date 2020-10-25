import React from 'react';
import { Meta, Story } from '@storybook/react';
import Editor from '../src/components/Editor';
// @ts-ignore
import Setup from './Setup';
import { EditorConnector } from '../src';
import initialState from './initialState.json';

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
    <Editor {...args} />
    <Setup>
      <EditorConnector initialState={args.initialState} />
    </Setup>
  </>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

export const WithInitialState = Template.bind({});

Default.args = {};
WithInitialState.args = { initialState };
