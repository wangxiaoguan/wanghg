import { combineReducers } from 'redux';
import { EVENTANDINFODATA, TIMEPUSHDATA,LEAVEDATA, ISSUBMIT } from '../../action/action-type.js';
const flowData = (state = {}, action = {}) => {
  switch (action.type) {
  case EVENTANDINFODATA:
    return action.payload;
  default:
    return state;
  }
};
const timePushData = (state = '',action={})=>{
  switch (action.type) {
  case TIMEPUSHDATA:
    return action.payload;
  default:
    return state;
  }
};
const leaveData = (state = {apply:{},examination:{},order:{},questionnaire:{},vote:{},article:{},magazine:{},video:{}}, action = {}) => {
  switch (action.type) {
  case LEAVEDATA:
    return action.payload;
  default:
    return state;
  }
};
const isSubmit = (state = 'cancel', action = {}) => {
  switch (action.type) {
  case ISSUBMIT:
    return action.payload;
  default:
    return state;
  }
};
export default combineReducers({
  flowData, timePushData, leaveData, isSubmit,
});