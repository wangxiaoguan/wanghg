import {request} from '@/utils/request';

export async function query (params) {
  return request (`/app/user/service.do`, {
    method: 'POST',
    body: params,
  });
}

export async function queryCurrent () {
  return request ('/api/currentUser');
}

export async function queryNotices () {
  return request ('/api/notices');
}
