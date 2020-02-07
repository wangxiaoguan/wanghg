import { combineReducers } from 'redux';
import { BASICINFODATA, GRANTEEDATA, TIMEPUSHDATA, ISSUBMIT } from '../../action/action-type.js';

const getBasicInfoData = (state = {}, action = {}) => {
  switch (action.type) {
  case BASICINFODATA:
    return action.payload;
  default:
    return state;
  }
};

const getGranteeData = (state = {}, action = {}) => {
  switch (action.type) {
  case GRANTEEDATA:
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
const isSubmit = (state = 'cancel', action = {}) => {
  switch (action.type) {
  case ISSUBMIT:
    return action.payload;
  default:
    return state;
  }
};
export default combineReducers({
  getBasicInfoData, getGranteeData, timePushData, isSubmit,
});