import request from '@/utils/request';

export function add(params) {
  return request('/services/dpac/defectcarthreeguarantees/customer/save', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/dpac/defectcarthreeguarantees/update', {
    method: 'POST',
    body: params,
  });
}

export function remove(id) {
  return request(`/services/dpac/defectcarthreeguarantees/delete/${id}`, {
    method: 'POST'
  });
}

export function search(id) {
  return request(`/services/dpac/defectcarthreeguarantees/selectById/0/${id}`);
}


export async function exportExcel(params) {
  return request(`/services/dpac/exportExcel/exportPayMan`, 
  {
    method: 'POST',
    body:params,
  }, true);
}

export async function updateStatus(params) {
  return request(`/services/dpac/defectcarthreeguarantees/updateHidden`, {
    method: 'POST',
    body: params,
  });
}
