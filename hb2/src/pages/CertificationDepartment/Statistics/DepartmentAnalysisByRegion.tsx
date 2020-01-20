import React, { Component } from 'react';
import { Card, Form, Table, Col, Button, Checkbox } from 'antd';
import HRangePicker from '@/components/Antd/HRangePicker';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { filterOb, splitTimes } from '@/utils/utils';
import _ from 'lodash';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const options = [
  { value: '4201', label: '武汉市' },
  { value: '4202', label: '黄石市' },
  { value: '4203', label: '十堰市' },
  { value: '4205', label: '宜昌市' },
  { value: '4206', label: '襄阳市' },
  { value: '4207', label: '鄂州市' },

  { value: '4208', label: '荆门市' },
  { value: '4209', label: '孝感市' },
  { value: '4210', label: '荆州市' },
  { value: '4211', label: '黄冈市' },
  { value: '4212', label: '咸宁市' },
  { value: '4213', label: '随州市' },
  { value: '4228', label: '恩施市' },

  { value: '429004', label: '仙桃市' },
  { value: '429005', label: '潜江市' },
  { value: '429006', label: '天门市' },
  { value: '429021', label: '神农架' },
];

const PIE_OPTION = {
  title: {
    text: '检测机构按行政区划比例分布',
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

const BAR_OPTION = {
  color: ['#003366', '#006699', '#4cabce', '#e5323e'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['武汉', '襄阳', '宜昌', '黄石', 'aa']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '从业人数',
      type: 'bar',
      barGap: 0,
      data: [320, 332, 301, 334, 390]
    },
    {
      name: '高工',
      type: 'bar',
      data: [220, 182, 191, 234, 290]
    },
    {
      name: '研究生',
      type: 'bar',
      data: [150, 232, 201, 154, 190]
    },
  ]
}

@connect(({ loading }) => ({
}))
class DepartmentAnalysisByRegion extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      params: {
        isByDivide: true,
        orgDivides: options.map((item) => item.value)
      },
      pieOption: {},
      barOption: {}
    }
  }

  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    this.props.dispatch(
      {
        type: 'Statistics/regionStatistics',
        payLoad: this.state.params,
        callBack: (res) => {
          console.log('result', res)
          if (!res.data) { return }
          const orgDivides = this.state.params.orgDivides
          const data = res.data.filter((item) => orgDivides.filter((opt) => opt === item.divide).length > 0)
          const { pieOption = {}, barOption = {} } = this.transPieAndBar(res.data)
          this.setState({
            data,
            pieOption,
            barOption
          });
        }
      }
    );
  }

  transPieAndBar = (arr) => {
    if (!_.isArray) { return {} }
    let pieLegendData = []
    let pieSeriesData = []
    let barXAxisData = []
    let barSeriesOne = []
    let barSeriesTwo = []
    let barSeriesThree = []
    // console.log(arr)
    const orgDivides = this.state.params.orgDivides
    for (const item of arr.filter((item) => orgDivides.filter((opt) => opt === item.divide).length > 0)) {
      pieLegendData.push(item.area)
      pieSeriesData.push({
        name: item.area,
        value: item.totalOrg,
      })
      barXAxisData.push(item.area)
      barSeriesOne.push(item.totalPerson)
      barSeriesTwo.push(item.advanced)
      barSeriesThree.push(item.master)
    }
    let pieOption = _.cloneDeep(PIE_OPTION)
    pieOption.legend.data = pieLegendData
    pieOption.series[0].data = pieSeriesData

    let barOption = _.cloneDeep(BAR_OPTION)
    barOption.xAxis[0].data = barXAxisData
    barOption.series[0].data = barSeriesOne
    barOption.series[1].data = barSeriesTwo
    barOption.series[2].data = barSeriesThree
    return { pieOption, barOption }
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return }
      const { statisticsTimes, ...others } = values
      const timeForm = splitTimes(statisticsTimes, 'applyForTimeBegin', 'applyForTimeEnd')
      this.setState({
        params: { ...filterOb(others), ...timeForm, isByDivide: true }
      }, this.requestData)
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      < Card title='检测机构综合统计' >
        <div className="divAreaContainer">
          <Form layout="inline">
            <Col span={'24'}>
              <FormItem label={'行政区划'}>{getFieldDecorator('orgDivides', {
                initialValue: options.map((item) => item.value)
              })(<CheckboxGroup options={options} />)}</FormItem>
            </Col>
            <FormItem label='统计时间'>
              {getFieldDecorator('statisticsTimes')(<HRangePicker />)}
            </FormItem>
            <Button type="primary" onClick={this.handleSubmit}>查询</Button>
          </Form>
        </div>
        <div className="divAreaContainer">
          <ReactEcharts style={{ height: 500 }} option={this.state.pieOption} />
        </div>
        <div className="divAreaContainer">
          <ReactEcharts style={{ height: 400 }} option={this.state.barOption} />
        </div>
        <div className="divAreaContainer">
          <Table
            dataSource={this.state.data}
            columns={
              [
                {
                  title: '行政区划',
                  dataIndex: 'area',
                },
                {
                  title: '检测机构数量',
                  dataIndex: 'totalOrg',
                },
                {
                  title: '从业人数',
                  dataIndex: 'totalPerson',
                },
                {
                  title: '高工',
                  dataIndex: 'advanced',
                },
                {
                  title: '研究生',
                  dataIndex: 'master',
                },
                {
                  title: '固定资产(万)',
                  dataIndex: 'totalFixedAssets',
                },
                {
                  title: '设备总数',
                  dataIndex: 'totalEquipmentSum',
                },
                {
                  title: '实验室面积',
                  dataIndex: 'totalArea',
                },
                {
                  title: '报告数量',
                  dataIndex: 'totalReportCount',
                },]
            }
          />
        </div>
      </Card >
    );
  }
}
const Wrapper = Form.create({ name: 'DepartmentAnalysisByRegion' })(DepartmentAnalysisByRegion);

export default Wrapper;