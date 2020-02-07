import { combineReducers } from 'redux';
import {
  ArticleData,ActivityData,FileData,ResultData,
  ArticleAdd,ActivityAdd,FileAdd,
  topicId,partyId,formData,recevicer
} from '../../action/action-type.js';
const articleData = (state = {}, action = {}) => {
  switch (action.type) {
    case ArticleData:
      return action.payload;
    default:
      return state;
  }
};
const articleAdd = (state = {}, action = {}) => {
  switch (action.type) {
    case ArticleAdd:
      return action.payload;
    default:
      return state;
  }
};
const activityData = (state = {}, action = {}) => {
  switch (action.type) {
    case ActivityData:
      return action.payload;
    default:
      return state;
  }
};
const activityAdd = (state = {}, action = {}) => {
  switch (action.type) {
    case ActivityAdd:
      return action.payload;
    default:
      return state;
  }
};
const fileData = (state = {}, action = {}) => {
  switch (action.type) {
    case FileData:
      return action.payload;
    default:
      return state;
  }
};
const fileAdd = (state = {}, action = {}) => {
  switch (action.type) {
    case FileAdd:
      return action.payload;
    default:
      return state;
  }
};
const resultData = (state = {}, action = {}) => {
  switch (action.type) {
    case ResultData:
      return action.payload;
    default:
      return state;
  }
};
const getTopicId = (state = {}, action = {}) => {
  switch (action.type) {
    case topicId:
      return action.payload;
    default:
      return state;
  }
};
const getPartyId = (state = {}, action = {}) => {
  switch (action.type) {
    case partyId:
      return action.payload;
    default:
      return state;
  }
};
const getFormData = (state = {}, action = {}) => {
  switch (action.type) {
    case formData:
      return action.payload;
    default:
      return state;
  }
};
const getRecevicer = (state = {}, action = {}) => {
  switch (action.type) {
    case recevicer:
      return action.payload;
    default:
      return state;
  }
};
export default combineReducers({
  articleData,activityData,fileData,resultData,articleAdd,activityAdd,fileAdd,getTopicId,getPartyId,getFormData,getRecevicer
});