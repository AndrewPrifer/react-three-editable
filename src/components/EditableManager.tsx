import { useEditableManager } from '../hooks';
import { State } from '../store';
import { VFC } from 'react';

export interface EditorConnectorProps {
  state?: State;
}

const EditableManager: VFC<EditorConnectorProps> = ({ state }) => {
  useEditableManager(state);

  return null;
};

export default EditableManager;
