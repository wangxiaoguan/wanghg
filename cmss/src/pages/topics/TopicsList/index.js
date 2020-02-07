import React, { Component } from 'react';
import { connect } from 'dva';
import { Pagination } from 'antd';
import NewList from '@/components/NewList';
import { storage } from '@/utils/utils';
import styles from '../index.less';

@connect(({ topicsList }) => ({
  topicsList,
}))
class TopicsList extends Component {
  constructor(props) {
    super(props);

    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      current: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    this.setState({
      current: 1,
    });
    dispatch({
      type: 'topicsList/updateState',
      payload: {
        infoList: [],
      },
    });

    this.getList();
  }

  componentDidUpdate(perProps) {
    const {
      currentKey,
      id,
      dispatch,
      topicsList: { cacheLists = {} },
    } = this.props;

    if (currentKey !== perProps.currentKey && currentKey === `${id}`) {
      const infoList = cacheLists[`${id}`];
      dispatch({
        type: 'topicsList/updateState',
        payload: {
          infoList,
        },
      });
    }
  }

  getList = () => {
    const {
      dispatch,
      topicsId,
      id,
      topicsList: { cacheLists = {} },
    } = this.props;

    const formatData = {
      msgId: 'APP182',
      userId: this.userInfo.id,
      source: 'web',
      objectId: topicsId,
      categoryId: id,
      index: 0,
    };
    dispatch({
      type: 'topicsList/getList',
      payload: {
        text: JSON.stringify(formatData),
      },
      cacheLists,
      id,
    });
  };

  onChange = page => {
    this.setState({
      current: page,
    });
  };

  render() {
    const { topicsList = {} } = this.props;
    const { current } = this.state;
    const { infoList = [] } = topicsList;
    return (
      <div>
        <NewList {...this.props} newsList={infoList.slice(current * 5 - 5, current * 5)} />
        {infoList.length > 5 ? (
          <Pagination
            current={current}
            pageSize={1}
            onChange={this.onChange}
            total={Math.ceil(infoList.length / 5)}
            className={styles.pagination}
          />
        ) : null}
      </div>
    );
  }
}

export default TopicsList;
