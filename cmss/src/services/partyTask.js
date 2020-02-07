import { request, requestCached } from '@/utils/request';
import config from '../../config/commenConfig';
export async function getData(params) {
  return request(`/app/taskTX/service.do`, {
    method: 'POST',
    body: params,
  });
}

export async function getDataCached(params) {
  return requestCached(`/app/taskTX/service.do`, {
    method: 'POST',
    body: params,
  });
}

export async function getTableData(params) {
  return request(`/app/taskNew/service.do`, {
    method: 'POST',
    body: params,
  });
}

// 选择咨询
export function getSeekTableData(param) {
  return request(`/app/newsActivity/service.do?`, {
    method: 'POST',
    body: param,
  });
}

export function uploadFile(file) {
  // console.log('file=', file);
  return request(`${config.filePath}/system/file/sftpUpload/AttachmentUpload/paty`, {
    method: 'POST',
    body: file,
  });
}
