import {
  DATASOURCE, GET_ERROR,BEGINS,PAGEDATA,GETSELECTROWS,
} from '../action-type.js';

export function getDataSource(n) {
  return { type: DATASOURCE, payload: n };
}

export function getDataError(error) {
  return {type:GET_ERROR,payload:error};
}
export function BEGIN(url) {

  return { type: BEGINS,url:url};
}
export function getPageData(n){
  return {type:PAGEDATA,payload:n};
}
export function getSelectRows(n){
  return { type: GETSELECTROWS,payload:n};
}

