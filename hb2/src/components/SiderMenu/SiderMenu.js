import {Layout} from 'antd';

import React, {PureComponent, Suspense} from 'react';

import Link from 'umi/link';

import classNames from 'classnames';

import PageLoading from '../PageLoading';

import {getDefaultCollapsedSubMenus} from './SiderMenuUtils';
import styles from './index.less';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const {Sider} = Layout;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {pathname} = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const {menuData} = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  render() {
    const {logo, collapsed, onCollapse, fixSiderbar, theme} = this.props;
    const {openKeys} = this.state;
    const defaultProps = collapsed ? {} : {openKeys};

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        // onCollapse={onCollapse}
        width={190}
        theme={theme}
        className={`${siderClassName} themeSider`}
      >
        <div className={`${styles.logo} themeLogo`} id="logo">
          <Link to="/">
            <img src={logo} alt="logo" className={styles.imgLogo} />
            <img src={require('../../assets/iconHome.png')} alt="home" />
          </Link>
        </div>
        <Suspense fallback={<PageLoading />}>
          <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{width: '100%'}}
            {...defaultProps}
          />
        </Suspense>
      </Sider>
    );
  }
}
