import request from '@/utils/request';

export async function add(params) {
  return request('/services/---', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request('/services/---', {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/---', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 搜索指定id的证书
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/exam/fhexamcertificate/get/${id}`);
}

/**
 * 搜索指定证书下面的所属机构
 * @param {*} id 
 */
export async function orgSearch(id) {
  return request(`/services/exam/fhexamorg/selectByOrgId/${id}`);
}