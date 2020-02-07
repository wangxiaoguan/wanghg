import {
  CHANGEPARTYID
} from '../action-type.js';
export function changePartyId(n) {
  return { type: CHANGEPARTYID, payload: n };
}