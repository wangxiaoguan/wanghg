import request from '@/utils/request';

export async function add(params) {
  return request('/services/wto/chinafrenchevent/chinafrenchevent', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/wto/chinafrenchevent/chinafrenchevent/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/wto/chinafrenchevent/chinafrenchevent', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/wto/chinafrenchevent/chinafrenchevent/${id}`);
}

/**
 * 批量上下线
 * @param {*} params 
 */
export async function updateCheckStatus(params) {
  return request('/services/wto/chinafrenchevent/updateStatus', {
    method: 'PUT',
    body: params,
  });
}