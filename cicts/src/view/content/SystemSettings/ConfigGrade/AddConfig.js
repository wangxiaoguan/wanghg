import React, { Component } from 'react';
import { Form, message,Steps , Input, Button,Row,Col,Select,Modal ,Checkbox,DatePicker,InputNumber ,Radio} from 'antd';
import API_PREFIX from '../../apiprefix';

import {postService,GetQueryString,getService } from '../../myFetch.js';

import {connect} from 'react-redux';

import moment from 'moment';

import { BEGIN } from '../../../../redux-root/action/table/table';

// import TableSearch from '../../../component/table/TableSearch';

// import TableAndSearch from '../../../../component/table/TableAndSearch';

// import RichText from '../../../component/richTexteditor/editor';
// import RichText from '../../../component/richTexteditor/braftEditor';


const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Step = Steps.Step;
const { TextArea } = Input;
//日期格式
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

import {setFormData,setTopicId,setPartyId} from '../../../../redux-root/action/attach/attach';

@connect(
    state => ({
      pageData: state.table.pageData,   
      selectRowsData: state.table.selectRowsData,  //获取选中行的数据
      getArticleData:state.attach.articleData,//获取添加文章的数据
      getActivityData:state.attach.activityData,//获取添加活动的数据
      getFileData :state.attach.fileData,//获取添加文件的数据
      getTopicId:state.attach.getTopicId,
      getPartyId:state.attach.getPartyId,
    }),
    dispatch => ({
      setTableData: n =>dispatch(BEGIN(n)),
      setTopicId:n=>dispatch(setTopicId(n)),
      setPartyId:n=>dispatch(setPartyId(n)),
      setFormData:n=>dispatch(setFormData(n)),
    })
)
@Form.create()
export default class AddConfig extends  Component {
  constructor(props){
    super(props);
    this.state={
      disabled:false,
      checkName:false,
      checkValue:false,
        
    };
  }
  handleSubmit=(e)=>{   //如果next不为空，则为“保存并下一步”
    e.preventDefault();
    let checkName=this.state.checkName;
    let checkValue=this.state.checkValue;
    this.props.form.validateFields((err, fieldsValue) => {
 
      if (err) {

        return;
      }
      if(checkName){
        message.error('配置名称中含有非法字符');
        return;
      }
      if(checkValue){
        message.error('配置值中含有非法字符');
        return;
      }
      this.setState({disabled:true});
      let values={
        ...fieldsValue,
        // 'createDate':moment(new Date((new Date()/1000+86400)*1000),'YYYY-MM-DD HH:mm:ss'),
      };

      //编辑的接口  POST /system/configInfo/addConfigInfo
      postService(API_PREFIX+'services/web/configInfo/add',values,data=>{
         if(data.status===1){ //增加成功  返回一系列数据，放入redux中
           message.success('新增成功');
           location.hash = '/SystemSettings/ConfigGrade';
         }else{
           message.error(data.errorMsg);
         }
      });
  

    });

  }

  checkName=(data)=>{
    console.log(data.target.value);
    let pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i"); 
    // let pat = new RegExp('[`~!%#$^&*()=|{}\':;\',\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“\'。，、？]')
    if(pat.test(data.target.value)){ 
    message.error("配置名称中含有非法字符"); 
    this.setState({checkName:true}); 
    }else{
      this.setState({checkName:false}); 
    }
}
checkValue=(data)=>{
  console.log(data.target.value);
  let pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i"); 
  // let pat = new RegExp('[`~!%#$^&*()=|{}\':;\',\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“\'。，、？]')
  if(pat.test(data.target.value)){ 
  message.error("配置值中含有非法字符");
  this.setState({checkValue:true}); 
  }else{
    this.setState({checkValue:false}); 
  }

}
  render(){
    const {getFieldDecorator}=this.props.form;  //获取表单中的属性
    const {disabled}=this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 8},
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
    };
    //发起人封装组件的数据
   
  
    return (
        <div>
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout}  label="配置名称">
                  {
                    getFieldDecorator('name',{
                      rules: [
                        {
                          required:true ,
                          whitespace: true,
                          message: '配置名称为必填项且长度',
                          max:60,
                        },
                      ],initialValue:'',
                    })
                    (<Input  />)
                  }
                </FormItem>
                <FormItem {...formItemLayout}  label="配置值">
                  {
                    getFieldDecorator('value',{
                      rules: [
                        {
                          required:true ,
                          whitespace: true,
                          message: '配置值为必填项且最大长度为60',
                          max:60,
                        },
                      ],initialValue:'',
                    })
                    (<Input  />)
                  }
                </FormItem>
                <FormItem {...formItemLayout}  label="启用">
                  {
                    getFieldDecorator('isEnable',{
                      rules: [
                        {
                          type:'boolean',
                          required:true ,
                          whitespace: true,
                          message: '启用为必填项',
                        },
                      ],initialValue:true,
                    })
                    (
                      <RadioGroup>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="配置描述">
                  {
                    getFieldDecorator('description',{
                      rules:[
                        {
                          required:true ,
                          whitespace: true,
                          // message: '任务内容为必填项',
                          validator: (rule, value, callback)=>{
                            if(!value){
                              callback(`配置描述为必填项`);
                            }else if(value.length>200){
                              callback(`配置描述字数不得超过200`);
                            }else {
                              callback();
                            }
                          },
                        },
                      ],initialValue:'',
                    })
                    (
                        <TextArea  autosize={{ minRows: 8, maxRows: 10 }}/>
                    )
                  }
                </FormItem>
                <Row>
                  <Col span={3} offset={10}><Button className="resetBtn" onClick={()=>location.hash ='/SystemSettings/ConfigGrade' } >取消</Button></Col>
                  <Col span={3}><Button className="queryBtn" onClick={(e) => this.handleSubmit(e)}>保存</Button></Col>
                </Row>
              </Form>
         
        </div>
    );
  }
}