import request from '@/utils/request';

export async function add(params) {
  return request('/services/code/fhcoderegisteruser/add', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/code/fhcoderegisteruser/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function reset(id) {
  return request(`/services/code/fhcoderegisteruser/pwdreset/${id}`, {
    method: 'POST',
  });
}

export async function update(params) {
  return request('/services/code/fhcoderegisteruser/update', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/code/fhcoderegisteruser/${id}`);
}

/**
 * 批量上下线
 * @param {*} params 
 */
export async function updateCheckStatus(params) {
  return request('/services/wto/wtobulletin/updateStatus', {
    method: 'PUT',
    body: params,
  });
}


export async function getRoleInfoList(params) {
  return request('/services/code/fhcoderole/all', {
    method: 'GET',
    body: params,
  });
}