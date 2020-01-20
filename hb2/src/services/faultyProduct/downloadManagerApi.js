import request from '@/utils/request';

export function add(params) {
  return request('/services/dpac/fhdefectdownload/save', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/dpac/fhdefectdownload/update', {
    method: 'POST',
    body: params,
  });
}

export function remove(id) {
  return request(`/services/dpac/fhdefectdownload/delete/${id}`, {
    method: 'POST',
  });
}

export function search(id) {
  return request(`/services/dpac/fhdefectdownload/selectById/${id}`);
}
