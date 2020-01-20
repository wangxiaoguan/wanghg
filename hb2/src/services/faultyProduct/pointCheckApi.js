import request from '@/utils/request';

export function add(params) {
  return request('/services/dpac/defectcheckinforegistry/save', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/dpac/defectcheckinforegistry/update', {
    method: 'POST',
    body: params,
  });
}

export function remove(params) {
  return request(`/services/dpac/defectcheckinforegistry/delete`, {
    method: 'POST',
    body: params,
  });
}

export function search(id) {
  return request(`/services/dpac/defectcheckinforegistry/getById/${id}`);
}


export async function exportExcel(params) {
  return request(`/services/dpac/exportExcel/exportYouClickIcheck`, {
    method: 'POST',
    body:params
  }, true);
}
