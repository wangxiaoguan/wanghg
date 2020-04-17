import React, { Component } from 'react';
import { List, Card, Row, Col, Icon } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import StatisticsEnum from '@/Enums/StatisticsEnum'
const styles = require('./Home.less');

const PIE_OPTION = {
  title: {
    text: '',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: "{b} : {c} ({d}%)"
  },
  legend: {
    bottom: 10,
    left: 'center',
    data: ['西凉', '益州', '兖州', '荆州', '幽州']
  },
  series: [
    {
      type: 'pie',
      radius: '65%',
      center: ['50%', '50%'],
      selectedMode: 'single',
      label: {
        normal: {
          formatter: '{b}: {d}%  ',

        }
      },
      data: [
        { value: 1548, name: '幽州' },
        { value: 535, name: '荆州' },
        { value: 510, name: '兖州' },
        { value: 634, name: '益州' },
        { value: 735, name: '西凉' }
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

@connect(({ loading }) => ({
}))
class Home extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      pieOption: {},
      list: []
    }
  }
  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    this.props.dispatch(
      {
        type: 'faultyHome/search',
        callBack: (res) => {
          console.log('result', res)
          const { list = {}, pieOption = {} } = this.transPieAndGrid(res.data)
          this.setState({
            list,
            pieOption
          });
        }
      }
    );
  }

  transPieAndGrid = (arr) => {
    if (!_.isArray) { return {} }
    let pieLegendData = []
    let pieSeriesData = []
    for (const item of arr) {
      pieLegendData.push(StatisticsEnum.toString(item.type))
      pieSeriesData.push({
        name: StatisticsEnum.toString(item.type),
        value: item.count
      })
    }
    let pieOption = _.cloneDeep(PIE_OPTION)
    pieOption.legend.data = pieLegendData
    pieOption.series[0].data = pieSeriesData

    return { list: arr, pieOption }
  }


  public render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            <Card title='数据统计' bodyStyle={{ height: 680 }}>
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={this.state.list}
                renderItem={item => {
                  let weekRate = null
                  let dayRate = null
                  if (item.monthRatio > 0) {
                    weekRate = <span>周同比<Icon type="rise"></Icon>{`${item.monthRatio}%`}</span>
                  } else {
                    weekRate = <span>周同比<Icon type="fall"></Icon>{`${Math.abs(item.monthRatio)}%`}</span>
                  }
                  if (!item.monthRatio) {
                    weekRate = <span>周同比---</span>
                  }
                  if (item.dayRatio > 0) {
                    dayRate = <span>日环比<Icon type="rise"></Icon>{`${item.dayRatio}%`}</span>
                  } else {
                    dayRate = <span>日环比<Icon type="fall"></Icon>{`${Math.abs(item.dayRatio)}%`}</span>
                  }
                  if (!item.dayRatio) {
                    dayRate = <span>日环比---</span>
                  }
                  return (
                    <List.Item>
                      <Card className={styles.card}>
                        <article >
                          <span style={{ fontSize: 20 }} dangerouslySetInnerHTML={{ __html: StatisticsEnum.toString(item.type) }}></span>
                          <span style={{ fontSize: 35, fontWeight: 'bold' }} > {item.count}</span>
                          <hr />
                          <span>{weekRate}{dayRate}</span>
                        </article>
                      </Card>
                    </List.Item>
                  )
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title='数据占比量' bodyStyle={{ height: 680 }}>
              <ReactEcharts style={{ height: 500 }} option={this.state.pieOption} />
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

export default Home;