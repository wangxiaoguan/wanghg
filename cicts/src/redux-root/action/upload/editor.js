import { EDITOR } from '../action-type.js';

export function setEditorContent(n) {
  return { type: EDITOR, payload: n };
}
