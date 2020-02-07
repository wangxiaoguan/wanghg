// import {requestCached} from '@/utils/request';
import { request } from '@/utils/request';

// 个人中心，我的考试
export async function getMenuList(params) {
  return request('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}
