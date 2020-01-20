import React, { Component } from 'react';
import { Card, List, Form, Button } from 'antd';
import HRangePicker from '@/components/Antd/HRangePicker';
import HSelect from '@/components/Antd/HSelect';
import ReactEcharts from 'echarts-for-react';
import SearchTable from '@/components/SearchTable';
import { connect } from 'dva';
import _ from 'lodash'
import { createSearchString } from '@/utils/SystemUtil'
import StatisticsAnalysisEnum from '@/Enums/StatisticsAnalysisEnum'
import { createSelectOptions } from '@/utils/AntdUtil';
import FormResetButton from '@/components/FormResetButton';
import FormRefreshButton from '@/components/FormRefreshButton';
const classNames = require('./NewsStatistics.less');
const FormItem = Form.Item;

@connect(({ loading }) => ({ loading }))
class NewsStatistics extends Component<any, any> {
  state = {
    option: {
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 10
        },
        {
          start: 0,
          end: 10,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }
      ],
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '0%',
      },
      xAxis: [
        {
          type: 'category',
          data: ['1', '2', '3', '4', '5', '6', '7'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    },
    param: { sortType: '1' },//1 === 按月查询 2=== 按日查询
    clickRate: [],
  }

  componentDidMount() {
    this.requestBarData()//柱状图
    this.requestClickRate()//点击量排名
  }

  private requestBarData = (values = {}) => {
    const { dispatch } = this.props
    const { param } = this.state
    dispatch({
      type: 'NewsStatistics/newsStatistics',
      payLoad: createSearchString({ ...param, ...values }),
      callBack: (res) => {
        console.log('信息热点分析 =>', res)
        const { barOption = {} } = this.transBar(res.data)
        this.setState({
          option: barOption
        });
      }
    })
  }

  private transBar = (arr) => {
    if (!_.isArray(arr)) { return {} }
    let barXAxisData = []
    let barSeries = []
    for (const item of arr) {
      barXAxisData.push(item.time)
      barSeries.push(item.clicks)
    }

    let barOption = _.cloneDeep(this.state.option)
    barOption.xAxis[0].data = barXAxisData
    barOption.series[0].data = barSeries
    return { barOption }
  }

  private requestClickRate = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'NewsStatistics/clickRate',
      callBack: (res) => {
        console.log('点击量排名 =>', res)
        let data = res.data.filter(item=>{return item.publishColumn<6})
        this.setState({
          clickRate: data
        });
      }
    })
  }

  searchCreater = (values: any, pageSize: number, current: number) => {
    return `/services/dpac/hotspotanalysis/analyseContent/${current}/${pageSize}${createSearchString({ ...values })}`;
  }

  refresh = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return }
      this.requestBarData(values)
    });
  }

  reset = (e) => {
    this.props.form.resetFields();
    this.requestBarData()
  }


  render() {
    const { option, clickRate } = this.state
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '创建时间',
        content: getFieldDecorator('createDate')(<HRangePicker />),
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

    return (
      <Card title="信息热点分析">
        <div className="divAreaContainer">
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

          <div className={classNames.RankContainer}>
            <ReactEcharts className={classNames.Echart} option={option} />
            <List header='点击量排名' className={classNames.List} dataSource={clickRate} renderItem={(item, index) => {
              return (
                <div className={classNames.RankItem}>
                  <span className={classNames.Index}>{index + 1}</span>
                  <span className={classNames.Name}> {StatisticsAnalysisEnum.toString(`${item.publishColumn}`)}</span>
                  <span className={classNames.Count}>{item.clicks}</span>
                </div>
              );
            }} />
          </div>
        </div>
        <div className="divAreaContainer">
          <SearchTable
            searchCreater={this.searchCreater}
            formItems={SearchForm}
            columns={
              [
                {
                  title: '文章标题',
                  dataIndex: 'title',
                },
                {
                  title: '发布时间',
                  dataIndex: 'publishTime',
                },
                {
                  title: '浏览量（点击量）',
                  dataIndex: 'clicks',
                },
              ]
            }
          />
        </div>
      </Card>
    );
  }
}
class SearchForm extends Component<any>  {


  render() {
    const { getFieldDecorator } = this.props.form;
    const FORM_ITEMS = [
      {
        label: '新闻类型',
        content: getFieldDecorator('publishColumn')(
          <HSelect>
            {
              createSelectOptions(StatisticsAnalysisEnum.ALL_TYPES, StatisticsAnalysisEnum.toString)
            }
          </HSelect>),
      },
    ];
    return (
      <div>
        <div className='divAreaContainer'>
          {
            FORM_ITEMS.map((item) => {
              return (
                <FormItem label={item.label}>{item.content}</FormItem>
              );
            })
          }
          <FormItem>
            <FormRefreshButton />
            <FormResetButton />
          </FormItem>
        </div>
      </div>
    );
  }
}

export default Form.create()(NewsStatistics)