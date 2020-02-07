import { request } from '@/utils/request';

// 获取党员组织信息
export async function getPartyInfo(params) {
  return request('/app/party/service.do', {
    method: 'POST',
    body: params,
  });
}

// 获取党员信息
export async function loadData(params) {
  return request('/app/user/service.do', {
    method: 'POST',
    body: params,
  });
}

/****我的档案****/
export async function getUser(params) {
  return request(`/app/user/service.do`, {
    method: 'POST',
    body: params,
  });
}

/****我的收藏****/
export async function loadFavoriteData(params) {
  return request(`/app/favorites/service.do`, {
    method: 'POST',
    body: params,
  });
}

/****我的活动****/
export async function getNewsLists(params) {
  return request('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}

// 个人中心，事项提醒
export function getRemindsListData(params) {
  return request('/app/group/service.do', {
    method: 'POST',
    body: params,
  });
}

// 个人中心，系统消息
export function getSysMessageList(params) {
  return request(`/app/user/service.do`, {
    method: 'POST',
    body: params,
  });
}
