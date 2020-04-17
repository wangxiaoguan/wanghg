import request from '@/utils/request';

export async function cityExportInfo(params) {
  return request('/services/wto/wtohbexportinfo/hbcityexportinfo', {
    method: 'POST',
    body: params,
  });
}