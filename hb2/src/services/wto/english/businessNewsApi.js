import request from '@/utils/request';

export async function add(params) {
  return request('/services/wto/wtobusinessnews/save', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/wto/wtobusinessnews/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/wto/wtobusinessnews/update', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/wto/wtobusinessnews/get/${id}`);
}

/**
 * 批量上下线
 * @param {*} params 
 */
export async function updateCheckStatus(params) {
  return request('/services/wto/wtobusinessnews/update/checkstatus', {
    method: 'PUT',
    body: params,
  });
}