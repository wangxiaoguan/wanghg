import React, { Component } from 'react';
import { Input, Button, Pagination, Tabs, Spin } from 'antd';
import NewList from '@/components/NewList';
import { connect } from 'dva';
import { storage } from '@/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ accountCenter, loading }) => ({
  accountCenter,
  loading: loading.effects['accountCenter/getList'],
}))
class Study extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      tabKey: '1',
      searchValue: '',
      router: '',
      userInfo: JSON.parse(storage.getLocal('userInfo')),
      searchLoading: false,
    };
  }

  componentWillReceiveProps() {
    const { location } = this.props;
    const { router } = this.state;
    if (router !== location.pathname) {
      this.setState({
        searchValue: '',
        current: 1,
        router: location.pathname,
      });
    }
  }

  onSearch = () => {
    const { dispatch } = this.props;
    const { searchValue, userInfo, tabKey } = this.state;
    this.setState({ searchLoading: true });
    const formatData = {
      categoryId: 24,
      categoryType: 1,
      department: `${userInfo.orgid}`,
      index: 0,
      isComplete: tabKey === '2',
      source: 'web',
      msgId: 'PARTY_BUILDING_REMIND_LIST',
      userId: `${userInfo.id}`,
    };
    dispatch({
      type: 'accountCenter/getNewsListBysearch',
      payload: {
        searchValue,
        content: { text: JSON.stringify(formatData) },
      },
      callBack: () => {
        this.setState({ searchLoading: false });
      },
    });
  };

  changeTab = key => {
    if (key === '1') {
      this.setState({ current: 1, tabKey: '1' }, () => {
        this.onSearch();
      });
    } else {
      this.setState({ current: 1, tabKey: '2' }, () => {
        this.onSearch();
      });
    }
  };

  onChange = page => {
    this.setState({
      current: page,
    });
  };

  getTabPane = (key, infoList) => {
    const { current } = this.state;
    const dataSource = infoList;
    return (
      <div>
        <NewList {...this.props} newsList={dataSource.slice(current * 5 - 5, current * 5)} />
        {dataSource.length > 5 ? (
          <Pagination
            current={current}
            pageSize={1}
            onChange={this.onChange}
            total={Math.ceil(dataSource.length / 5)}
            className={`${styles.pagination} party_pagination`}
          />
        ) : null}
      </div>
    );
  };

  onchangeValue = e => {
    this.setState({ searchValue: e.target.value });
  };

  render() {
    const { accountCenter, loading } = this.props;
    const { tabKey, searchValue, searchLoading } = this.state;
    const { infoList } = accountCenter;
    return (
      <div className={`${styles.main} primary_btn`}>
        <Input
          placeholder="请输入搜索标题的关键字"
          className={styles.searchStyle}
          value={searchValue}
          onChange={this.onchangeValue}
        />
        <Button onClick={() => this.onSearch()}>搜索</Button>
        <Spin spinning={loading || searchLoading}>
          <Tabs defaultActiveKey={tabKey} onChange={this.changeTab} animated={false}>
            <TabPane tab="未完成" key="1">
              {this.getTabPane('1', infoList)}
            </TabPane>
            <TabPane tab="已完成" key="2">
              {this.getTabPane('2', infoList)}
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default Study;
