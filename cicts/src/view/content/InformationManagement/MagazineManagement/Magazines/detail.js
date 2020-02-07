import React, { Component } from 'react';
import { Button, Form, Input, message} from 'antd';
const FormItem = Form.Item;
const TextArea =Input.TextArea;
import {pageJummps} from '../../PageJumps';
import API_PREFIX from'../../../apiprefix';
import { postService} from '../../../myFetch';
import { connect } from 'react-redux';
import {BEGIN} from '../../../../../redux-root/action/table/table';
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
          postService(API_PREFIX+pageJummps.MagaSeriesEdit,body,data=>{
            if (data.status===1) {
              message.success('修改成功');
              this.props.handleCancel();
              this.props.getData(API_PREFIX+`${pageJummps.MagaSeriesList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else{
              message.error(data.errorMsg);
            }
          });
        }else{
          let body = {
            fieldName: fieldsValue['fieldName'],
            desp: fieldsValue['desp'],
          };
          postService(API_PREFIX + pageJummps.MagaSeriesAdd, body, data => {
            if (data.status === 1) {
              message.success('新增成功');
              this.props.handleCancel();
              this.props.getData(API_PREFIX+`${pageJummps.MagaSeriesList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }else{
              message.error(data.errorMsg);
            }
          });
        }
      }
    });

  }
  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 20 } };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('fieldName', {
            initialValue:'',
            rules: [{ required: true,
                      validator: (rule, value, callback) => specialCharacter(rule, value, callback, '名称为必填项!', 'magazineSeries', this.props.record.id,null, { errorField: '最大长度为40个字符！', length: 40 })
                    },
                    { whitespace: true ,message: '输入内容不能全为空格'}],
          
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="描述">
          {getFieldDecorator('desp', {
            initialValue: '',
            rules: [{ required: true, 
                      validator: (rule, value, callback) => {
                              if(!value){
                                callback('描述为必填项')
                              }else if(value.length>200){
                                callback('描述字数长度不得超过200')
                              }else{
                                callback()
                              }
                        }
                    },
                    { whitespace: true ,message: '输入内容不能全为空格'},
                  ],
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