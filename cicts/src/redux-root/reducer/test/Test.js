import { combineReducers } from 'redux';
import {
  TEST,ANOTEST
} from '../../action/action-type.js';
const testData = (state = {} , action = {}) => {
  switch (action.type) {
    case TEST:
      console.log('reducer',action.payload)
      return action.payload;
    default:
      return state;
  }
};
const getTestData = (state = {} , action = {}) => {
  switch (action.type) {
    case ANOTEST:
      return action.payload;
    default:
      return state;
  }
};


export default combineReducers({
  testData,getTestData
});
