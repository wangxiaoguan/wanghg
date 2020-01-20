import request from '@/utils/request';

export async function fhwtoaccessoperate() {
  return request(`/services/wto/fhwtoaccessoperate/list/all`);
}
