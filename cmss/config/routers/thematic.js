import { createRouteData, errorPage, paths, loadingPage } from './../routerUtil';

export default createRouteData('/thematic/:nav', '主题教育', './thematicEducation', [
  createRouteData('/thematic/:menu/:type/:listId', '', './thematicEducation/main'),

  // 查看任务详情
  createRouteData('/thematic/:menu/:type/:listId/detail', '', '../components/taskDetail'),

  // 转发任务
  createRouteData('/thematic/:menu/:type/:listId/createNew', '', '../components/createNew'),

  // 资讯
  createRouteData('/thematic/:menu/:theme/:listId/news', '', paths.NewDetail),

  // 活动
  createRouteData('/thematic/:menu/:theme/:listId/activity', '', paths.ActivityDetail),

  createRouteData('/thematic/:menu/:theme/:listId/activity/joinExam', '', paths.joinExam),

  createRouteData('/thematic/:menu/:theme/:listId/activity/viewExam', '', paths.viewExam),

  // 专题类型
  createRouteData('/thematic/:menu/:theme/:listId/topics/:topicsId', '', './topics'),
  createRouteData('/thematic/:menu/:theme/:listId/topics/:topicsId/news', '', paths.NewDetail),
  createRouteData(
    '/thematic/:menu/:theme/:listId/topics/:topicsId/activity',
    '',
    paths.ActivityDetail
  ),
  createRouteData(
    '/thematic/:menu/:theme/:listId/topics/:topicsId/activity/joinExam',
    '',
    paths.joinExam
  ),
  createRouteData(
    '/thematic/:menu/:theme/:listId/topics/:topicsId/activity/viewExam',
    '',
    paths.viewExam
  ),

  // 查看任务完成率
  createRouteData(
    '/thematic/:menu/:type/:listId/detail/completionRate',
    '',
    '../components/taskDetail/completionRate'
  ),
  loadingPage,
  errorPage,
]);
