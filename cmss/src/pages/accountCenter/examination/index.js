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
class Examination extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      current: 1,
      tabKey: '1',
      searchValue: '',
      router: '',
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
    const { searchValue, tabKey } = this.state;
    this.setState({ searchLoading: true });
    const formatData = {
      categoryId: 94,
      categoryType: 2,
      department: `${this.userInfo.orgid}`,
      index: 0,
      isComplete: tabKey === '2',
      source: 'web',
      msgId: 'PARTY_BUILDING_REMIND_LIST',
      userId: `${this.userInfo.id}`,
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

  onchangeValue = e => {
    this.setState({ searchValue: e.target.value });
  };

  getNewsList = type => {
    const { dispatch } = this.props;
    const formatData = {
      categoryId: 94,
      categoryType: 2,
      department: `${this.userInfo.orgid}`,
      index: 0,
      isComplete: type,
      source: 'web',
      msgId: 'PARTY_BUILDING_REMIND_LIST',
      userId: `${this.userInfo.id}`,
    };
    dispatch({
      type: 'accountCenter/getList',
      payload: {
        text: JSON.stringify(formatData),
      },
    });
  };

  onChange = page => {
    this.setState({
      current: page,
    });
  };

  changeTab = key => {
    if (key === '1') {
      this.onSearch();
      this.setState({ current: 1, tabKey: '1' }, () => {
        this.onSearch();
      });
    } else {
      this.setState({ current: 1, tabKey: '2' }, () => {
        this.onSearch();
      });
    }
  };

  getTabPane = (key, infoList) => {
    const { current } = this.state;
    const dataSource = infoList;
    return (
      <div>
        <NewList
          {...this.props}
          newsList={dataSource.slice(current * 5 - 5, current * 5)}
          newListType={key === '1' ? 'waitTest' : 'overTest'}
        />
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
            <TabPane tab="待考" key="1">
              {this.getTabPane('1', infoList)}
            </TabPane>
            <TabPane tab="已考" key="2">
              {this.getTabPane('2', infoList)}
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default Examination;
