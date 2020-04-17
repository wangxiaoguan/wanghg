import request from '@/utils/request';
import { DOWNLOAD_API } from '@/services/api';

export async function add(params) {
  return request('/services/standard/fhstdnoveltysearch/add', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/standard/fhstdregisteruser/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function refuse(params) {
  return request('/services/standard/fhstdnoveltysearch/audit/refuse', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/services/standard/fhstdnoveltysearch/audit/pass', {
    method: 'POST',
    body: params,
  });
}

export async function search(id) {
  return request(`/services/standard/fhstdnoveltysearch/${id}`);
}

export async function renew(params) {
  return request('/services/standard/fhstdnoveltysearch/update', {
    method: 'PUT',
    body: params,
  });
}

export async function downExportExcel(params) {
  return request('/services/standard/fhstdnoveltysearch/downloadtimeExport', {
    method: 'POST',
    body: params,
  },true);
}

export async function handleExportExcel(params) {
  return request('/services/standard/fhstdnoveltysearch/dealtimeExport', {
    method: 'POST',
    body: params,
  },true);
}

export async function pwdreset(id) {
  return request(`/services/standard/fhstdregisteruser/pwdreset/${id}`, {
    method: 'POST',
  });
}

export async function download(id) {
  return request(DOWNLOAD_API(id),{},true);
}


export async function removeApply(id) {
  return request(`/services/standard/fhstdnoveltysearch/delete/${id}`, {
    method: 'DELETE',
  });
}
