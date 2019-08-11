import { combineReducers } from 'redux';
import {
  LEAVEMODAL,
} from '../../action/action-type.js';

const leaveModal = (state = false , action = {}) => {
  switch (action.type) {
  case LEAVEMODAL:
    return action.payload;
  default:
    return state;
  }
};


export default combineReducers({
  leaveModal,
});
