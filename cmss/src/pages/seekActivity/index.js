import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import NavigationWrapper from '@/components/NavigationWrapper';
import PageLoading from '@/components/PageLoading';
import BlankLayout from '@/layouts/BlankLayout';
import { storage } from '@/utils/utils';
// import styles from './index.less';

// loading:loading.effects['thematicEduction']
// 学习园地
@connect(({ seekActivity, loading }) => ({
  seekActivity,
  loading: loading.effects['seekActivity/getNavList'],
}))
class SeekActivity extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      currentMenu: '',
    };
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const arrKey = location.pathname.split('/');
    const formData = {
      msgId: 'APP155',
      menuId: arrKey[2],
      userId: `${this.userInfo.id}`,
    };
    dispatch({
      type: 'seekActivity/getNavList',
      payload: { text: JSON.stringify(formData) },
    });
  }

  componentDidUpdate(props) {
    const { location, dispatch } = this.props;
    const { currentMenu } = this.state;
    const arrKey = location.pathname.split('/');
    // 菜单切换，栏目同步切换
    if (currentMenu !== arrKey[2]) {
      this.setState({
        currentMenu: arrKey[2],
      });
      dispatch({
        type: 'seekActivity/changeNavList',
        payload: { navList: [], newsList: [] },
      });
    }
  }

  handleNavChange = (type, key) => {
    const { match } = this.props;
    router.replace({
      pathname: `${match.url}/${type}/${key}`,
    });
  };

  render() {
    const { seekActivity, location, loading, children } = this.props;
    const { navList } = seekActivity;
    const { currentMenu } = this.state;
    const arrKey = location.pathname.split('/');
    // console.log('===', children, navList, loading, currentMenu, arrKey[2]);
    if (navList.length > 0 && !loading && currentMenu === arrKey[2]) {
      return (
        <NavigationWrapper
          navList={navList}
          {...this.props}
          handleNavChange={this.handleNavChange}
        />
      );
    } else if (navList.length === 0 && !loading) {
      return <BlankLayout />;
    }
    return <PageLoading />;
  }
}
export default SeekActivity;
