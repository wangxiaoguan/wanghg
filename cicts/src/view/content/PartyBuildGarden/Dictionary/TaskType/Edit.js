import React, { Component } from 'react';
import { Form, message,Steps , Input, Button,Row,Col,Select ,Checkbox,DatePicker,InputNumber ,Radio} from 'antd';
import API_PREFIX from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {TaskTypeList, //党建任务列表
} from '../URL';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
@Form.create()
export default class Edit extends  Component {
  constructor(props){
    super(props);

    this.state={
      topicOption:[],
      id:GetQueryString(location.hash,['id']).id,//编辑时的id
      info:{},//编辑时的详情数据,通过接口获取
    }
  }
  componentDidMount(){
    //页面相关的数据处理
    let info = sessionStorage.getItem('topicTypeData') ? JSON.parse(sessionStorage.getItem('topicTypeData')) : {}
    this.setState({info})
    this.dealData();
  }
  dealData=()=>{
    //获取任务主题数据作为下拉框
    getService(API_PREFIX+'services/web/party/taskTopic/getList/1/1000',data=>{
      if(data.status===1){//接口返回成功
        let topicOption=this.state.topicOption;
        data.root.list&&data.root.list.map((item)=>{
          topicOption.push({value:item.id+'', label:item.topicName});
        });
        this.setState({
          topicOption
        });
      }else{
        console.log('任务主题接口报错',data.errroMsg);
      }
    });
    // getService(API_PREFIX+`services/partybuilding/tasktype/taskTypeList/get/1/10?Q=id_I_EQ=${this.state.id}`,data=>{
    //   if(data.retCode===1){//接口返回数据成功
    //     if( data.root.list.length>0){
    //       console.log('data.root.list[0]',data.root.list[0]);
    //       this.setState({info: data.root.list[0]});
    //     }
    //   }
    // });

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
        'topicId':fieldsValue['topicId'].toString(),
        'id':this.state.id,
      }
      postService(API_PREFIX+'services/web/party/taskType/update',values,data=>{
        if(data.status===1){//新增成功
          message.success('编辑成功');
          location.hash = TaskTypeList
        }else{
          message.error(data.errorMsg);
        }
      });
    });
  }
  //任务类型名称的校验
  handleValidTypeName= (rule, value, callback) => {
    console.log('任务类型名称：',value);
    if(value == ''||value==undefined){
      callback('任务类型名称为必填项!')
    }else if(/^[\s]*$/.test(value)) {
      callback('任务类型名称不能全部为空格!')
    }else{
      postService(API_PREFIX + `services/web/party/taskType/verify/${value}/edit?id=${this.state.id}`, null, data => {
        if(data.status === 1){
          if(data.root.object) { // true为重复，fasle为不重复
            callback('任务类型名称已存在!');
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
    sessionStorage.removeItem('topicTypeData')
  }
  render(){
    const {getFieldDecorator}=this.props.form;
    const {topicOption,info}=this.state;
    console.log('info',info);
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
              getFieldDecorator('typeName',{
                rules: [
                  {
                    required:true ,
                    whitespace: true,
                    // message: '任务类型名称为必填项且最大长度不能超过12',
                    max:12,
                    validator: this.handleValidTypeName,
                  },
                ],initialValue:info.typeName
              })
              (<Input/>)
            }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="任务主题"
          >
            {
              getFieldDecorator('topicId',{
                rules: [
                  {
                    type: 'array',
                    required:true ,
                    whitespace: true,
                    message: '任务主题为必填项',
                    max:12,
                  },
                ],initialValue:info.topicId?info.topicId.split(','):[]

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
                ],initialValue:info.showIndex
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
                ],initialValue:info.isEnabled
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