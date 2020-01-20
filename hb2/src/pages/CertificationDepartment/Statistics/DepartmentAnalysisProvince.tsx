import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import { connect } from 'dva';
import _ from 'lodash';
import { array } from 'prop-types';

const hubei = require('@/assets/hubei.json');

const options = [
  { label: '武汉市', value: '4201' },
  { label: '黄石市', value: '4202' },
  { label: '十堰市', value: '4203' },
  { label: '宜昌市', value: '4205' },
  { label: '襄阳市', value: '4206' },
  { label: '鄂州市', value: '4207' },

  { label: '荆门市', value: '4208' },
  { label: '孝感市', value: '4209' },
  { label: '荆州市', value: '4210' },

  { label: '黄冈市', value: '4211' },
  { label: '咸宁市', value: '4212' },
  { label: '随州市', value: '4213' },
  { label: '恩施土家族苗族自治州', value: '4228' },

  { label: '仙桃市', value: '429004' },
  { label: '潜江市', value: '429005' },
  { label: '天门市', value: '429006' },
  { label: '神农架林区', value: '429021' },
];

@connect(({ loading }) => ({
}))
class DepartmentAnalysisProvince extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      option: {}
    }
  }

  componentDidMount() {
    this.requestData()
  }

  getName = (divide) => {
    const arr = options.filter(item => {
      return item.value === divide
    })
    return (arr && arr.length > 0) ? arr[0].label : ''

  }

  requestData = () => {
    this.props.dispatch(
      {
        type: 'Statistics/provinceStatistics',
        payLoad: {
          isByDivide: true
        },
        callBack: (res) => {
          console.log('res=', res)
          if (!_.isArray(res.data)) { return }
          const data = res.data.map(item => {
            return {
              ...item,
              name: this.getName(item.divide),
              // value: 50
            }
          })
          console.log('data=', data)
          const option = {
            title: {
              text: '全省概况一览表',
            },
            tooltip: {
              trigger: 'item',
              formatter: this.tooltip,
            },
            visualMap: {
              show: true,
              inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
              }
            },
            series: [
              {
                name: '全省概况一览表',
                type: 'map',
                mapType: 'hubei', // 自定义扩展图表类型
                itemStyle: {
                  normal: { label: { show: true } },
                  emphasis: { label: { show: true } }
                },
                data
              }
            ]
          }
          this.setState({
            option
          });
        }
      }
    );
  }


  tooltip(param, ...arg) {
    let data = param.data;
    console.log('tooltip', param);
    if (data) {
      return `<h3 style="color:white;">${data.name}</h3>
      检测机构数量:   ${data.totalOrg}(家)<br/>
      从业人数:   ${data.totalPerson}(人)<br/>
      高工:  ${data.master}(人)<br/>
      研究生:  ${data.master}(人)<br/>
      固定资产:  ${data.totalFixedAssets}(万元)<br/>
      设备总数:  ${data.totalEquipmentSum}(台)<br/>
      检测机构面积:  ${data.totalArea}(平方米)<br/>
      报告数量:  ${data.totalReportCount}(份)`;
    }
    else {
      return null;
    }
  }
  render() {
    echarts.registerMap("hubei", hubei);
    console.log(echarts);
    return (
      <div>
        <ReactEcharts style={{ height: 700 }} option={this.state.option} />
      </div>
    );
  }
}

export default DepartmentAnalysisProvince;