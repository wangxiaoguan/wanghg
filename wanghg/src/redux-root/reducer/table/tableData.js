import { combineReducers } from 'redux';
import {
  DATASOURCE, GET_ERROR, PAGEDATA, GETSELECTROWS,
} from '../../action/action-type.js';

const tableData = (state = {root:{list:[]},totalNum:0}, action = {}) => {
  switch (action.type) {
  case DATASOURCE:
    return action.payload;
  case GET_ERROR:
    return state;
  default:
    return state;
  }
};
const pageData = (state={},action={})=>{
  switch(action.type){
  case PAGEDATA:
    return action.payload;
  default: 
    return state;
  }
};

const selectRowsData=(state=[],action={})=>{
  switch (action.type) {
  case GETSELECTROWS:
    return action.payload;
  default:
    return state;
  }
};

export default combineReducers({
  tableData, pageData, selectRowsData,
});
