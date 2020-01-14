export function setArticleData(n) {return { type: 'ArticleData', payload: n }}
export function setArticleAdd(n) {return { type: 'ArticleAdd', payload: n }}
export function setActivityData(n) {return { type: 'ActivityData', payload: n }}
export function setActivityAdd(n) {return { type: 'ActivityAdd', payload: n }}
export function setFileData(n) {return { type: 'FileData', payload: n }}
export function setFileAdd(n) {return { type: 'FileAdd', payload: n }}
export function setResultData(n) {return { type: 'ResultData', payload: n }}
export function setTopicId(n) {return { type: 'topicId', payload: n }}
export function setPartyId(n) {return { type: 'partyId', payload: n }}
export function setFormData(n) {return { type: 'formData', payload: n }}
export function setRecevicer(n) {return { type: 'recevicer', payload: n }}
export function setEventData(n) {return { type: 'EVENTANDINFODATA', payload: n }}
export function setLeaveData(n) {return { type: 'LEAVEDATA', payload: n }}
export function setIsSubmit(n){return { type: 'ISSUBMIT', payload:n}}
export function setTimePushData(n) {return { type: 'TIMEPUSHDATA', payload: n }}
export function setLoading(n) {return { type: 'LOADING', payload: n }}
export function setModal(n) {return { type: 'LEAVEMODAL', payload: n }}
export function setPost(n) {return { type: 'POST', payload: n }}
export function setBasicInfoData(n) {return { type: 'BASICINFODATA', payload: n }}
export function setGranteeData(n) {return { type: 'GRANTEEDATA', payload: n }}
export function getDataSource(n) {return { type: 'DATASOURCE', payload: n }}
export function getDataError(error) {return { type: 'GET_ERROR', payload: error }}
export function BEGIN(url) {return { type: 'BEGINS', url: url }}
export function getPageData(n){return { type: 'PAGEDATA', payload: n }}
export function getSelectRows(n){return { type: 'GETSELECTROWS',payload:n }}
export function setSelectTreeData(n) {return { type: 'TREESELECT', payload: n }}
export function setCheckTreeData(n) {return { type: 'TREECHECK', payload: n }}
export function setChangeData(n){return { type: 'TREECHANGE', payload: n }}
export function setEditorContent(n) {return { type: 'EDITOR', payload: n }}
export function setUploadPicture(n) {return { type: 'UPLOADPICTURE', payload: n }}
export function setUploadContentPicture(n) {return { type: 'UPLOADCONTENTPICTURE', payload: n }}
export function setPowers(n) {return { type: 'POWERS', payload: n }}
  