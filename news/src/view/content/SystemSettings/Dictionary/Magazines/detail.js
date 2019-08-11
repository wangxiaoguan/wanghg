import React, { Component } from 'react';
import { Button, Form, Input, Message} from 'antd';
const FormItem = Form.Item;
const TextArea =Input.TextArea;
import ServiceApi from'../../../apiprefix';
import {  getService,postService} from '../../../myFetch';
import { connect } from 'react-redux';
import {BEGIN} from '../../../../../redux-root/action/table/table';
import { onInput} from '../../../../../utils/ruleConfig';
import { specialCharacter} from '../../../../../utils/checkForm';
@connect(
  state => ({
    pageData: state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
@Form.create()
export default class MagazineDetail extends Component {
  constructor(props) {
    super(props);
    
  }
  componentDidMount(){
    if (this.props.isEdit) {
      this.props.form.setFieldsValue({
        fieldName: this.props.record.fieldName,
        desp: this.props.record.desp,
      });
    }
  }
  handleSubmit=e=>{
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        console.log('fieldsValue', fieldsValue);
        if (this.props.isEdit) {
          let body = {
            id: this.props.record.id,
            fieldName: fieldsValue['fieldName'],
            desp:fieldsValue['desp'],
          };
          postService(ServiceApi+'services/system/dictionary/magazineSeries/update',body,data=>{
            if (data.retCode===1) {
              Message.success('修改成功');
              this.props.handleCancel();
              this.props.getData(ServiceApi+`services/system/dictionary/magazineSeries/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }
          });
        }else{
          let body = {
            fieldName: fieldsValue['fieldName'],
            desp: fieldsValue['desp'],
          };
          postService(ServiceApi + 'services/system/dictionary/magazineSeries/add', body, data => {
            if (data.retCode === 1) {
              Message.success('新增成功');
              this.props.handleCancel();
              this.props.getData(ServiceApi+`services/system/dictionary/magazineSeries/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }
          });
        }
      }
    });

  }
  render() {
    console.log('props', this.props.pageData);
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 20 } };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('fieldName', {
            initialValue:'',
            rules: [{ required: true, whitespace: true, validator: (rule, value, callback) => specialCharacter(rule, value, callback, '名称为必填项!', 'magazineSeries', this.props.record.id,null, { errorField: '最大长度为40个字符！', length: 40 })}],
          
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="描述">
          {getFieldDecorator('desp', {
            initialValue: '',
            rules: [{ required: true, whitespace: true, validator: (rule, value, callback) => specialCharacter(rule, value, callback, '描述为必填项',null,null,null,{ errorField: '最大长度为200个字符！', length: 200 })}],
          })(<TextArea  autosize={{minRows:3}}/>)}
        </FormItem>
        <div className="modal-option-btn">
          <Button type="primary" className="modal-back-btn resetBtn" onClick={() => this.props.handleCancel()}>返回</Button>
          <Button className="modal-save-btn queryBtn" htmlType="submit" type="primary">保存</Button>
        </div>
        
      </Form>
    );
  }
}