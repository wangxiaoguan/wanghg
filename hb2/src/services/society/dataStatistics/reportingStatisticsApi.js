import request from '@/utils/request';

export async function add(params) {
  return request('/services/code/codedic/insert', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/code/codedic/delete/14/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/code/codedic/update', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/code/codedic/get/14/${id}`);
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