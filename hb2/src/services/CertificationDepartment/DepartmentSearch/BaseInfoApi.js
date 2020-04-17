import request from '@/utils/request';

export async function remove(param) {
  return request(`/services/exam/fhexamdatum/update`, {
    method: 'POST',
    body: param
  });
}

export async function add(param) {
  return request(`/services/exam/fhexamorg/insert`, {
    method: 'POST',
    body: param,
  });
}

export async function update(param) {
  return request(`/services/exam/fhexamorg/update`, {
    method: 'PUT',
    body: param,
  });
}

export async function search(id) {
  return request(`/services/exam/fhexamorg/selectByOrgId/${id}`);
}

export async function logSearch(id) {
  return request(`/services/exam/examorghistory/getById/${id}`);
}

export async function getIndustry() {
  return request(`/services/exam/fhexamorg/getIndustry`);
}