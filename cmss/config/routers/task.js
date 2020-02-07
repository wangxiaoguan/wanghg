import { createRouteData, errorPage, loadingPage, paths } from './../routerUtil';

export default createRouteData('/task/:nav', '党建任务', './partyTask', [
  // 任务列表页
  createRouteData('/task/:menu/deployment/:listId', '', './partyTask/deployment'),

  // 其他任务页
  createRouteData('/task/:menu/normalTask/:listId', '', './partyTask/deployment'),

  // 主题教育任务页
  createRouteData('/task/:menu/education/:listId', '', './partyTask/education'),

  // 新增任务页
  createRouteData('/task/:menu/:theme/:listId/createNew', '', '../components/createNew'),

  // 编辑任务页
  createRouteData('/task/:menu/:theme/:listId/edit', '', '../components/createNew'),

  // 任务详情页
  createRouteData('/task/:menu/:theme/:listId/detail', '', '../components/taskDetail'),

  // 资讯
  createRouteData('/task/:menu/:theme/:listId/news', '', paths.NewDetail),

  // 活动
  createRouteData('/task/:menu/:theme/:listId/activity', '', paths.ActivityDetail),

  createRouteData('/task/:menu/:theme/:listId/activity/joinExam', '', paths.joinExam),

  createRouteData('/task/:menu/:theme/:listId/activity/viewExam', '', paths.viewExam),

  //专题类型
  createRouteData('/task/:menu/:theme/:listId/topics/:topicsId', '', './topics'),
  createRouteData('/task/:menu/:theme/:listId/topics/:topicsId/news', '', paths.NewDetail),
  createRouteData('/task/:menu/:theme/:listId/topics/:topicsId/activity', '', paths.ActivityDetail),
  createRouteData(
    '/task/:menu/:theme/:listId/topics/:topicsId/activity/joinExam',
    '',
    paths.joinExam
  ),
  createRouteData(
    '/task/:menu/:theme/:listId/topics/:topicsId/activity/viewExam',
    '',
    paths.viewExam
  ),

  //  查看任务完成率
  createRouteData(
    '/task/:menu/:theme/:listId/detail/completionRate',
    '',
    '../components/taskDetail/completionRate'
  ),

  // 党建工作统计
  createRouteData('/task/:menu/partystat/:listId', '', './partyTask/partystat/index'),

  // 党支部列表（党支部上一级）
  createRouteData('/task/:menu/partystat/:listId/allRank', '', './partyTask/partystat/allRank'),

  // 党支部列表(党支部)
  createRouteData(
    '/task/:menu/partystat/:listId/allRank/party',
    '',
    './partyTask/partystat/PartyBranchTasksSituation'
  ),

  // 党支部列表(党支部)
  createRouteData(
    '/task/:menu/partystat/:listId/party',
    '',
    './partyTask/partystat/PartyBranchTasksSituation'
  ),

  // 党建统计执行情况详情页
  createRouteData('/task/:menu/partystat/:listId/detail', '', './partyTask/partystat/detail'),

  loadingPage,
  errorPage,
]);
