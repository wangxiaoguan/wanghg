import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Spin, Table } from 'antd';
import Pie from '@/components/Charts/Pie';
import StackBar from '@/components/Charts/StackBar';
import styles from './index.less';

const color = ['rgba(255, 174, 0, 1)', 'rgba(54, 153, 255, 1)', 'rgba(187, 187, 187, 1)'];
const colorBar = ['rgba(255, 174, 0, 1)', 'rgba(54, 153, 255, 1)', 'rgba(187, 187, 187, 1)'];

@connect(({ partyTask, census, loading }) => ({
  partyTask,
  census,
  loading: loading.effects['census/getCensus'],
  meetLoading: loading.effects['census/getMeetCensus'],
  normalLoading: loading.effects['census/getNormalCensus'],
}))
class PartyMember extends Component {
  render() {
    const {
      loading,
      census,
      columns3,
      pagination,
      meetLoading,
      normalLoading,
      exportList,
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
      normalPieData,
      normalData,
      normalTotalPercentList,
    } = census;
    // console.log('09988===', loading, meetLoading);
    return (
      <div className={styles.content}>
        {/* 主题教育 */}
        <div className={styles.chart}>
          <h3>
            <i></i>
            <span>我收到的主题教育</span>
          </h3>
          <Spin spinning={loading || false}>
            <Pie data={totalPercentList} color={color} />
            <StackBar data={pieData} color={colorBar} xData={xData} />
          </Spin>
        </div>
        <div className={`${styles.table} global_btn`}>
          <h3>
            <i></i>
            <span>主题教育任务完成情况</span>
            <Button className={styles.exportBtn} onClick={() => exportList('1')}>
              导出
            </Button>
          </h3>
          <Table
            columns={columns3}
            bordered
            dataSource={taskList}
            className="tableContent"
            loading={loading}
            pagination={{ total: taskList.length, ...pagination }}
          />
        </div>

        {/* 三会一课 */}
        <div className={styles.chart}>
          <h3>
            <i></i>
            <span>我收到的三会一课</span>
          </h3>
          <Spin spinning={meetLoading || false}>
            <Pie data={meetTotalPercentList} color={color} />
            <StackBar data={meetPieData} color={colorBar} xData={meetData} />
          </Spin>
        </div>
        <div className={`${styles.table} global_btn`}>
          <h3>
            <i></i>
            <span>三会一课任务完成情况</span>
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
            <span>我收到的其他任务</span>
          </h3>
          <Spin spinning={normalLoading || false}>
            <Pie data={normalTotalPercentList} color={color} />
            <StackBar data={normalPieData} color={colorBar} xData={normalData} />
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
            columns={columns3}
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

export default PartyMember;
