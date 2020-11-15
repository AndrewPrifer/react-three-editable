import { useEditableManager } from '../hooks';
import { State } from '../store';
import { VFC } from 'react';

export interface EditableManagerProps {
  allowImplicitInstancing?: boolean;
  state?: State;
}

const EditableManager: VFC<EditableManagerProps> = (props) => {
  useEditableManager(props);

  return null;
};

export default EditableManager;
