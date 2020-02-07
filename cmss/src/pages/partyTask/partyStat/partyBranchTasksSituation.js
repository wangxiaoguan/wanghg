import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Row, Col, message, Button, Empty } from 'antd';
import { storage } from '@/utils/utils';
import Pie from '@/components/Charts/Pie';
import Bar from '@/components/Charts/Bar';
import BreadCrumbDetail from '@/components/BreadCrumbDetail';
import commenConfig from '../../../../config/commenConfig';
import router from 'umi/router';
import styles from './partyBranchTasksSituation.less';

const colorBar = ['rgba(255, 174, 0, 1)', 'rgba(54, 153, 255, 1)', 'rgba(187, 187, 187, 1)'];
const colorPie = ['rgba(54, 153, 255, 1)', 'rgba(187, 187, 187, 1)', 'rgba(255, 174, 0, 1)'];

@connect(({ census, loading }) => ({
  census,
  loading: loading.effects['census/getBranchDetail'],
  expLoading: loading.effects['census/exportFile'],
}))
class PartyBranchTasksSituation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(storage.getLocal('userInfo')),
      fullName: '',
    };
    this.columns = [
      {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '任务主题',
        dataIndex: 'taskTheme',
        key: 'taskTheme',
      },

      {
        title: '完成状态',
        dataIndex: 'label',
        key: 'label',
      },
    ];
  }

  componentDidMount() {
    const {
      dispatch,
      location: {
        query: { keyword, upPartyId },
        pathname,
      },
      census,
    } = this.props;
    const { userInfo } = this.state;
    const { downPartyList } = census;
    if (downPartyList.length === 0) {
      const url = pathname
        .split('/')
        .slice(0, 5)
        .join('/');
      router.push(url);
    }
    let fullName = '';
    for (let j = 0; j < downPartyList.length; j += 1) {
      if (downPartyList[j].id === Number(upPartyId)) {
        fullName = JSON.parse(JSON.stringify(downPartyList[j].fullName));
      }
    }
    this.setState({ fullName });
    const info1 = {
      // 各级党组织任务执行情况
      userId: userInfo.id,
      partyId: upPartyId,
      level: 2,
      keyword,
      type: '3',
      msgId: 'TASK_STATISTIC_TX',
    };

    dispatch({
      type: 'census/getBranchDetail',
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
      type: '3',
      partyId: upPartyId,
      queryType: '2',
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

  render() {
    const { census, expLoading, loading } = this.props;
    const { meetTaskList, meetPieData, meetData, meetTotalPercentList } = census;
    const { fullName } = this.state;
    const pagination = {
      pageSize: 8,
      defaultCurrent: 1,
    };

    return (
      <div className={styles.main}>
        <BreadCrumbDetail {...this.props} type="党建任务" />
        <div value="" className={styles.partyBread}>
          <span />
          {fullName}
        </div>
        <div className={styles.situation}>
          <Row>
            <Col span={21}>
              <h2 className={styles.tabName}>
                <span className={styles.lump} />
                {`本级组织发出的任务统计`}
              </h2>
            </Col>
          </Row>
          {meetTotalPercentList.length > 0 && meetPieData.length > 0 ? (
            <div>
              <Pie data={meetTotalPercentList} color={colorPie} />
              {/*   <Bar data={meetPieData} color={colorBar} xData={meetData} /> */}
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>

        <div className={styles.situation}>
          <Row>
            <Col span={21}>
              <h2 className={styles.tabName}>
                <span className={styles.lump} />
                {'任务完成情况'}
              </h2>
            </Col>
            <Col span={1}>
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
          <Table
            columns={this.columns}
            bordered
            loading={loading}
            size="middle"
            dataSource={meetTaskList}
            pagination={pagination}
          />
        </div>
      </div>
    );
  }
}
export default PartyBranchTasksSituation;
