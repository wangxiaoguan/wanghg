/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-script-url */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, message, Button, Table, Spin } from 'antd';
import { storage } from '@/utils/utils';
import BreadCrumbDetail from '@/components/BreadCrumbDetail';
import router from 'umi/router';

import styles from './allRank.less';
import commenConfig from '../../../../config/commenConfig';

const tabsInfo = {
  title: '各级党组织任务执行情况（三会一课）',
};

@connect(({ census, loading }) => ({
  census,
  loading: loading.effects['census/getLevelDetail'],
  expLoading: loading.effects['census/exportFile'],
}))
class AllRank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(storage.getLocal('userInfo')),
      partyId: '',
      keyword: '',
    };
  }

  componentDidMount() {
    const {
      match,
      dispatch,
      location: {
        query: { upPartyId, keyword },
      },
    } = this.props;
    const { userInfo } = this.state;
    this.setState({ partyId: upPartyId, keyword });
    console.log(match.params);

    const info1 = {
      // 各级党组织任务执行情况
      userId: userInfo.id,
      partyId: upPartyId,
      level: 1,
      keyword,
      msgId: 'TASK_STAT_TX',
    };

    dispatch({
      type: 'census/getLevelDetail',
      payload: {
        text: JSON.stringify(info1),
      },
    });
  }

  exportList = () => {
    const { userInfo } = this.state;
    const {
      dispatch,
      location: {
        query: { keyword, level, upPartyId },
      },
    } = this.props;
    const expInfo = {
      msgId: 'EXPORT_TASK',
      type: '1',
      partyId: upPartyId,
      queryType: '1',
      userId: userInfo.id,
      level,
      keyword,
    };
    dispatch({
      type: 'census/exportFile',
      payload: {
        text: JSON.stringify(expInfo),
      },
      callBack: item => {
        if (item.code === '0') {
          const { fileUrl } = item.resultMap;
          const a = document.createElement('a');
          a.href = `${commenConfig.downPath}/${fileUrl}`;
          a.click();
        } else {
          message.error(item.message);
        }
      },
    });
  };

  changeAllRank = data => {
    const {
      location: {
        query: { keyword },
      },
      location,
    } = this.props;
    const query = `?level=${data.level}&upPartyId=${data.id}&keyword=${keyword}`;
    const url = location.pathname
      .split('/')
      .slice(0, 5)
      .join('/');
    // console.log(query);
    if (data.hasChild === 1) {
      router.push(`${url}${query}`);
    } else {
      router.push(`${url}/party${query}`);
    }
  };

  render() {
    const pagination = {
      pageSize: 10,
      defaultCurrent: 1,
    };
    const { census, loading, expLoading } = this.props;
    const { downPartyList } = census;
    const columns = [
      {
        title: '党组织名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 200,
      },

      {
        title: '党员人数',
        dataIndex: 'partyMemNum',
        key: 'partyMemNum',
        align: 'center',
        width: 140,
      },
      {
        title: '组织完成率',
        dataIndex: 'partyPercentage',
        key: 'partyPercentage',
        align: 'center',
        width: 150,
        render: text => <span>{`${text}%`}</span>,
      },
      {
        title: '党员参与率',
        dataIndex: 'memPercentage',
        key: 'memPercentage',
        align: 'center',
        width: 150,
        render: text => <span>{`${text}%`}</span>,
      },
      {
        title: '详情',
        dataIndex: 'detail',
        align: 'center',
        key: 'detail',
        width: 60,
        render: (_, data) => {
          return (
            <span className="blueSpan" onClick={() => this.changeAllRank(data)}>
              查看
            </span>
          );
        },
      },
    ];

    return (
      <div className={styles.main}>
        <BreadCrumbDetail {...this.props} type="党建任务" />
        <Row style={{ marginTop: 15 }}>
          <Col span={21}>
            <h2 className={styles.tabName}>
              <span className={styles.lump} />
              {tabsInfo.title}
            </h2>
          </Col>
          <Col span={3}>
            <div className="global_btn">
              <Button
                onClick={this.exportList}
                icon={expLoading ? 'loading' : ''}
                disabled={expLoading}
              >
                导出
              </Button>
            </div>
          </Col>
        </Row>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            bordered
            dataSource={downPartyList}
            size="middle"
            pagination={pagination}
          />
        </Spin>
      </div>
    );
  }
}

export default AllRank;
