import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { MenuList /* PartyMenuList */ } from './help';
import NavigationWrapper from '@/components/NavigationWrapper';
// import styles from './index.less';

@connect(({ accountCenter, loading }) => ({
  accountCenter,
  // loading:loading.effects['thematicEduction']
}))

// 个人中心
class AccountCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: MenuList,
    };
  }

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   setTimeout(() => {
  //     dispatch({
  //       type: 'partyTask/changeNavList',
  //       payload: {
  //         navList: nav,
  //       },
  //     });
  //   }, 500);
  // }

  handleNavChange = (type, key) => {
    const { match } = this.props;
    router.replace({
      pathname: `${match.url}/${key}`,
    });
  };

  render() {
    const { location } = this.props;
    const { menuList } = this.state;
    const arrKeys = location.pathname.split('/');
    const initSelectKeys = arrKeys.length > 3 ? [arrKeys[2]] : [arrKeys.pop()];
    return (
      <NavigationWrapper
        navList={menuList}
        initSelectKeys={initSelectKeys}
        initOpenKeys={initSelectKeys}
        {...this.props}
        handleNavChange={this.handleNavChange}
      />
    );
  }
}
export default AccountCenter;
