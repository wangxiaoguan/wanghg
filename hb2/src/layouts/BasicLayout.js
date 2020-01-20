import SiderMenu from '@/components/SiderMenu';
import PageLoading from '@/components/PageLoading';
import Authorized from '@/utils/Authorized';

import React, {Suspense} from 'react';

import {Layout, Table} from 'antd';

import {connect} from 'dva';

import classNames from 'classnames';

import {formatMessage} from 'umi/locale';

import memoizeOne from 'memoize-one';

import Media from 'react-media';

import isEqual from 'lodash/isEqual';

import pathToRegexp from 'path-to-regexp';

import DocumentTitle from 'react-document-title';

import {ContainerQuery} from 'react-container-query';

import '../Antd.less';
import logo from '../assets/iconLogo.png';
import Exception403 from '../pages/Exception/403';

import styles from './BasicLayout.less';
import Header from './Header';
import Context from './MenuContext';


// lazy load SettingDrawer
// const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const {Content} = Layout;
const URL = require("url");

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

@connect(({global}) => ({
  global
}))
class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    // if (this.props.login.status !== 'ok') {
    //   this.props.dispatch(
    //     {
    //       type: 'login/logout',
    //     }
    //   );
    // }
  }

  componentDidMount() {
    const {
      dispatch,
      route: {routes, authority},
    } = this.props;
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: {routes, authority},
    });
    dispatch({
      type: 'global/getCitys',
    });

    let token = URL.parse(window.location.href, true).query.token;
    dispatch({
      type: 'global/getUserinfo',
      payload: token,
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const {collapsed, isMobile} = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  getContext() {
    const {location, breadcrumbNameMap} = this.props;
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
        if (route.path && pathToRegexp(route.path).test(key)) {
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

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return 'HBSQI';
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - HBSQI`;
  };

  getLayoutStyle = () => {
    const {fixSiderbar, isMobile, collapsed, layout} = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '190px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const {dispatch} = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    return null;
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    // if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
    //   return null;
    // }
    // return <SettingDrawer />;
  };

  render() {

    let token = URL.parse(window.location.href, true).query.token;
    if (!token || token.length === 0) {
      return <span className='CenterTip'>请先从内网登录</span>;
    }
    const user = this.props.global.user;
    if (!user) {
      return <span className='CenterTip'>加载用户信息，请稍候...</span>;
    }
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: {pathname},
      isMobile,
      menuData,
      breadcrumbNameMap,
      route: {routes},
      fixedHeader,
    } = this.props;

    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? {paddingTop: 0} : {};
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
          className="themeLayout"
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            <Authorized authority={routerConfig} noMatch={<Exception403 />}>
              {children}
            </Authorized>
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={<PageLoading />}>{this.renderSettingDrawer()}</Suspense>
      </React.Fragment>
    );
  }
}

export default connect(({global, setting, menu, login}) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  login,
  ...setting,
}))(props => {
  return (
    <Media query="(max-width: 599px)">
      {/* {isMobile => <BasicLayout {...props} isMobile={isMobile} />} */}
      {() => <BasicLayout {...props} />}
    </Media>
  );
});
