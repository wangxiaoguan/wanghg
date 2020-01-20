import request from '@/utils/request';

export async function regionStatistics(body) {
  return request('/services/exam/fhexamorg/dataStatistics', {
    method: 'POST',
    body,
  });
}

export async function provinceStatistics(body) {
  return request('/services/exam/fhexamorg/dataStatistics', {
    method: 'POST',
    body,
  });
}


export async function comprehensiveStatistics(body) {
  return request(`/services/exam/fhexamorg/dataStatistics`, {
    method: 'POST',
    body
  });
}

