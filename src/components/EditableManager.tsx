import { useEditableManager } from '../hooks';
import { State } from '../store';
import { VFC } from 'react';

export interface EditableManagerProps {
  state?: State;
}

const EditableManager: VFC<EditableManagerProps> = ({ state }) => {
  useEditableManager(state);

  return null;
};

export default EditableManager;
