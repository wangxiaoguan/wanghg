import React, { Component } from 'react';
import { Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import { connect } from 'dva';

const TITLE = '操作类型统计';

interface IOperationTypeStatisticsState {
  dataSource: any[];
  lendData: any[];
}

@connect(({ loading }) => ({
  loading
}))
class OperationTypeStatistics extends Component<IFormAndDvaInterface, IOperationTypeStatisticsState> {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      lendData: [],
    };
  }


  componentDidMount() {
    this.fhwtoaccessoperate();
  }

  fhwtoaccessoperate() {
    this.props.dispatch(
      {
        type: 'OperationTypeStatistics/fhwtoaccessoperate',
        callBack: (res) => {
          let dataSource = res.data.data;
          let lendData = [];
          if (dataSource) {
            lendData = dataSource.map((item) => item.pageName);
            dataSource = dataSource.map((item) => ({ name: item.pageName, value: item.count }));
          }
          this.setState({ dataSource, lendData });
        }
      }
    );
  }

  render() {
    const option = {
      title: {
        text: '访问类型比例分析图表',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      },
      series: [
        {
          name: '姓名',
          type: 'pie',
          radius: '40%',
          center: ['50%', '50%'],
          data: this.state.dataSource,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {d}%',
          }
        }
      ]
    };

    const option2 = {
      title: {
        text: '访问类型比例分析图表',
        x: 'center'
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.state.lendData,
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          type: 'bar',
          barWidth: '60%',
          data: this.state.dataSource,
        }
      ]
    };

    return (
      <Card title={<div><span>{TITLE}</span><a href='#/Statistics/OperationTypeStatistics/OperationTypeStatisticsList' style={{ float: 'right' }}>查看详情</a></div>}>
        <ReactEcharts style={{ height: 800 }} option={option} />
        <ReactEcharts style={{ height: 500 }} option={option2} />
      </Card>
    );
  }
}

export default OperationTypeStatistics;