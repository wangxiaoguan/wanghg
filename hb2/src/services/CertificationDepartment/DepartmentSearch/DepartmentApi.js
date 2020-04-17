import request from '@/utils/request';

export async function add(params) {
  return request('/services/exam/fhexamorg/insert', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/exam/fhexamorg/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function revoke(id) {
  return request(`/services/exam/fhexamorg/reBack/${id}`);
}

export async function update(params) {
  return request('/services/exam/fhexamorg/update', {
    method: 'PUT',
    body: params,
  });
}


export async function search(id) {
  return request(`/services/exam/fhexamorg/selectById/${id}`);
}

/**
 * 搜索检测结构
 * @param {*} id 
 */
export async function formSearch(params) {
  return request(`/services/exam/fhexamorg/selectAll${params}`)
}

export async function getIndustry() {
  return request(`/services/exam/fhexamorg/getIndustry`);
}