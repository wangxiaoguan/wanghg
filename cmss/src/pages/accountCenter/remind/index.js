/**
 * Created by xhw on 2019/5/8 10:15
 */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, message } from 'antd';
// import Link from 'umi/link';
import router from 'umi/router';
import styles from './index.less';
import { storage } from '@/utils/utils';
import config from '../../../../config/commenConfig';

const PAGE_SIZE = 10;

@connect(({ loading, remind }) => ({
  loading: loading.effects['remind/getRemindsList'],
  remind,
}))
@connect(({ partyTask }) => ({
  partyTask,
}))
class EventReminder extends Component {
  state = {
    currentPage: 1,
  };

  componentDidMount() {
    this.getRemindsList(1);
    // 开启轮询
    this.remindInterval = setInterval(() => {
      this.getRemindsList(1);
    }, config.remindIntervalTime * 30000);
  }

  componentWillUnmount() {
    if (this.remindInterval) {
      clearInterval(this.remindInterval);
    }
  }

  getRemindsList = page => {
    const { dispatch } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formData = {
      beginDate: '2017-09-13 15:48:16',
      groupId: '1003342',
      msgId: 'APP082',
      userId: userInfo.id,
      index: 0,
      isPc: true,
    };
    // 进入页面刷一次数据
    dispatch({
      type: 'remind/getRemindsList',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  onClick = url => {
    const arr = url.split('/');
    const { dispatch, match } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    if (arr.length > 4 && arr.includes('detail')) {
      const requestDetail = {
        taskId: arr[1],
        msgId: 'TASK_DETAIL_TX',
        userId: userInfo.id,
        topicId: arr[0],
        isSend: arr[3] === '1',
        partyId: Number(arr[2]),
      };
      dispatch({
        type: 'partyTask/getTaskDetail',
        payload: {
          text: JSON.stringify(requestDetail),
        },
        callback: res => {
          const taskDetail = res.task_tx;
          let listId = arr[0];
          if (taskDetail.isDelete === 1) {
            message.warning('该任务已被删除！');
            return;
          }
          let type = 'deployment';
          if (taskDetail.topicId === 5) {
            type = 'normalTask';
          }
          if (taskDetail.eduId && taskDetail.eduId !== '') {
            type = 'education';
            listId = taskDetail.eduId;
          }
          router.replace({
            pathname: `/task/1564984392317342/${type}/${listId}/detail`,
            query: {
              isSend: 0,
              taskId: arr[1],
              // upPartyId: taskDetail.upPartyId,
              upPartyId: Number(arr[2]),
            },
          });
        },
      });
    } else {
      router.push(`${match.url}/${url}`);
    }
  };

  getLinkView = (contentUrl, contentLink) => {
    console.log(contentUrl, contentLink);
    if (contentUrl && contentUrl !== '') {
      // console.log(contentUrl, contentLink);
      if (contentUrl.indexOf('http') !== -1) {
        return (
          <a
            className={styles.linkInfo}
            href={contentUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {contentLink || ''}
          </a>
        );
      } else {
        return (
          <span className={styles.newItem}>
            <span className={styles.linkInfo} onClick={() => this.onClick(contentUrl)}>
              {contentLink || ''}
            </span>
          </span>
        );
      }
    }
    return (
      <span style={{ color: '#333' }} className={styles.linkInfo}>
        {contentLink || ''}
      </span>
    );
  };

  render() {
    const { remind, loading } = this.props;
    const { totalCount, eventReminds } = remind;
    const remindColumns = [
      {
        title: '编号',
        dataIndex: 'index',
        key: 'index',
        width: '5%',
        render: text => <div className={styles.orderNum}>{text}</div>,
      },
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        width: '70%', // record.contentPath
        render: (text, record) => (
          <div className={styles.rowContent}>
            <div className={styles.despInfo}>{record.contentLink}</div>
            {this.getLinkView(record.contentUrl, text)}
          </div>
        ),
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        width: '25%',
        render: text => <span className={styles.dateTime || ''}>{text}</span>,
      },
    ];

    const pagination = {
      total: totalCount,
      showTotal: totalNum =>
        `共 ${totalNum} 条记录 第 ${this.state.currentPage} / ${Math.ceil(
          totalNum / PAGE_SIZE
        )} 页`,
      pageSize: PAGE_SIZE,
      defaultCurrent: 1,
      onChange: currentPage => {
        this.getRemindsList(currentPage);
        this.setState({
          currentPage,
        });
      },
    };

    return (
      <div className={styles.main}>
        <Table
          columns={remindColumns}
          dataSource={eventReminds}
          rowKey={(item, index) => index}
          showHeader={false}
          loading={loading}
          pagination={pagination}
        />
      </div>
    );
  }
}
export default EventReminder;
