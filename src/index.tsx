import React from 'react';
import { render } from 'react-dom';
import Editor from './components/Editor';
export {
  default as EditableManager,
  EditableManagerProps,
} from './components/EditableManager';
export { useEditableManager } from './hooks';
export { default as editable } from './components/editable';
export { EditableState, configure } from './store';

if (process.env.NODE_ENV === 'development') {
  const editorRoot = document.createElement('div');
  document.body.appendChild(editorRoot);

  render(<Editor />, editorRoot);
}
