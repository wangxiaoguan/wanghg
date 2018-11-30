import { combineReducers } from 'redux';
import { TREESELECT, TREECHECK, TREECHANGE } from '../../action/action-type.js';
const treeSelectData = (state = {}, action = {}) => {
  switch (action.type) {
  case TREESELECT:
    return action.payload;
  default:
    return state;
  }
};
const treeCheckData = (state = [], action = {}) => {
  switch (action.type) {
  case TREECHECK:
    return action.payload;
  default:
    return state;
  }
};
const treeChangeData = (state=[],action={})=>{
  switch (action.type) {
  case TREECHANGE:
    return action.payload;
  default:
    return state;
  }
};
export default combineReducers({
  treeSelectData, treeCheckData, treeChangeData,
});
