import request from '@/utils/request';

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`services/exam/fhexamperson/selectById/${id}`);
}


/**
 * 修改审核状态
 * @param {*} id 
 */
export async function updateCheckStatus(params) {
  return request(`services/exam/fhexamperson/updateByIds/${params}`, {
    method: 'POST',
  });
}
