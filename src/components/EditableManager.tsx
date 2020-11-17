import { useEditableManager } from '../hooks';
import { EditableState } from '../store';
import { VFC } from 'react';

export interface EditableManagerProps {
  allowImplicitInstancing?: boolean;
  state?: EditableState;
}

const EditableManager: VFC<EditableManagerProps> = (props) => {
  useEditableManager(props);

  return null;
};

export default EditableManager;
