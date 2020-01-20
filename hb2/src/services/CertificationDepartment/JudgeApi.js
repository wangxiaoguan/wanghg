import request from '@/utils/request';

export async function add(params) {
  return request('/services/exam/fhexamreviewer/insert', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/services/exam/fhexamreviewer/update', {
    method: 'POST',
    body: params,
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/exam/fhexamreviewer/selectById/${id}`);
}

/**
 * 批量审核
 * @param {*} params 
 */
export async function updateCheckStatus(params) {
  return request(`/services/exam/fhexamreviewer/updateByids/${params}`, {
    method: 'POST',
  });
}

export async function exportExcel(params) {
  return request(`/services/exam/downloadExcel/download/ExportReportGoods${params}`, null, true);
}