import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { storage } from '@/utils/utils';
import TaskWrapper from '@/components/TaskWrapper';
import PageLoading from '@/components/PageLoading';
// import styles from './index.less';

// 党建任务
@connect(({ partyTask, loading }) => ({
  partyTask,
}))
class partyTask extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {};
  }

  handleNavChange = (type, key) => {
    const { match } = this.props;
    router.replace({
      pathname: `${match.url}/${type}/${key}`,
    });
  };

  render() {
    const { partyTask } = this.props;
    const { navList } = partyTask;
    if (navList.length > 0 && navList[2].categorylist.length > 0) {
      return (
        <TaskWrapper navList={navList} {...this.props} handleNavChange={this.handleNavChange} />
      );
    }
    return <PageLoading />;
  }
}
export default partyTask;
