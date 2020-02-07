import {
  TREESELECT, TREECHECK, TREECHANGE,
} from '../action-type.js';

export function setSelectTreeData(n) {            //action创建函数
  return { type: TREESELECT, payload: n };        //返回一个action         action 包括两个属性：type/payload  action
}
export function setCheckTreeData(n) {
  return { type: TREECHECK, payload: n };
}
export function setChangeData(n) {
  return { type: TREECHANGE, payload: n };
}



