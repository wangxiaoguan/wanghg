import { TIMEPUSHDATA } from '../action-type.js';

export function setTimePushData(n) {
  return { type: TIMEPUSHDATA, payload: n };
}

