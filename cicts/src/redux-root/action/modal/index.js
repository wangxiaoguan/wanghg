import {
  LEAVEMODAL,
} from '../action-type.js';

export function setModal(n) {
  return { type: LEAVEMODAL, payload: n };
}
