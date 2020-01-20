import React, { Component } from 'react';
import { Card, Form, Col, Button, Checkbox } from 'antd';
import HSelect from '@/components/Antd/HSelect';
import { createTdItem } from '@/utils/AntdUtil';
import { connect } from 'dva';
import { filterOb } from '@/utils/utils';
import LagalLabEnum from '@/Enums/LagalLabEnum';
import LabBelongToEnum from '@/Enums/LabBelongToEnum';
import { createSelectOptions } from '@/utils/AntdUtil';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

const options = [
  { label: '武汉市', value: '4201', },
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
  { label: '恩施市', value: '4228' },

  { label: '仙桃市', value: '429004' },
  { label: '潜江市', value: '429005' },
  { label: '天门市', value: '429006' },
  { label: '神农架', value: '42902' },
];


@connect(({ loading }) => ({
}))
class DepartmentComprehensiveAnalysis extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      params: {
        isByDivide: false
      }
    }
  }

  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    this.props.dispatch(
      {
        type: 'Statistics/comprehensiveStatistics',
        payLoad: this.state.params,
        callBack: (res) => {
          this.setState({
            data: res.data[0],
          });
        }
      }
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return }
      const params = filterOb(values)
      console.log('values', values)
      this.setState({
        params: { ...params, isByDivide: false }
      }, this.requestData)
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { data = {} } = this.state
    return (
      <Card title='检测机构综合统计'>
        <div className="divAreaContainer">
          <Form layout="inline">
            <Col span={'24'}>
              <FormItem label={'行政区划'}>{getFieldDecorator('orgDivides')(<CheckboxGroup options={options} />)}</FormItem>
            </Col>
            <FormItem label={'独立立法人检测机构'}>{getFieldDecorator('legalLab')(
              <HSelect>
                {
                  createSelectOptions(LagalLabEnum.ALL_LIST, LagalLabEnum.toString)
                }
              </HSelect>
            )}</FormItem>
            <FormItem label={'检测机构所属法人'}>{getFieldDecorator('labBelongTo')(
              <HSelect>
                {
                  createSelectOptions(LabBelongToEnum.ALL_LIST, LabBelongToEnum.toString)
                }
              </HSelect>

            )}</FormItem>
            <Button type="primary" onClick={this.handleSubmit}>查询</Button>
          </Form>
        </div>

        <table className="InfoTable">
          <thead>
            <tr>
              <th colSpan={6}>检测机构综合统计结果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colSpan={2}>从业情况</th>
              {
                createTdItem('人员总数', `${data.totalPerson || ''}`, 1, 3)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('管理人员', `${data.manager || ''}`),
                  createTdItem('技术检测人员', `${data.technology || ''}`),
                  createTdItem('研究生以上学历', `${data.master || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('大学本科', `${data.bachelor || ''}`),
                  createTdItem('专科及以下学历', `${data.college || ''}`),
                  createTdItem('高级专业技术职称人数', `${data.advanced || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('中级专业技术职称人数', `${data.intermediate || ''}`),
                  createTdItem('初级专业技术职称人数', `${data.primary || ''}`),
                  createTdItem('其他人员人数', `${data.other || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('10人以下', `${data.sum11 || ''}`),
                  createTdItem('10-50人', `${data.sum13 || ''}`),
                  createTdItem('50-100人', `${data.sum121 || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('100-150人', `${data.sum13 || ''}`),
                  createTdItem('150-200人', `${data.sum14 || ''}`),
                  createTdItem('200-300人', `${data.sum141 || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('300-400人', `${data.sum15 || ''}`),
                  createTdItem('400-500人', `${data.sum16 || ''}`),
                  createTdItem('500人以上', `${data.sum161 || ''}`),
                ]
              }
            </tr>
            <tr>
              <th colSpan={2}>固定资产情况</th>
              {
                createTdItem('共计固定资产', `${data.totalFixedAssets || ''}`, 1, 3)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('100万以下', `${data.sum21 || ''}`),
                  createTdItem('100-500万', `${data.sum22 || ''}`),
                  createTdItem('500-1000万', `${data.sum221 || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('1000-5000万', `${data.sum23 || ''}`),
                  createTdItem('5000万以上', `${data.sum24 || ''}`),
                  createTdItem('', ''),
                ]
              }
            </tr>
            <tr>
              <th colSpan={2}>设备情况</th>
              {
                createTdItem('设备总数', `${data.totalEquipmentSum || ''}`, 1, 3)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('50台以下', `${data.sum31 || ''}`),
                  createTdItem('50-100台', `${data.sum32 || ''}`),
                  createTdItem('100-500台', `${data.sum321 || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('500-1000台', `${data.sum33 || ''}`),
                  createTdItem('1000台以上', `${data.sum34 || ''}`, 1, 3),
                ]
              }
            </tr>
            <tr>
              <th colSpan={2}>进口设备情况</th>
              {
                createTdItem('进口设备总数', `${data.totalEntranceNum || ''}`, 1, 3)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('50台以下', `${data.sum41 || ''}`),
                  createTdItem('50-100台', `${data.sum42 || ''}`),
                  createTdItem('100-500台', `${data.sum421 || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('500-1000台', `${data.sum43 || ''}`),
                  createTdItem('1000台以上', `${data.sum44 || ''}`, 1, 3),
                ]
              }
            </tr>
            <tr>
              <th colSpan={2}>检测机构面积情况</th>
              {
                createTdItem('总面积', `${data.totalArea || ''}`, 1, 3)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('检测机构面积', `${data.totalArea || ''}`),
                  createTdItem('温恒面积', `${data.thermostatRoom || ''}`),
                  createTdItem('户外检验场地面积', `${data.examRoomArea || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('500平方米以下', `${data.sum51 || ''}`),
                  createTdItem('500-1000平方米', `${data.sum52 || ''}`),
                  createTdItem('1000-5000平方米', `${data.sum521 || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('5000平方米以上', `${data.sum53 || ''}`),
                ]
              }
            </tr>
            <tr>
              <th colSpan={2}>报告情况</th>
              {
                createTdItem('报告总计', `${data.totalReportCount || ''}`, 1, 3)
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('500份以下', `${data.sum61 || ''}`),
                  createTdItem('500-1500份', `${data.sum62 || ''}`),
                  createTdItem('1500-5000份', `${data.sum621 || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('5000-10000份', `${data.sum63 || ''}`),
                  createTdItem('10000份以上', `${data.sum64 || ''}`),
                ]
              }
            </tr>
          </tbody>
        </table>
      </Card>
    );
  }
}

const Wrapper = Form.create({ name: 'DepartmentComprehensiveAnalysis' })(DepartmentComprehensiveAnalysis);

export default Wrapper;