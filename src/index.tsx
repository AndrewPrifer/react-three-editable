import React from 'react';
import { render } from 'react-dom';
export {
  default as EditableManager,
  EditableManagerProps,
} from './components/EditableManager';
export { useEditableManager } from './hooks';
export { default as editable } from './components/editable';
export { EditableState, configure } from './store';

if (process.env.NODE_ENV === 'development') {
  const Editor = require('./components/Editor').default;

  const editorRoot = document.createElement('div');
  document.body.appendChild(editorRoot);

  render(<Editor />, editorRoot);
}
