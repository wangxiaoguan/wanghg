import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Spin, Table } from 'antd';
import Pie from '@/components/Charts/Pie';
import Bar from '@/components/Charts/Bar';
import styles from './index.less';

const color = ['rgba(255, 174, 0, 1)', 'rgba(54, 153, 255, 1)', 'rgba(187, 187, 187, 1)'];
const colorBar = ['rgba(255, 174, 0, 1)', 'rgba(54, 153, 255, 1)', 'rgba(187, 187, 187, 1)'];

@connect(({ partyTask, census, loading }) => ({
  partyTask,
  census,
  everyLoading: loading.effects['census/getAllRank'],
  loading: loading.effects['census/getCensus'],
  meetLoading: loading.effects['census/getMeetCensus'],
  normalLoading: loading.effects['census/getNormalCensus'],
}))
class PartyBranch extends Component {
  render() {
    const {
      loading,
      everyLoading,
      census,
      columns2,
      columns3,
      exportList,
      pagination,
      meetLoading,
      normalLoading,
    } = this.props;
    const {
      taskList,
      totalPercentList,
      pieData,
      xData,
      meetTaskList,
      meetTotalPercentList,
      meetPieData,
      meetData,
      normalTaskList,
      normalData,
      normalPieData,
      normalTotalPercentList,
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
            <Bar data={pieData} color={colorBar} xData={xData} />
          </Spin>
        </div>
        <div className={`${styles.table} global_btn`}>
          <h3>
            <i></i>
            <span>任务完成情况</span>
            <Button className={styles.exportBtn} onClick={() => exportList('1')}>
              导出
            </Button>
          </h3>
          <Table
            columns={columns2}
            bordered
            dataSource={taskList}
            className="tableContent"
            loading={everyLoading}
            pagination={{ total: taskList.length, ...pagination }}
          />
        </div>

        {/* 三会一课 */}
        <div className={styles.chart}>
          <h3>
            <i></i>
            <span>本级组织发出的三会一课</span>
          </h3>
          <Spin spinning={meetLoading}>
            <Pie data={meetTotalPercentList} color={color} />
            <Bar data={meetPieData} color={colorBar} xData={meetData} />
          </Spin>
        </div>
        <div className={`${styles.table} global_btn`}>
          <h3>
            <i></i>
            <span>任务完成情况</span>
            <Button className={styles.exportBtn} onClick={() => exportList('3')}>
              导出
            </Button>
          </h3>
          <Table
            columns={columns3}
            bordered
            dataSource={meetTaskList}
            className="tableContent"
            loading={meetLoading}
            pagination={{ total: meetTaskList.length, ...pagination }}
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
            <Bar data={normalPieData} color={colorBar} xData={normalData} />
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

export default PartyBranch;
