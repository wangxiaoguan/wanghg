import request from '@/utils/request';

/**
 * 新增
 * @param {*} id 
 */
export async function add(params) {
  return request(`services/exam/fhexamdatum/insert`, {
    method: 'post',
    body: params,
  });
}

/**
 * 详情
 * @param {*} id 
 */
export async function search(id) {
  return request(`services/exam/fhexamcertificate/get/${id}`);
}

/**
 * 搜索指定证书下面的所属机构
 * @param {*} id 
 */
export async function orgSearch(id) {
  return request(`/services/exam/fhexamorg/selectByOrgId/${id}`);
}


/**
 * 修改审核状态
 * @param {*} id 
 */
export async function updateCheckStatus(body) {
  return request(`services/exam/fhexamcertificate/updateStatus`, {
    method: 'PUT',
    body
  });
}
