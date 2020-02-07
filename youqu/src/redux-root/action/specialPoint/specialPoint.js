import { BASICINFODATA, GRANTEEDATA,ISSUBMIT } from '../action-type.js';
export function setBasicInfoData(n) {return { type: BASICINFODATA, payload: n }}
export function setGranteeData(n) {return { type: GRANTEEDATA, payload: n }}
export function setIsSubmit(n){return {type:ISSUBMIT,payload:n}}
