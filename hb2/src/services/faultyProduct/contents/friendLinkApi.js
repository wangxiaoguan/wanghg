import request from '@/utils/request';

export function add(params) {
  return request('/services/dpac/defectlink/save', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/dpac/defectlink/update', {
    method: 'POST',
    body: params,
  });
}

export function remove(params) {
  return request(`/services/dpac/defectlink/delete`, {
    method: 'POST',
    body: params
  });
}


