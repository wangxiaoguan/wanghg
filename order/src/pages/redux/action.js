import {IP, TOKEN, ORDER,ACTIVITY,USER,DETAIL} from './type.js';
  
  export function setIp(n) {     
    return { type: IP, payload: n };
  }
  export function setToken(n) {
    return { type: TOKEN, payload: n };
  }
  export function setOrder(n) {
    return { type: ORDER, payload: n };
  }
  export function setActivity(n) {
    return { type: ACTIVITY, payload: n };
  }
  export function setUser(n) {
    return { type: USER, payload: n };
  }
  export function setDetail(n) {
    return { type: DETAIL, payload: n };
  }