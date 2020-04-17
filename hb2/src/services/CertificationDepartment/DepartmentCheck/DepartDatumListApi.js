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
 * 修改审核状态
 * @param {*} id 
 */
export async function updateCheckStatus(params) {
  return request(`services/exam/fhexamdatum/updateByIds/${params}`, {
    method: 'POST',
  });
}
