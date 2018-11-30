import { combineReducers } from 'redux';
import { LOADING } from '../../action/action-type.js';
const loading = (state = false, action = {}) => {
  switch (action.type) {
  case LOADING:
    return action.payload;
  default:
    return state;
  }
};
export default combineReducers({
  loading,
});
