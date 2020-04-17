import request from '@/utils/request';

export async function remove(params) {
  return request(`/services/wto/wtoofficialcomment/checkBulletinComment/3`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 批量上下线
 * @param {*} params 
 */
export async function updateCheckStatus(params) {
  if(params.isCheck){
    return request('/services/wto/wtoofficialcomment/checkBulletinComment/1', {
      method: 'POST',
      body: params.idList,
    });
  }else{
    return request('/services/wto/wtoofficialcomment/checkBulletinComment/2', {
      method: 'POST',
      body: params.idList,
    });
  }
  
}