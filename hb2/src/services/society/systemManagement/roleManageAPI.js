import request from '@/utils/request';

export async function add(params) {
  return request('/services/code/fhcoderole/add', {
    method: 'POST',
    body: params,
  });
}

export async function search(id) {
  return request(`/services/code/fhcoderole/${id}`, {
    method: 'GET',
  });
}

export async function update(params) {
  return request('/services/code/fhcoderole/update', {
    method: 'PUT',
    body: params
  })
}

export async function remove(id) {
  return request(`/services/code/fhcoderole/delete/${id}`, {
    method: 'DELETE',
  })
}
