import React, { Component } from 'react';
import { Form, Message,Steps , Input, Button,Row,Col,Select ,Checkbox,DatePicker,InputNumber ,Radio} from 'antd';
import ServiceApi from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {TaskTopicList, //党建任务列表
} from '../URL';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
@Form.create()
export default class Add extends  Component {
  constructor(props){
    super(props);
    this.state= {
      validTopicName:{},//校验任务主题名称
    }
  }
  //表单提交事件
  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue)=>{
      console.log('fieldsValue',fieldsValue);
      if(err){
       return;
      }
      let values={
          ...fieldsValue,
        'level':fieldsValue['level'].toString(),
      }
      postService(ServiceApi+'services/partybuilding/tasktopic/add/insertTaskTopic',values,data=>{
         if(data.retCode===1){//新增成功
           Message.success('新增成功');
           location.hash = TaskTopicList
         }else{
           Message.error(data.retMsg);
         }
      });
    });
  }
  //任务主题名称的校验
  handleValidTopicName= (rule, value, callback) => {
    console.log('任务主题名称：',value);
    if(value == ''||value==undefined){
      callback()
    }else{
      let id='add';
      getService(ServiceApi + `services/partybuilding/tasktopic/verifyTopicNameIsUnique/${value}/${id}`, data => {
        if(data.retCode==0){
          console.log("data.retMsg",data.retMsg);

          this.setState({
            validTopicName:{
              retCode:data.retCode,
              retMsg:data.retMsg,
            }
          });
          console.error("state",this.state);
          callback([new Error(data.retMsg)]);
          // message.error(data.retMsg)
        }else{
          this.setState({
            validTopicName:{
              retCode:data.retCode,
              retMsg:data.retMsg,
            }
          });
          callback()
        }
      })
    }
  }
  render(){
    const {getFieldDecorator}=this.props.form;
    const enabledOption=[
      {key:true, value:'是'},
      {key:false, value:'否'},
    ];
    const checkBoxOption=[{label: '党支部以上接口人', value: '1'},{label: '党支部接口人', value: '2'}]
    const isOfflineOption=[
      {key:1, value:'是'},
      {key:0, value:'否'},
      {key:2, value:'不固定'},
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return(
        <Form  onSubmit={this.handleSubmit}>
      <FormItem
          {...formItemLayout}
          label="任务主题名称"
      >
        {
          getFieldDecorator('name',{
            rules: [
              {
                required:true ,
                whitespace: true,
                message: '任务主题名称为必填项且最大长度不能超过12',
                max:12,
              },
              {
                validator: this.handleValidTopicName,
              },
            ],
          })
          (<Input/>)
        }
      </FormItem>
       <FormItem
              {...formItemLayout}
              label="显示顺序"
          >
            {
              getFieldDecorator('showIndex',{
                rules: [
                  {
                    type:'integer',
                    required:true ,
                    whitespace: true,
                    message: '显示顺序为必填',
                    min:0,
                  },
                ],
              })
              (<InputNumber/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="是否可用"
          >
            {
              getFieldDecorator('enabled',{
                rules: [
                  {
                    type:'boolean',
                    required:true ,
                    whitespace: true,
                    message: '是否可用为必填项',
                  },
                ],
              })
              (<Select>
                {
                  enabledOption.map((item,index)=>{
                    return(<Option key={index} value={item.key}>{item.value}</Option>)
                  })
                }
              </Select>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="权限分配"
          >
            {
              getFieldDecorator('level',{
                rules: [
                  {
                    type: 'array',
                    required:true ,
                    whitespace: true,
                    message: '权限分配为必填项',
                  },
                ],
              })
              (<CheckboxGroup onChange={(checkedValue)=>{console.log('checkedValue',checkedValue)}} options={checkBoxOption}/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label=" 是否线下会议记录"
          >
            {
              getFieldDecorator('isOffline',{
                rules: [
                  {
                    type:'integer',
                    required:true ,
                    whitespace: true,
                    message: '是否线下会议记录为必填项',
                  },
                ],initialValue:2
              })
              (<Select>
                {
                  isOfflineOption.map((item,index)=>{
                    return(<Option key={index} value={item.key}>{item.value}</Option>)
                  })
                }
              </Select>)
            }
          </FormItem>
          <Row>

            <Col span={6}  offset={6}><Button  className="resetBtn" onClick={()=>location.hash = TaskTopicList}>取消</Button></Col>
            <Col span={6} ><Button className="queryBtn" onClick={this.handleSubmit} >保存</Button></Col>
          </Row>

    </Form>);
  }
}