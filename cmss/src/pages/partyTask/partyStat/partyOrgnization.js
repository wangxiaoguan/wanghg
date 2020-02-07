import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Spin, Table } from 'antd';
import Pie from '@/components/Charts/Pie';
import styles from './index.less';

const color = ['rgba(255, 174, 0, 1)', 'rgba(54, 153, 255, 1)', 'rgba(187, 187, 187, 1)'];

@connect(({ partyTask, census, loading }) => ({
  partyTask,
  census,
  everyLoading: loading.effects['census/getAllRank'],
  loading: loading.effects['census/getCensus'],
  imLoading: loading.effects['census/getImCensus'],
  normalLoading: loading.effects['census/getNormalCensus'],
}))
class PartyOrgnization extends Component {
  render() {
    const {
      loading,
      everyLoading,
      census,
      columns1,
      columns2,
      pagination,
      imLoading,
      normalLoading,
      exportList,
    } = this.props;
    const {
      taskList,
      downPartyList,
      normalTaskList,
      totalPercentList,
      imTotalPercentList,
      normalTotalPercentList,
      imTaskList,
    } = census;
    return (
      <div className={styles.content}>
        {/* 主题教育 */}
        <div className={styles.chart}>
          <h3>
            <i></i>
            <span>本级组织发出的主题教育</span>
          </h3>
          <Spin spinning={loading}>
            <Pie data={totalPercentList} color={color} />
          </Spin>
        </div>
        <div className={`${styles.table} global_btn`}>
          <h3>
            <i></i>
            <span>主题教育完成情况</span>
            <Button className={styles.exportBtn} onClick={() => exportList('1')}>
              导出
            </Button>
          </h3>
          <Table
            columns={columns2}
            bordered
            dataSource={taskList}
            className="tableContent"
            loading={loading}
            pagination={{ total: taskList.length, ...pagination }}
            rowKey={'id'}
          />
        </div>

        {/* 重要工作部署 */}
        <div className={styles.chart}>
          <h3>
            <i></i>
            <span>本级组织发出的重要工作部署</span>
          </h3>
          <Spin spinning={imLoading}>
            <Pie data={imTotalPercentList} color={color} />
          </Spin>
        </div>
        <div className={`${styles.table} global_btn`}>
          <h3>
            <i></i>
            <span>重要工作部署完成情况</span>
            <Button className={styles.exportBtn} onClick={() => exportList('4')}>
              导出
            </Button>
          </h3>
          <Table
            columns={columns2}
            className="tableContent"
            dataSource={imTaskList}
            bordered
            loading={imLoading}
            pagination={{ total: imTaskList.length, ...pagination }}
            rowKey={'id'}
          />
        </div>

        {/* 三会一课 */}
        <div className={`${styles.table} global_btn`}>
          <h3>
            <i></i>
            <span>各级党组织任务执行情况（三会一课）</span>
            <Button className={styles.exportBtn} onClick={() => exportList('3', '1')}>
              导出
            </Button>
          </h3>
          <Table
            columns={columns1}
            className="tableContent"
            dataSource={downPartyList}
            bordered
            loading={everyLoading}
            pagination={{ total: downPartyList.length, ...pagination }}
            rowKey={'id'}
          />
        </div>

        {/* 其他任务 */}
        <div className={styles.chart}>
          <h3>
            <i></i>
            <span>本级组织发出的其他任务</span>
          </h3>
          <Spin spinning={normalLoading}>
            <Pie data={normalTotalPercentList} color={color} />
          </Spin>
        </div>
        <div className={`${styles.table} global_btn`}>
          <h3>
            <i></i>
            <span>其他任务完成情况</span>
            <Button className={styles.exportBtn} onClick={() => exportList('2')}>
              导出
            </Button>
          </h3>
          <Table
            columns={columns2}
            className="tableContent"
            dataSource={normalTaskList}
            bordered
            loading={normalLoading}
            pagination={{ total: normalTaskList.length, ...pagination }}
            rowKey={'id'}
          />
        </div>
      </div>
    );
  }
}

export default PartyOrgnization;
