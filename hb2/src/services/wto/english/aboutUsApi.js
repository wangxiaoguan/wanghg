import request from '@/utils/request';


export async function update(params) {
  return request('/services/wto/wtoaboutus/update', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function listAll() {
  return request(`/services/wto/wtoaboutus/listAll`);
}