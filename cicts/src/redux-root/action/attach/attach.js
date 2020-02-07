import {
  ArticleData,ActivityData,FileData,ResultData,
  ArticleAdd,ActivityAdd,FileAdd,topicId,partyId,formData,recevicer,MerchantData,MerchantAdd
} from '../action-type.js';
export function setArticleData(n) {
  console.log('setArticleData',n);
  return { type: ArticleData, payload: n };
}
export function setArticleAdd(n) {
  return { type: ArticleAdd, payload: n };
}

export function setActivityData(n) {
  return { type: ActivityData, payload: n };
}
export function setActivityAdd(n) {
  return { type: ActivityAdd, payload: n };
}
export function setFileData(n) {
  return { type: FileData, payload: n };
}
export function setFileAdd(n) {
  return { type: FileAdd, payload: n };
}
export function setResultData(n) {
  return { type: ResultData, payload: n };
}
export function setTopicId(n) {
  return { type: topicId, payload: n };
}
export function setPartyId(n) {
  return { type: partyId, payload: n };
}
export function setFormData(n) {
  console.log('formData',n);
  return { type: formData, payload: n };
}

export function setRecevicer(n) {
  return { type: recevicer, payload: n };
}


export function setMerchantData(n) {
  console.log('setMerchantData',n);
  return { type: MerchantData, payload: n };
}
export function setMerchantAdd(n) {
  return { type: MerchantAdd, payload: n };
}