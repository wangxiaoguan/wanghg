import React from 'react';
import { Layout } from 'antd';
// import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import zhCN from 'antd/es/locale/zh_CN';
import router from 'umi/router';
import { message, ConfigProvider } from 'antd';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import Footer from './Footer';
// import { formatMessage } from 'umi/locale';
// import '@babel/polyfill';
// import Authorized from '@/utils/Authorized';
import logo from '@/assets/logo.svg';
// import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import PageLoading from '@/components/PageLoading';
import { storage } from '@/utils/utils';

import styles from './BasicLayout.less';

const { Content } = Layout;
// Object.setPrototypeOf = require ('setprototypeof');

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidMount() {
    const formData = {
      msgId: 'APP146',
    };
    const {
      dispatch,
      route: { routes, authority },
      location,
      partyTask,
    } = this.props;
    const params = location.query || {};
    const { osskey = '' } = params;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    // 判断是否有登录信息
    if (!userInfo && JSON.stringify(params) === '{}' && osskey === '') {
      // console.log('userInfo错误时', userInfo, params);
      message.warning('无法获取信息，请重新登录！');
      router.replace('/user/login');
      return;
    } else if (userInfo && osskey === '') {
      this.getData();
    } else
      if (osskey !== '') {
      // text={"msgId":"WEB_LOGIN","osskey":"TJRCx1DVUf2x80YbfIxs8A=="}
      const param = {
        msgId: 'WEB_LOGIN',
        osskey: osskey,
      };
      dispatch({
        type: 'global/login',
        payload: {
          text: JSON.stringify(param),
        },
        callBack: response => {
          if (response.code === '0' && response.resultMap && response.resultMap.userInfo) {
            const userData = response.resultMap.userInfo;
            userData.showMS = response.resultMap.showMS;
            storage.setLocal('userInfo', JSON.stringify(userData));
            this.getData();
            // window.location = '#/./home';
            router.replace('/home');
          } else {
            message.error(response.message || '用户名或密码错误');
            router.replace('/user/login');
          }
        },
      });
    }
  }

  getData = () => {
    const formData = {
      msgId: 'APP146',
    };
    const {
      dispatch,
      route: { routes, authority },
      location,
      partyTask,
    } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    dispatch({
      type: 'setting/getSetting',
    });
    // 获取菜单信息
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority, params: { text: JSON.stringify(formData) } },
      callback: res => {
        // 判断账号获取菜单信息是否正确
        if (res.code === '0') {
          // console.log(res);
          if (res.resultMap && res.resultMap.menuList.length === 0) {
            message.warning('无法获取正确信息，请重新登录！');
            router.replace('/user/login');
            return;
          }
        }
        router.replace({
          pathname: location.pathname,
          query: location.query,
        });
      },
    });
    const { navList } = partyTask;
    const formData1 = {
      msgId: 'GET_USER_LEVEL',
      userId: userInfo.id,
    };
    //获取主题教育菜单，以及用户对应未完成任务
    dispatch({
      type: 'partyTask/getThematicList',
      payload: {
        text: JSON.stringify(formData1),
      },
      callBack: (res, postInfo) => {
        if (postInfo.length) {
          // 获取未完成任务数量
          const formTaskData = {
            level: postInfo[0].level,
            msgId: 'GET_USER_UNDOING',
            partyId: postInfo[0].partyId,
            userId: userInfo ? userInfo.id : '',
          };
          // console.log('formTaskData', formTaskData, res);
          dispatch({
            type: 'home/getTaskCount',
            payload: {
              text: JSON.stringify(formTaskData),
            },
          });
        }
        const list = res.map(item => {
          return {
            id: item.sceneClassifyId,
            name: item.sceneClassifyName,
            type: 'education',
          };
        });
        const newNavList = navList;
        navList[2].categorylist = list;
        dispatch({
          type: 'partyTask/setTableList',
          payload: {
            navList: newNavList,
          },
        });
      },
    });
  };

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'partyTask/clear',
    });
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path === key) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  // getPageTitle = (pathname, breadcrumbNameMap) => {
  //   const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

  //   if (!currRouterData) {
  //     return 'Ant Design Pro';
  //   }
  //   const pageName = formatMessage({
  //     id: currRouterData.locale || currRouterData.name,
  //     defaultMessage: currRouterData.name,
  //   });

  //   return `${pageName} - Ant Design Pro`;
  // };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const { navTheme, layout: PropsLayout, children, isMobile, menuData, fixedHeader } = this.props;
    // console.log('menuData',menuData)
    const isTop = PropsLayout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            {/* <Authorized authority={routerConfig} noMatch={<p>Exception403</p>}> */}
            <div className={styles.contentCenter}>{children}</div>
            {/* </Authorized> */}
          </Content>
          <Footer/>
        </Layout>
      </Layout>
    );
    // 判断是否获取到菜单
    if (!menuData || menuData.length < 5) {
      return <PageLoading/>;
    }
    return (
      <React.Fragment>
        {/* <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}> */}
        <ConfigProvider locale={zhCN}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </ConfigProvider>
        {/* </DocumentTitle> */}
      </React.Fragment>
    );
  }
}

export default connect(({ global, partyTask, setting, menu, home }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  menu,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
  partyTask,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile}/>}
  </Media>
));
