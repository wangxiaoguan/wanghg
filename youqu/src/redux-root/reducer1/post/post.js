import { combineReducers } from 'redux';
import {
  POST
} from '../../action/action-type.js';
const postData = (state = {}, action = {}) => {
  switch (action.type) {
    case POST:
      return action.payload;
    default:
      return state;
  }
};
export default combineReducers({
  postData
});