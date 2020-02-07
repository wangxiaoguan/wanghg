import thematic from './routers/thematic';
import partyTask from './routers/task';
import home from './routers/home';
import seekActivity from './routers/seekActivity';
import accountCenter from './routers/accountCenter';
import addressBook from './routers/addressBook';

import { errorPage, loadingPage } from './routerUtil';

export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      errorPage,
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/home' },
      // 首页
      home,

      // 主题教育类型
      thematic,

      // 党建任务类型
      partyTask,

      // 资讯活动类型
      seekActivity,

      //  个人中心
      accountCenter,

      // 通讯录
      addressBook,

      errorPage,
    ],
  },
  errorPage,
  loadingPage,
];
