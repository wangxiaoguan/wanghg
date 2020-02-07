import { createRouteData, paths, errorPage, loadingPage } from './../routerUtil';

export default createRouteData('/home', '首页', './home', [
  createRouteData('/home/news', '', paths.NewDetail),
  createRouteData('/home/activity', '', paths.ActivityDetail),
  createRouteData('/home/activity/joinExam', '', paths.joinExam),
  createRouteData('/home/activity/viewExam', '', paths.viewExam),
  //专题类型
  createRouteData('/home/topics/:topicsId', '', './topics'),
  createRouteData('/home/topics/:topicsId/news', '', paths.NewDetail),
  createRouteData('/home/topics/:topicsId/activity', '', paths.ActivityDetail),
  createRouteData('/home/topics/:topicsId/activity/joinExam', '', paths.joinExam),
  createRouteData('/home/topics/:topicsId/activity/viewExam', '', paths.viewExam),
  errorPage,
  loadingPage,
]);
