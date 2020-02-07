import React, { Component } from 'react';
import NewList from '@/components/NewList';
import { connect } from 'dva';
import { Pagination, Empty, Input, Button } from 'antd';
import PageLoading from '@/components/PageLoading';
import { storage } from '@/utils/utils';
import styles from './index.less';

@connect(({ seekActivity, loading }) => ({
  seekActivity,
  loading: loading.effects['seekActivity/getNewsList'],
}))
class Seek extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      current: 1,
      searchValue: '',
      searchLoading: false,
      router: '',
    };
  }

  componentWillReceiveProps(props) {
    const { location } = props;
    const { router } = this.state;
    if (router !== location.pathname) {
      this.setState(
        {
          searchValue: '',
          current: 1,
          router: location.pathname,
        },
        () => {
          this.getNewsList(props);
        }
      );
    }
  }

  componentDidMount() {
    const { location } = this.props;
    this.setState(
      {
        router: location.pathname,
      },
      () => {
        this.getNewsList(this.props);
      }
    );
  }

  getNewsList = props => {
    const { dispatch, location } = props;
    const arrKey = location.pathname.split('/');
    const formData = {
      msgId: 'APP150',
      categoryId: arrKey[4],
      categoryType: Number(arrKey[3]),
      department: `${this.userInfo.orgid}`,
      index: '0',
      isComplete: 'false',
      userId: `${this.userInfo.id}`,
    };
    dispatch({
      type: 'seekActivity/getNewsList',
      payload: { text: JSON.stringify(formData) },
    });
  };

  renderItem = () => {
    const { seekActivity, loading } = this.props;
    const { newsList } = seekActivity;
    const { current, searchLoading } = this.state;
    if (newsList.length > 0 && !loading) {
      return (
        <div className={styles.seek}>
          <NewList {...this.props} newsList={newsList.slice(current * 5 - 5, current * 5)} />
          {newsList.length > 5 ? (
            <Pagination
              current={current}
              pageSize={1}
              onChange={page => {
                this.setState({
                  current: page,
                });
              }}
              total={Math.ceil(newsList.length / 5)}
              className={`${styles.pagination} party_pagination`}
            />
          ) : null}
        </div>
      );
    } else if (loading || searchLoading) {
      return <PageLoading />;
    }
    return <Empty description="暂无数据" style={{ marginTop: 50 }} />;
  };

  onchangeValue = e => {
    // console.log(e);
    this.setState({ searchValue: e.target.value });
  };

  onSearch = () => {
    const { dispatch, location } = this.props;
    const { searchValue } = this.state;
    const arr = location.pathname.split('/');
    this.setState({ searchLoading: true });
    const formatData = {
      categoryId: Number(arr[4]),
      categoryType: Number(arr[3]),
      department: `${this.userInfo.orgid}`,
      index: '0',
      isComplete: false,
      msgId: 'APP150',
      userId: `${this.userInfo.id}`,
    };
    dispatch({
      type: 'seekActivity/getNewsListBysearch',
      payload: {
        searchValue,
        content: { text: JSON.stringify(formatData) },
      },
      callBack: () => {
        this.setState({ searchLoading: false });
      },
    });
  };

  render() {
    const { searchValue } = this.state;
    return (
      <div className={`${styles.main} primary_btn`}>
        <Input
          placeholder="请输入搜索标题的关键字"
          className={styles.searchStyle}
          value={searchValue}
          onChange={this.onchangeValue}
        />
        <Button onClick={() => this.onSearch()}>搜索</Button>
        {this.renderItem()}
      </div>
    );
  }
}
export default Seek;
