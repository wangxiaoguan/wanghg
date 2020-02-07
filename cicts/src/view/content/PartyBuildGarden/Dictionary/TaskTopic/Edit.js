import React, { Component } from 'react';
import { Form, message,Steps , Input, Button,Row,Col,Select ,Checkbox,DatePicker,InputNumber ,Radio} from 'antd';
import API_PREFIX from '../../../apiprefix';
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
    this.state={
      id:GetQueryString(location.hash,['id']).id,//编辑时的id
      info:{},//编辑时的详情数据,通过接口获取
    }
  }
  componentDidMount(){
    //页面相关的数据处理
    // this.dealData();
    let info = sessionStorage.getItem('topicTaskData') ? JSON.parse(sessionStorage.getItem('topicTaskData')) : {}
    this.setState({info})
  }
  // dealData=()=>{
  //   //根据id插叙详情数据 （QueryFilter拼接）
  //   getService(API_PREFIX+`services/partybuilding/tasktopic/taskTopicList/get/1/10?Q=id_I_EQ=${this.state.id}`,data=>{
  //     if(data.retCode===1){//接口返回数据成功
  //       if( data.root.list.length>0){
  //         console.log('data.root.list[0]',data.root.list[0]);
  //         this.setState({info: data.root.list[0]});
  //       }
  //     }
  //   });
  // }
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
        'topicLevel':fieldsValue['topicLevel'].toString(),
        'id':this.state.id,
      }
      postService(API_PREFIX+'services/web/party/taskTopic/update',values,data=>{
        if(data.status===1){//新增成功
          message.success('编辑成功');
          location.hash = TaskTopicList
        }else{
          message.error(data.errorMsg);
        }
      });
    });
  }
  //任务主题名称的校验
  handleValidTopicName= (rule, value, callback) => {
    console.log('任务主题名称：',value);
    if(value == ''||value==undefined){
      callback('任务主题名称为必填项!')
    }else if(/^[\s]*$/.test(value)) {
      callback('任务主题名称不能全部为空格!')
    }else{
      postService(API_PREFIX + `services/web/party/taskTopic/verify/${value}/edit?id=${this.state.id}`, null, data => {
        if(data.status === 1){
          if(data.root.object) { // true为重复，fasle为不重复
            callback('任务主题名称已存在!');
          }else {
            callback()
          }
        }else{
          message.error(data.errorMsg)
          callback()
        }
      })
    }
  }
  componentWillUnmount() {
    sessionStorage.removeItem('topicTaskData')
  }
  render(){
    const {getFieldDecorator}=this.props.form;
    const {info}=this.state;
    const enabledOption=[
      {key:true, value:'是'},
      {key:false, value:'否'},
    ];
    const checkBoxOption=[{label: '党支部以上接口人', value: '1'},{label: '党支部接口人', value: '2'}]
    const isOfflineOption=[
      {key:1, value:'是'},
      {key:2, value:'否'},
      {key:0, value:'不固定'},
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
              getFieldDecorator('topicName',{
                rules: [
                  {
                    required:true ,
                    whitespace: true,
                    // message: '任务主题名称为必填项且最大长度不能超过12',
                    max:12,
                  },
                  {
                    validator: this.handleValidTopicName,
                  },
                ],initialValue:info.topicName,
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
                ],initialValue:info.showIndex,
              })
              (<InputNumber/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="是否可用"
          >
            {
              getFieldDecorator('isEnabled',{
                rules: [
                  {
                    type:'boolean',
                    required:true ,
                    whitespace: true,
                    message: '是否可用为必填项',
                  },
                ],initialValue:info.isEnabled,
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
              getFieldDecorator('topicLevel',{
                rules: [
                  {
                    type: 'array',
                    required:true ,
                    whitespace: true,
                    message: '权限分配为必填项',
                  },
                ],initialValue:info.topicLevel?info.topicLevel.split(','):[],
              })
              (<CheckboxGroup onChange={(checkedValue)=>{console.log('checkedValue',checkedValue)}}  options={checkBoxOption}/>)
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
                ],initialValue:info.isOffline,
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