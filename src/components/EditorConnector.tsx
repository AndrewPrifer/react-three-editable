import { useEditorConnector } from '../hooks';
import { InitialState } from '../store';
import { VFC } from 'react';

export interface EditorConnectorProps {
  initialState?: InitialState;
}

const EditorConnector: VFC<EditorConnectorProps> = ({ initialState }) => {
  useEditorConnector(initialState);

  return null;
};

export default EditorConnector;
