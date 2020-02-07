import {request} from '../utils/request';

// 获取在线考试（待考、已考）数据
export async function getonlineExam(params) {
  console.log(params)
  return request('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}

// 参加自定义题目考试数据接口
export async function getJoinExam(params) {
  return request('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}

// 参加随机题库考试数据接口
export async function getJoinRadomExam(params) {
  return request('/app/service.do', {
    method: 'POST',
    body: params,
  });
}

// 参加考试提交接口
export async function JoinExamSubmit(params) {
  return request('/app/service.do', {
    method: 'POST',
    body: params,
  });
}

// 查看考试结果带解析
export async function viewExam(params) {
  return request('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}

// 查看考试分数
export async function viewExamScore(params) {
  return request('/app/service.do', {
    method: 'POST',
    body: params,
  });
}
