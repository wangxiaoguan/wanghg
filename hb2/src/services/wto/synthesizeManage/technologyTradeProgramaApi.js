import request from '@/utils/request';

export async function add(params) {
  return request('/services/wto/content/content', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/wto/content/content/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/wto/content/content', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/wto/content/content/${id}`);
}