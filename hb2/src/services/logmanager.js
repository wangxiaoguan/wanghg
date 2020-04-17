import request from '@/utils/request';

export async function getLogList(params) {
  const { current, pageSize } = params;
  return request(`/cas/log/list/${current}/${pageSize}`);
}

export default getLogList;
