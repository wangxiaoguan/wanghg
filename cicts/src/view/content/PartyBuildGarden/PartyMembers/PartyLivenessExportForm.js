import React, { Component } from 'react';
import { Form, Col, Row, Button, DatePicker } from 'antd';
import { exportExcelService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import moment from 'moment';
const FormItem = Form.Item;
//日期格式
const dataFormat = 'YYYY-MM';
@Form.create()
class PartyLivenessExportForm extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        'startDate': fieldsValue['startDate'].format(dataFormat),
        'endDate': fieldsValue['endDate'].format(dataFormat),
      };
      console.log("表单中的数据为：", values);

      let path = API_PREFIX + `services/system/partyMember/export/partyMember?Q=shouldpaydate_D_GE=${values.startDate}&Q=shouldpaydate_D_LE=${values.endDate}`;

      exportExcelService(path, '', '党员活跃度');
      // message.success('导出成功！');
      this.props.ok();//关闭modal
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 18 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 10 },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="起始时间"
        >
          {
            getFieldDecorator('startDate', { initialValue: moment(new Date(), dataFormat) })(<DatePicker format={dataFormat} />)
          }

        </FormItem>
        <FormItem
          {...formItemLayout}
          label="终止时间"
        >
          {
            getFieldDecorator('endDate', { initialValue: moment(new Date(), dataFormat) })(<DatePicker format={dataFormat} />)
          }
        </FormItem>
        <Row>
          <Col offset={12} span={6}>
            < Button type="primary" htmlType="submit" size="large">开始导出</Button>
          </Col>
          <Col span={6}>
            <Button onClick={() => this.props.cancel()}>返回</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default PartyLivenessExportForm;