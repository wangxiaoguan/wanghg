import request from '@/utils/request';
import { DOWNLOAD_API } from '@/services/api';

export async function TotalData(params) {
  return request(`/services/standard/fhstdprocess/getByStdId/${params.id}`, {
    method: 'GET',
    // body: params,
  });
}

export async function FLoderList(params) {
  return request(`/services/standard/fhstdprocesstype/listAll`, {
    method: 'GET',
    // body: params,
  });
}

export async function FileList(params) {
  return request(`/services/standard/fhstdfile/list/1/20?Q=typeId_EQ=${params.id}&Q=deleteStatus_EQ=1`, {
    method: 'GET',
    // body: params,
  });
}

export async function FileUpload(params) {
  return request('/services/standard/fhstdfile/insert', {
    method: 'POST',
    body: params,
  });
}

export async function FileDelete(params) {
  return request(`/services/standard/fhstdfile/delete/${params.id}`, {
    method: 'DELETE',
    // body: params,
  });
}

export async function FileEditCheck(params) {
  return request('/services/standard/fhstdfile/check', {
    method: 'POST',
    body: params,
  });
}

export async function FileDetailGet(params) {
  return request('/services/standard/fhstdfile/getEditInfo', {
    method: 'POST',
    body: params,
  });
}