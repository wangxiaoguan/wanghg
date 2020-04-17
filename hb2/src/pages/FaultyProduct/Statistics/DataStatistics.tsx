import React, { Component } from 'react';
import { Card, List, Form, Button } from 'antd';
import HRangePicker from '@/components/Antd/HRangePicker';
import HSelect from '@/components/Antd/HSelect';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva'
import { createSearchString } from '@/utils/SystemUtil'
import _ from 'lodash'
import { createSelectOptions } from '@/utils/AntdUtil';
import StatisticsAnalysisEnum from '@/Enums/StatisticsAnalysisEnum'


const FormItem = Form.Item;
const classNames = require('./DataStatistics.less');

@connect(({ loading }) => ({ loading }))

class DataStatistics extends Component<any, any> {

  state = {
    keyData: [
      { label: '动态新闻新增数', count: 0, type: '1' },
      { label: '召回公告新增数', count: 0, type: '2' },
      { label: '汽车产品召回', count: 0, type: '13' },
      { label: '消费召回', count: 0, type: '14' },
      { label: '消费预警新增数', count: 0, type: '3' },
      { label: '知识宣贯新增数', count: 0, type: '4' },
      { label: '法律法规新增数', count: 0, type: '5' },
      { label: '缺陷信息新增数', count: 0, type: '6' },
      { label: '你点我检新增数', count: 0, type: '7' },
      { label: '购检产品新增数', count: 0, type: '8' },
      { label: '专家新增数', count: 0, type: '9' },
      { label: '检测机构新增数', count: 0, type: '10' },
      { label: '企业新增数', count: 0, type: '11' },
      { label: '汽车三包新增数', count: 0, type: '12' },
    ],
    option: {
      xAxis: {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'bar',
          name: 'a',
          itemStyle: {
            normal: {
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: { //数值样式
                  color: 'black',
                  fontSize: 16
                }
              }
            }
          },
        },
      ],
      // legend: {
      //   data: ['a'],
      //   bottom: 0
      // },
    },
    param: { sortType: '1' },
    publishTime: null
  }

  componentDidMount() {
    this.requestKeyData()
    // this.requestLineChart()
  }

  private requestKeyData = (values = {}) => {
    const { dispatch } = this.props
    const { keyData } = this.state

    dispatch({
      type: 'NewsStatistics/keyData',
      payLoad: createSearchString({ ...values }),
      callBack: (res) => {
        console.log('keyData =>', res)
        const queryValue = (type) => {
          const temp = res.data.filter(c => c.type === type)
          return temp.length > 0 ? temp[0].count : 0
        }
        keyData.forEach((c) => {
          // console.log(c)
          if(!(c.type === '13' || c.type === '14')) {
            c.count = queryValue(c.type)
            // console.log('112233')
          } else {
            if (c.type === '13') {
              const tempType = res.data
              c.count = tempType[12] ? tempType[12].list[0].COUNT : 0
            } else if (c.type === '14') {
              const tempType = res.data
              c.count = tempType[12] ? tempType[12].list[1].COUNT : 0
            }
          }
        })
        this.setState({
          keyData: [...keyData]
        });
      }
    })
  }

  private requestLineChart = (values = {}) => {
    const { dispatch } = this.props
    const { param } = this.state

    dispatch({
      type: 'NewsStatistics/increaseTendency',
      payLoad: createSearchString({ ...param, ...values }),

      callBack: (res) => {
        console.log('line chart =>', res)
        const { lineOption = {} } = this.transLine(res.data)
        this.setState({ option: lineOption })
      }
    })
  }

  private transLine = (arr) => {
    if (!_.isArray(arr)) { return {} }
    let lineXAxisData = []
    let lineSeries = []
    const lineLegendData = []

    for (const item of arr) {
      lineXAxisData.push(item.time)
      lineSeries.push(item.count)
      lineLegendData.push(item.time)
    }

    let lineOption = _.cloneDeep(this.state.option)
    lineOption.xAxis.data = lineXAxisData
    lineOption.series[0].data = lineSeries
    lineOption.legend.data = lineLegendData
    return { lineOption }
  }

  refresh = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return }
      this.requestLineChart(values)
    });
  }

  reset = (e) => {
    this.props.form.resetFields();
    this.requestLineChart()
  }

  render() {
    const { keyData, option, publishTime } = this.state
    const { getFieldDecorator } = this.props.form;

    const FORM_ITEMS = [
      {
        label: '发布时间',
        content: getFieldDecorator('publishTime')(<HRangePicker />),
      },
      {
        label: '新闻类型',
        content: getFieldDecorator('publishColumn')(
          <HSelect style={{ width: 150 }}>
            {
              createSelectOptions(StatisticsAnalysisEnum.ALL_TYPES, StatisticsAnalysisEnum.toString)
            }
          </HSelect>),
      },
    ];

    const dateChange = (value) => {
      this.setState({ publishTime: value })
    }

    const refresh = () => {
      this.requestKeyData({ createDate: publishTime })
    }

    const reset = () => {
      this.setState({ publishTime: null })
      this.requestKeyData()
    }

    return (
      <Card title='后台数据分析'>
        <List
          grid={{ column: 7 }}
          header={
            <span>
              <span>关键指标（本页数据根据实时数据计算)</span>
              <HRangePicker style={{ marginLeft: 20 }} onChange={dateChange} value={publishTime} />
              <Button style={{ marginLeft: 20 }} type="primary" onClick={refresh}>查询</Button>
              <Button style={{ marginLeft: 20 }} onClick={reset}>重置</Button>
            </span>}
          dataSource={keyData}
          renderItem={(item) => {
            return (
              <List.Item className={classNames.keyItem}>
                <h3>{item.label}</h3>
                <h1>{item.count}</h1>
              </List.Item>
            );
          }}
        />
        {/* <div className="divAreaContainer">
          <Form layout="inline" >
            {
              FORM_ITEMS.map((item) => {
                return (
                  <FormItem key={item.label} label={item.label}>{item.content}</FormItem>
                );
              })
            }
            <FormItem>
              <Button type="primary" onClick={this.refresh}>查询</Button>
              <Button onClick={this.reset}>重置</Button>
            </FormItem>
          </Form>
          <ReactEcharts option={option} style={{ height: 500 }} />
        </div> */}
      </Card>
    );
  }
}

export default Form.create()(DataStatistics);