import {requestCached} from '@/utils/request';

// 个人中心，我的考试
export async function getThematicNavList (params) {
  return requestCached ('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}
