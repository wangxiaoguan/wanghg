import request from '@/utils/request';
import {DOWNLOAD_API} from '../api';

export async function add(params) {
  return request('/services/exam/fhexamtechnologyconsult/save', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/services/exam/fhexamtechnologyconsult/update', {
    method: 'POST',
    body: params,
  });
}

export async function save(params) {
  return request('/services/exam/fhexamtechnologyconsult/answer', {
    method: 'POST',
    body: params,
  });
}


export async function remove(id) {
  return request(`/services/exam/fhexamtechnologyconsult/delete/${id}`, {
    method: 'POST',
  });
}

export async function download(id) {
  // console.log(id)
  return request(DOWNLOAD_API(5568), {
    method: 'GET',
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`services/exam/fhexamtechnologyconsult/getById/${id}`);
}
