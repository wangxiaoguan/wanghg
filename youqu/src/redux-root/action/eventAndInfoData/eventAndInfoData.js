import { EVENTANDINFODATA, LEAVEDATA,ISSUBMIT } from '../action-type.js';
export function setEventData(n) {return { type: EVENTANDINFODATA, payload: n }}
export function setLeaveData(n) {return { type: LEAVEDATA, payload: n }}
export function setIsSubmit(n){return {type:ISSUBMIT,payload:n}}
