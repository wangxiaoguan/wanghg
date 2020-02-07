import React, { Component } from 'react';
import { Tabs, Spin, Popover, Typography } from 'antd';
import { connect } from 'dva';
import { storage } from '@/utils/utils';
import styles from './index.less';
import BreadCrumbDetail from '@/components/BreadCrumbDetail';
import TopicsList from './TopicsList';

const { TabPane } = Tabs;
const { Paragraph } = Typography;

@connect(({ topics, topicsList, loading }) => ({
  topics,
  topicsList,
  loading: loading.effects['topics/getChannels'] || loading.effects['topicsList/getList'],
}))
class Topics extends Component {
  constructor(props) {
    super(props);

    this.userInfo = JSON.parse(storage.getLocal('userInfo'));

    this.state = {
      currentKey: '',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { topicsId },
      },
    } = this.props;

    dispatch({
      type: 'topics/updateState',
      payload: {
        channelsList: [],
      },
    });

    const formatData = {
      objectId: topicsId,
      msgId: 'APP181',
    };
    dispatch({
      type: 'topics/getChannels',
      payload: {
        text: JSON.stringify(formatData),
      },
    });
  }

  changeTab = key => {
    this.setState({
      currentKey: key,
    });
  };

  render() {
    const {
      topics,
      loading,
      match: {
        params: { topicsId },
      },
    } = this.props;
    const { currentKey = '' } = this.state;

    const { channelsList = [] } = topics;
    // console.log('channelsList=', channelsList, loading);
    return (
      <div className={styles.main}>
        <Spin spinning={loading || false}>
          <BreadCrumbDetail {...this.props} />
          <Tabs onChange={this.changeTab} animated={false}>
            {channelsList.map(item => (
              <TabPane
                tab={
                  <Popover content={item.title}>
                    <Paragraph ellipsis={{ rows: 1, expandable: false }}>{item.title}</Paragraph>
                  </Popover>
                }
                key={`${item.id}`}
              >
                <TopicsList
                  {...this.props}
                  topicsId={topicsId}
                  id={item.id}
                  currentKey={currentKey}
                />
              </TabPane>
            ))}
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default Topics;
