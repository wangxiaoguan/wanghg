import request from '@/utils/request';

export function add(params) {
  return request('/services/dpac/defectpurchaseinspection/save', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/dpac/defectpurchaseinspection/update', {
    method: 'POST',
    body: params,
  });
}

export function remove(id) {
  return request(`/services/dpac/defectpurchaseinspection/delete/${id}`, {
    method: 'POST',
  });
}

export function search(id) {
  return request(`/services/dpac/defectpurchaseinspection/selectById/${id}`);
}

/**
 * 批量修改，包括置顶，上线，审核等
 * @param {*} id 
 */
export async function updateBatchCheckStatus(params) {
  return request(`/services/dpac/defectmessageissue/updateStatus`, {
    method: 'PUT',
    body: params
  });
}

export async function exportExcel(params) {
  return request(`/services/dpac/exportExcel/exportBuyCheckProductManager`, {
    method: 'POST',
    body: params
  }, true);
}
