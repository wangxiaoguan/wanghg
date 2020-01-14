import { combineReducers } from 'redux';
const articleData = (state = {}, action = {}) => {
  switch (action.type) {
    case 'ArticleData':
      return action.payload;
    default:
      return state;
  }
};
const articleAdd = (state = {}, action = {}) => {
  switch (action.type) {
    case 'ArticleAdd':
      return action.payload;
    default:
      return state;
  }
};
const activityData = (state = {}, action = {}) => {
  switch (action.type) {
    case 'ActivityData':
      return action.payload;
    default:
      return state;
  }
};
const activityAdd = (state = {}, action = {}) => {
  switch (action.type) {
    case 'ActivityAdd':
      return action.payload;
    default:
      return state;
  }
};
const fileData = (state = {}, action = {}) => {
  switch (action.type) {
    case 'FileData':
      return action.payload;
    default:
      return state;
  }
};
const fileAdd = (state = {}, action = {}) => {
  switch (action.type) {
    case 'FileAdd':
      return action.payload;
    default:
      return state;
  }
};
const resultData = (state = {}, action = {}) => {
  switch (action.type) {
    case 'ResultData':
      return action.payload;
    default:
      return state;
  }
};
const getTopicId = (state = {}, action = {}) => {
  switch (action.type) {
    case 'topicId':
      return action.payload;
    default:
      return state;
  }
};
const getPartyId = (state = {}, action = {}) => {
  switch (action.type) {
    case 'partyId':
      return action.payload;
    default:
      return state;
  }
};
const getFormData = (state = {}, action = {}) => {
  switch (action.type) {
    case 'formData':
      return action.payload;
    default:
      return state;
  }
};
const getRecevicer = (state = {}, action = {}) => {
  switch (action.type) {
    case 'recevicer':
      return action.payload;
    default:
      return state;
  }
};
const flowData = (state = {}, action = {}) => {
  switch (action.type) {
  case 'EVENTANDINFODATA':
    return action.payload;
  default:
    return state;
  }
};
const leaveData = (state = {apply:{},examination:{},order:{},questionnaire:{},vote:{},article:{},magazine:{},video:{}}, action = {}) => {
  switch (action.type) {
  case 'LEAVEDATA':
    return action.payload;
  default:
    return state;
  }
};
const isSubmit = (state = {}, action = {}) => {
  switch (action.type) {
  case 'ISSUBMIT':
    return action.payload;
  default:
    return state;
  }
};
const loading = (state = false, action = {}) => {
  switch (action.type) {
  case 'LOADING':
    return action.payload;
  default:
    return state;
  }
};
const leaveModal = (state = false , action = {}) => {
  switch (action.type) {
  case 'LEAVEMODAL':
    return action.payload;
  default:
    return state;
  }
};
const postData = (state = {}, action = {}) => {
  switch (action.type) {
    case 'POST':
      return action.payload;
    default:
      return state;
  }
};
const getBasicInfoData = (state = {}, action = {}) => {
  switch (action.type) {
  case 'BASICINFODATA':
    return action.payload;
  default:
    return state;
  }
};
const getGranteeData = (state = {}, action = {}) => {
  switch (action.type) {
  case 'GRANTEEDATA':
    return action.payload;
  default:
    return state;
  }
};
const timePushData = (state = {},action={})=>{
  switch (action.type) {
  case 'TIMEPUSHDATA':
    return action.payload;
  default:
    return state;
  }
};
const tableData = (state = {root:{list:[]},totalNum:0}, action = {}) => {
  switch (action.type) {
  case 'DATASOURCE':
    return action.payload;
  case 'GET_ERROR':
    return state;
  default:
    return state;
  }
};
const pageData = (state={},action={})=>{
  switch(action.type){
  case 'PAGEDATA':
    return action.payload;
  default: 
    return state;
  }
};
const selectRowsData=(state=[],action={})=>{
  switch (action.type) {
  case 'GETSELECTROWS':
    return action.payload;
  default:
    return state;
  }
};
const testData = (state = {} , action = {}) => {
  switch (action.type) {
    case 'TEST':
      return action.payload;
    default:
      return state;
  }
};
const getTestData = (state = {} , action = {}) => {
  switch (action.type) {
    case 'ANOTEST':
      return action.payload;
    default:
      return state;
  }
};
const treeSelectData = (state = {}, action = {}) => {
  switch (action.type) {
  case 'TREESELECT':
    return action.payload;
  default:
    return state;
  }
};
const treeCheckData = (state = [], action = {}) => {
  switch (action.type) {
  case 'TREECHECK':
    return action.payload;
  default:
    return state;
  }
};
const treeChangeData = (state=[],action={})=>{
  switch (action.type) {
  case 'TREECHANGE':
    return action.payload;
  default:
    return state;
  }
};
const editorData = (state = [], action = {}) => {
  switch (action.type) {
  case 'EDITOR':
    return action.payload;
  default:
    return state;
  }
};
const uploadPictureData = (state = {}, action = {}) => {
  switch (action.type) {
  case 'UPLOADPICTURE':
    return action.payload;
  default:
    return state;
  }
};
const contentPictureData = (state = [], action = {}) => {
  switch (action.type) {
  case 'UPLOADCONTENTPICTURE':
    return action.payload;
  default:
    return state;
  }
};
const powers = (state = {}, action = {}) => {
  switch (action.type) {
  case 'POWERS':
    return action.payload;
  default:
    return state;
  }
};
export default combineReducers({
    articleData,
    activityData,
    fileData,
    resultData,
    articleAdd,
    activityAdd,
    fileAdd,
    getTopicId,
    getPartyId,
    getFormData,
    getRecevicer,
    flowData, 
    leaveData, 
    isSubmit,
    getBasicInfoData, 
    getGranteeData, 
    timePushData, 
    postData,  
    leaveModal,
    loading,
    tableData, 
    pageData, 
    selectRowsData,
    testData,
    getTestData,
    treeSelectData, 
    treeCheckData, 
    treeChangeData,
    uploadPictureData, 
    contentPictureData,
    editorData,
    powers
  });



