
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
import reducer from './index'
import { combineReducers } from 'redux';
export default combineReducers({
  tree, table, loading, uploadPicture, editor, flowData, modal,post,attach, specialPoint,
  // reducer
});

