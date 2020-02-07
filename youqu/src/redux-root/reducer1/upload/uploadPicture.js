import { combineReducers } from 'redux';
import { UPLOADPICTURE, UPLOADCONTENTPICTURE} from '../../action/action-type.js';
const uploadPictureData = (state = {}, action = {}) => {
  switch (action.type) {
  case UPLOADPICTURE:
    return action.payload;
  default:
    return state;
  }
};
const contentPictureData = (state = [], action = {}) => {
  switch (action.type) {
  case UPLOADCONTENTPICTURE:
    return action.payload;
  default:
    return state;
  }
};
export default combineReducers({
  uploadPictureData, contentPictureData,
});
