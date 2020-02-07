import {request} from '@/utils/request';

// 点赞
export async function activeLike (params) {
  return request ('/app/service.do', {
    method: 'POST',
    body: params,
  });
}

// 党员活动
export async function politicalActiveTask (params) {
  return request ('/app/taskTX/service.do', {
    method: 'POST',
    body: params,
  });
}

// 获取党建资讯
export async function getnewsActivityList (params) {
  return request ('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}

// 收藏
export async function favorites (params) {
  return request ('/app/favorites/service.do', {
    method: 'POST',
    body: params,
  });
}
