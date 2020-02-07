export function createRouteData(path, name, componentPath, children = null) {
  return {
    path,
    name,
    component: componentPath,
    routes: children,
  };
}

// 404页面
export const errorPage = {
  component: '404',
};

// 加载页面
export const loadingPage = {
  component: '../components/PageLoading',
};

export const paths = {
  // 资讯详情
  NewDetail: './details/newDetail',

  // 活动详情
  ActivityDetail: './details/activityDetail',

  // 参加考试
  joinExam: './details/examOnline/joinExam',

  //查看考试结果
  viewExam: './details/examOnline/viewExam',
};
