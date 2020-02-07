import { createRouteData, errorPage, loadingPage, paths } from './../routerUtil';

export default createRouteData('/seekActivity/:nav', '', './seekActivity', [
  createRouteData('/seekActivity/:menu/:type/:navId', '', './seekActivity/seek'),
  createRouteData('/seekActivity/:menu/:type/:navId/news', '', paths.NewDetail),
  createRouteData('/seekActivity/:menu/:type/:navId/activity', '', paths.ActivityDetail),
  createRouteData('/seekActivity/:menu/:type/:navId/activity/joinExam', '', paths.joinExam),
  createRouteData('/seekActivity/:menu/:type/:navId/activity/viewExam', '', paths.viewExam),
  // 专题类型
  createRouteData('/seekActivity/:menu/:type/:navId/topics/:topicsId', '', './topics'),
  createRouteData('/seekActivity/:menu/:type/:navId/topics/:topicsId/news', '', paths.NewDetail),
  createRouteData(
    '/seekActivity/:menu/:type/:navId/topics/:topicsId/activity',
    '',
    paths.ActivityDetail
  ),
  createRouteData(
    '/seekActivity/:menu/:type/:navId/topics/:topicsId/activity/joinExam',
    '',
    paths.joinExam
  ),
  createRouteData(
    '/seekActivity/:menu/:type/:navId/topics/:topicsId/activity/viewExam',
    '',
    paths.viewExam
  ),
  errorPage,
  loadingPage,
]);
