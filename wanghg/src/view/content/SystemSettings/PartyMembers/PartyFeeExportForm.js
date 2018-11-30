import React, { Component } from 'react';
import { Form, Col,Row, Input, Button, Checkbox,Select,DatePicker,InputNumber,message} from 'antd';
import moment from 'moment';
import {postService,getService,exportExcelService} from '../../myFetch.js';;
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
      const values={
      ...fieldsValue,
        'startDate':fieldsValue['startDate'].format('YYYY-MM'),
        'endDate':fieldsValue['endDate'].format('YYYY-MM'),
      }
      let qf=`Q=shouldpaydate_D_GE=${values.startDate}&Q=shouldpaydate_D_LE=${values.endDate}`
      let path = API_PREFIX + `services/system/partyFee/export/partyFee?`;
      console.log("表单中的数据为：",values);
      if(values.paryPayRange=='0'){
        exportExcelService(path+qf,'','所有党员缴费明细');
      }else if(values.paryPayRange=='1'){
        qf=qf+'&Q=ispay_Z_EQ=fasle'
        exportExcelService(path+qf,'','未缴费人员明细');
      }else if(values.paryPayRange=='2'){
        let path = API_PREFIX + `services/system/partyFee/export/partyFeeNotPayTotal?`;
        exportExcelService(path+qf,'','未缴费人员总额');
      }
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
              getFieldDecorator('startDate',{initialValue:moment(new Date(),monthFormat)})
              (<MonthPicker format={monthFormat}/>)
            }

          </FormItem>
          <FormItem
              {...formItemLayout}
              label="中止时间"
          >
            {
              getFieldDecorator('endDate',{initialValue:moment(new Date(),monthFormat)})
              (<MonthPicker format={monthFormat}/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="导出数据"
          >
            {
              getFieldDecorator('paryPayRange')
              (
                  <Select placeholder="请选择" >
                    <Option value="0">所有党员缴费明细</Option>
                    <Option value="1">未缴费人员明细</Option>
                    <Option value="2">未缴费人员总额</Option>
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