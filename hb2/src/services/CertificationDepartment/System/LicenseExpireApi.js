import request from '@/utils/request';

export async function add(params) {
  return request('/services/exam/fhexamnotice/save', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/services/exam/fhexamnotice/save', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/exam/fhexamregisteruser/updateByids/${id}`, {
    method: 'POST',
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/exam/fhexamnotice/getById`);
}