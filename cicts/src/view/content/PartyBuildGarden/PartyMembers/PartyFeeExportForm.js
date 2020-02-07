import React, { Component } from 'react';
import { Form, Col,Row, Input, Button, Checkbox,Select,DatePicker,InputNumber,message} from 'antd';
import moment from 'moment';
import {postService,getService,exportExcelService, exportExcelService1} from '../../myFetch.js';;
import API_PREFIX from '../../apiprefix';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker} = DatePicker;
//日期格式
const monthFormat = 'YYYY-MM';
@Form.create()
class PartyFeeExportForm extends Component{
  constructor(props){
    super(props);
  }
  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let startDate = fieldsValue['startDate'].format('YYYY-MM')
      let endDate = fieldsValue['endDate'].format('YYYY-MM')
      let query=`Q=startDate=${startDate}-01&Q=endDate=${endDate}-31&Q=type=${fieldsValue.type}`
      let path = API_PREFIX + `services/web/party/fee/exportPartyFee/-1?${query}`;
      console.log("表单中的数据为：",fieldsValue);
      let name = fieldsValue.type == 1 ? '所有党员缴费明细' : fieldsValue.type == 2 ? '未缴费人员明细' : '未缴费人员总额'
      exportExcelService1(path, name);
      this.props.ok();//关闭modal
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;

    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 18},
        sm: { span: 8},
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 10 },
      },
    };

    return(

        <Form  onSubmit={this.handleSubmit}>
          <FormItem
              {...formItemLayout}
              label="起始时间"
          >
            {
              getFieldDecorator('startDate',{initialValue:moment(new Date(),monthFormat),
                rules:[{
                  required: true,
                  message: '请选择起始时间'
                }]
              })
              (<MonthPicker format={monthFormat}/>)
            }

          </FormItem>
          <FormItem
              {...formItemLayout}
              label="终止时间"
          >
            {
              getFieldDecorator('endDate',{initialValue:moment(new Date(),monthFormat),
                rules:[{
                  required: true,
                  message: '请选择终止时间'
                }]
              })
              (<MonthPicker format={monthFormat}/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="导出数据"
          >
            {
              getFieldDecorator('type', {
                initialValue: '1',
                rules:[{
                  required: true,
                  message: '请选择导出数据'
                }]
              })
              (
                  <Select placeholder="请选择" >
                    <Option value="1">所有党员缴费明细</Option>
                    <Option value="2">未缴费人员明细</Option>
                    <Option value="3">未缴费人员总额</Option>
                  </Select>
              )
            }

          </FormItem>
          <Row>
            <Col offset={12} span={6}>
              < Button type="primary" htmlType="submit" size="large">开始导出</Button>
            </Col>
            <Col span={6}>
              <Button onClick={()=>this.props.cancel()}>返回</Button>
            </Col>
          </Row>
        </Form>
    )
  }
}
export default PartyFeeExportForm;