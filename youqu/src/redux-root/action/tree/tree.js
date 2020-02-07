import {TREESELECT, TREECHECK, TREECHANGE} from '../action-type.js';
export function setSelectTreeData(n) {return { type: TREESELECT, payload: n }}
export function setCheckTreeData(n) {return { type: TREECHECK, payload: n }}
export function setChangeData(n){return { type: TREECHANGE, payload: n }}



