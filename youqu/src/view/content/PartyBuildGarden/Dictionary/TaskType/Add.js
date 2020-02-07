import React, { Component } from 'react';
import { Form, Message,Steps , Input, Button,Row,Col,Select ,Checkbox,DatePicker,InputNumber ,Radio} from 'antd';
import ServiceApi from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {TaskTypeList, //党建任务列表
} from '../URL';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
@Form.create()
export default class Add extends  Component {
  constructor(props){
    super(props);
    this.state={
      topicOption:[],
      validTypeName:{},//校验任务类型名称
    }
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{
    //获取任务主题数据作为下拉框
    getService(ServiceApi+'services/partybuilding/tasktopic/taskTopicList/get/1/1000',data=>{
      if(data.retCode===1){//接口返回成功
        let topicOption=this.state.topicOption;
        data.root.list&&data.root.list.map((item)=>{
          topicOption.push({value:item.id, label:item.name});
        });
        this.setState({
          topicOption
        });
      }else{
        console.log('任务主题接口报错',data.retMsg);
      }
    });
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
        'type':fieldsValue['type'].toString(),
      }
      postService(ServiceApi+'services/partybuilding/tasktype/add/insertTaskType',values,data=>{
        if(data.retCode===1){//新增成功
          Message.success('新增成功');
          location.hash = TaskTypeList
        }else{
          Message.error(data.retMsg);
        }
      });
    });
  }
  //任务类型名称的校验
  handleValidTypeName= (rule, value, callback) => {
    console.log('任务类型名称：',value);
    if(value == ''||value==undefined){
      callback()
    }else{
      let id='add';
      getService(ServiceApi + `services/partybuilding/tasktype/verifyTypeNameIsUnique/${value}/${id}`, data => {
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
    const {topicOption}=this.state;
    const enabledOption=[
      {key:true, value:'是'},
      {key:false, value:'否'},
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
              label="任务类型名称"
          >
            {
              getFieldDecorator('name',{
                rules: [
                  {
                    required:true ,
                    whitespace: true,
                    message: '任务类型名称为必填项且最大长度不能超过12',
                    max:12,
                  },
                  {
                    validator: this.handleValidTypeName,
                  },
                ],
              })
              (<Input/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="任务主题"
          >
            {
              getFieldDecorator('type',{
                rules: [
                  {
                    type: 'array',
                    required:true ,
                    whitespace: true,
                    message: '任务主题为必填项',
                    max:12,
                  },
                ],
              })
              (<CheckboxGroup  options={topicOption}/>)
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
          <Row>

            <Col span={6}  offset={6}><Button  className="resetBtn" onClick={()=>location.hash = TaskTypeList}>取消</Button></Col>
            <Col span={6} ><Button className="queryBtn" onClick={this.handleSubmit} >保存</Button></Col>
          </Row>

        </Form>);
  }
}