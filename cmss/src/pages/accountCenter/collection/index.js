import React from 'react';
import { Spin, Input, Button, Pagination } from 'antd';
import NewList from '@/components/NewList';
import { connect } from 'dva';
import router from 'umi/router';
import { loadData } from './help';
import styles from './index.less';

@connect(({ myCollect, loading }) => ({
  myCollect,
  loading: loading.effects['myCollect/loadFavorites'],
}))
class Collection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: props.myCollect.search,
      current: 1,
      path: '',
      searchLoading: false,
    };
  }

  componentWillReceiveProps() {
    const { location } = this.props;
    const { path } = this.state;
    if (path !== location.pathname) {
      this.setState({
        current: 1,
        path: location.pathname,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'myCollect/updateState',
      payload: {
        userId: '',
        total: 0,
        favoritesList: [],
        error: '',
        index: 0,
        search: '',
      },
    });
  }

  onChangePagination = page => {
    this.setState({
      current: page,
    });
  };

  onClick = item => {
    const {
      match: { url },
    } = this.props;
    router.push({
      pathname: `${url}/${`${item.objectType}` === '2' ? 'activity' : 'news'}`,
      query: {
        id: item.id,
        subType: item.type,
      },
    });
  };

  onSearch = () => {
    const { dispatch } = this.props;
    const { searchText } = this.state;
    this.setState({ searchLoading: true });
    dispatch({
      type: 'myCollect/loadFavorites',
      payload: {
        index: 0,
        search: searchText,
      },
      callBack: () => {
        this.setState({ searchLoading: false });
      },
    });
  };

  render() {
    const { myCollect, loading } = this.props;
    const { searchText, current, searchLoading } = this.state;
    const datas = loadData(myCollect.favoritesList);
    return (
      <Spin spinning={loading || searchLoading}>
        <div className={styles.main}>
          <div>
            <Input
              value={searchText}
              placeholder="请输出搜索标题的关键字"
              onChange={event => {
                this.setState({ searchText: event.target.value });
              }}
            />
            <Button onClick={this.onSearch}>搜索</Button>
          </div>
          <div>
            <NewList {...this.props} newsList={datas.slice(current * 5 - 5, current * 5)} />
            {myCollect.total > 5 ? (
              <Pagination
                current={current}
                pageSize={5}
                onChange={this.onChangePagination}
                total={datas.length}
                className={styles.pagination}
              />
            ) : null}
          </div>
        </div>
      </Spin>
    );
  }
}

export default Collection;
