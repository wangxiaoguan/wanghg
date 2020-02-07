import { request } from '@/utils/request';

/****党员消息****/
export async function getUser(params) {
  return request(`/app/user/service.do`, {
    method: 'POST',
    body: params,
  });
}

/****党建宣传和精品示范****/
export async function getNews(params) {
  return request(`/app/newsActivity/service.do`, {
    method: 'POST',
    body: params,
  });
}

/****党建宣传详情****/
export async function getPartyDetail(params) {
  return request(`/app/newsActivity/service.do`, {
    method: 'POST',
    body: params,
  });
}

/****精品示范详情****/
export async function getQualityDetail(params) {
  return request(`/app/newsActivity/service.do`, {
    method: 'POST',
    body: params,
  });
}

// 获取党组织架构
export async function getOrganization(params) {
  return request('/app/partyChange/service.do', {
    method: 'POST',
    body: params,
  });
}

export async function getData(params) {
  return request(`/app/taskTX/service.do`, {
    method: 'POST',
    body: params,
  });
}

// 获取党员信息
export async function getPartyInfo(params) {
  return request(`/app/party/service.do`, {
    method: 'POST',
    body: params,
  });
}

// 获取党员信息
export async function login(params) {
  return request(`/app/user/service.do`, {
    method: 'POST',
    body: params,
  });
}

