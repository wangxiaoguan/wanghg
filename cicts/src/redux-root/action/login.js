import {AUTHINFO} from './action-type.js';
  
  
  export function setAuthInfo(n) {
    return { type: AUTHINFO, payload: n };
  }