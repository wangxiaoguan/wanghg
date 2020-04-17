/**
 * Created by skyinno on 2018/11/15.
 */
import request from '@/utils/request';

export async function login(params) {
  const requestParams = {};
  requestParams.username = params.userName;
  requestParams.password = params.password;
  // 新建单位或部门
  return request(`/cas/login`, {
    method: 'POST',
    body: requestParams,
  });
}

export async function logout() {
  const requestParams = {};
  return request(`/cas/logout`, {
    method: 'POST',
    body: requestParams,
  });
}

export async function authInfo() {
  return request(`/cas/authInfo`);
}
