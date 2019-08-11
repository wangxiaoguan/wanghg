//reducer
import {
  LANGUAGE, POWERS,SIDEBAR_SHOW,
} from '../action/action-type.js';
import table from './table/tableData';
import tree from './tree';
import loading from './loading';
import post from './post/post';
import attach from './attach/attach';
import uploadPicture from './upload/uploadPicture';
import editor from './upload/editor';
import flowData from './eventAndInfoData';
import modal from './modal';
import specialPoint from './specialPoint/specialPoint';
import { combineReducers } from 'redux';


const defaultPowers = window.sessionStorage.powers !== undefined ? JSON.parse(window.sessionStorage.powers) : {};
const powers = (state = defaultPowers, action = {}) => {
  switch (action.type) {
  case POWERS:
    if (action.payload !== undefined) {
      window.sessionStorage.powers = JSON.stringify(action.payload);
    }
    return action.payload;
  default:
    return state;
  }
};

export default combineReducers({
  tree, table, powers, loading, uploadPicture, editor, flowData, modal,post,attach, specialPoint,
});

