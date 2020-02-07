import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { storage } from '@/utils/utils';
import ThematicWrapper from '@/components/ThematicWrapper';
import PageLoading from '@/components/PageLoading';
// import styles from './index.less';

// loading:loading.effects['thematicEduction']
// 主题教育
@connect(({ thematicEducation, loading }) => ({
  thematicEducation,
}))
class ThematicEducation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: '',
    };
  }

  componentDidUpdate(props) {
    const { location } = props;
    const { currentMenu } = this.state;
    const arrKey = location.pathname.split('/');
    // 菜单切换，栏目同步切换
    if (currentMenu !== arrKey[2]) {
      this.setState({
        currentMenu: arrKey[2],
      });
    }
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const arrKey = location.pathname.split('/');
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formData = {
      msgId: 'GET_EDU_MENU_CATGORY',
      menuId: arrKey[2],
      userId: userInfo.id,
    };
    dispatch({
      type: 'thematicEducation/getThematicNavList',
      payload: { text: JSON.stringify(formData) },
    });
  }

  handleNavChange = (type, key) => {
    const { match } = this.props;
    router.replace({
      pathname: `${match.url}/${type}/${key}`,
    });
  };

  render() {
    const { thematicEducation } = this.props;
    const { navList } = thematicEducation;
    if (navList.length > 0) {
      return (
        <ThematicWrapper navList={navList} {...this.props} handleNavChange={this.handleNavChange} />
      );
    }
    return <PageLoading />;
  }
}
export default ThematicEducation;
