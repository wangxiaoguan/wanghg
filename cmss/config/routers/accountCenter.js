import { createRouteData, errorPage, loadingPage } from './../routerUtil';

const NewDetail = './details/newDetail';
const ActivityDetail = './details/activityDetail';

export default createRouteData('/accountCenter', '个人中心', './accountCenter', [
  {
    path: '/accountCenter',
    redirect: '/accountCenter/archive',
  },
  {
    path: '/accountCenter/task/:menu/:theme/:listId/detail',
    redirect: '/task/:menu/:theme/:listId/detail',
  },

  // 我的档案
  createRouteData('/accountCenter/archive', 'archive', './accountCenter/archive'),
  // 我的学习
  createRouteData('/accountCenter/study', 'study', './accountCenter/study'),

  // 我的考试
  createRouteData('/accountCenter/examination', 'examination', './accountCenter/examination'),

  // 个人中心资讯
  createRouteData('/accountCenter/:navType/news', 'news', NewDetail),

  //个人中心活动
  createRouteData('/accountCenter/:navType/activity', 'news', ActivityDetail),
  createRouteData('/accountCenter/:navType/activity/joinExam', 'joinExam', './details/examOnline/joinExam'),
  createRouteData('/accountCenter/:navType/activity/viewExam', 'viewExam', './details/examOnline/viewExam'),

  // 事项提醒
  createRouteData('/accountCenter/remind', 'remind', './accountCenter/remind'),

  errorPage,
  loadingPage,
]);
