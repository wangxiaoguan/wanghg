import { combineReducers } from 'redux';
import { CHANGEPARTYID } from '../../action/action-type.js';
const headPartyIdData = (state = {}, action = {}) => {
  switch (action.type) {
  case CHANGEPARTYID:
    return action.payload;
  default:
    return state;
  }
};

export default combineReducers({
  headPartyIdData,
});