import request from '@/utils/request';

export function add(params) {
  return request('/services/dpac/defectenterprise/save', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/dpac/defectenterprise/update', {
    method: 'POST',
    body: params,
  });
}

export function remove(params) {
  return request(`/services/dpac/defectenterprise/delete`, {
    method: 'POST',
    body: params,
  });
}

export function search(id) {
  return request(`/services/dpac/defectenterprise/getById/${id}`);
}

/**
 * 批量修改，包括置顶，上线，审核等
 * @param {*} id 
 */
export async function updateBatchCheckStatus(params) {
  return request(`/services/dpac/defectenterprise/updateStatus`, {
    method: 'PUT',
    body: params
  });
}

export async function exportExcel(params) {
  return request(`/services/dpac/exportExcel/exportEnterpriseNoteManager`, {
    method: 'POST',
    body:params,
  }, true);
}
