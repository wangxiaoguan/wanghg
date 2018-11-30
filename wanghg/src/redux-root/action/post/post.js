import {
  POST
} from '../action-type.js';
export function setPost(n) {
  return { type: POST, payload: n };
}
