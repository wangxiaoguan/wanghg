import {requestCached, request} from '@/utils/request';

export async function getNavList (params) {
  return requestCached ('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}

export async function getNewsList (params) {
  return request ('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}
