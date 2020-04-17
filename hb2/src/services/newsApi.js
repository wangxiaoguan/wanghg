import request from '@/utils/request';

export async function add(params) {
  return request('/services/indexManage/news/news', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/indexManage/news/news/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/indexManage/news/news', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/indexManage/news/news/${id}`);
}