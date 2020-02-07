import { combineReducers } from 'redux';
import { EDITOR } from '../../action/action-type.js';
const editorData = (state = [], action = {}) => {
  switch (action.type) {
  case EDITOR:
    return action.payload;
  default:
    return state;
  }
};
export default combineReducers({
  editorData,
});
