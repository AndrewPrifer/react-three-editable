import React from 'react';
import { render } from 'react-dom';
import Editor from './components/Editor';
import studio from '@theatre/studio';

export {
  default as EditorHelper,
  EditorHelperProps,
} from './components/EditorHelper';
export { default as editable } from './components/editable';
export { EditableState, configure, BindFunction } from './store';

console.log(studio);

if (process.env.NODE_ENV === 'development') {
  const editorRoot = document.createElement('div');
  document.body.appendChild(editorRoot);

  render(<Editor />, editorRoot);
}
