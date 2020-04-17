/**
 * Created by skyinno on 2018/11/23.
 */

import request from '@/utils/request';

export async function getPasswordRule() {
  // 获取密码规则配置信息
  return request(`/cas/registry/getPasswordRule`);
}

export async function updatePasswordRule(params) {
  // 修改密码规则配置信息接口
  return request(`/cas/registry/updatePasswordRule`, {
    method: 'POST',
    body: params,
  });
}
