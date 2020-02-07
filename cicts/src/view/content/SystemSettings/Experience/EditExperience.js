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
     id:GetQueryString(location.hash,['id']).id,//编辑时的id
     editTaskData:'',   
    }
  }
  componentWillMount(){
    //services/system/level/getLeveByName/1/10?Q=id_S_EQ
    this.dealData()
    console.log(moment(new Date((new Date()/1000+86400)*1000),'YYYY-MM-DD HH:mm:ss'))
  }

  dealData=()=>{
    //根据传入的id，获取党建任务的详情信息
    getService(API_PREFIX+`services/system/level/getLeveByName/1/10?Q=id_S_EQ=${this.state.id}`,data=>{
      if(data.retCode===1){
        if(data.root.list){
          let editTaskData=data.root.list[0];
          console.log(editTaskData)
          this.setState({editTaskData});
        }
       
       
      }
    });
  }
  componentDidUpdate(){
    
    

  }
  
  handleSubmit=(e)=>{   //如果next不为空，则为“保存并下一步”
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
 
      if (err) {

        return;
      }
      this.setState({disabled:true})
      let values={
        ...fieldsValue,
        'levelid':this.state.id,
        'updatetime':moment(new Date((new Date()/1000+86400)*1000),'YYYY-MM-DD HH:mm:ss'),
      }

      postService(API_PREFIX+'services/system/level/updateLevel',values,data=>{
         if(data.retCode===1){ //增加成功  返回一系列数据，放入redux中
           message.success('编辑成功');
           location.hash = '/SystemSettings/Experience'
         }else{
           message.error(data.retMsg);
         }
      });
  

    });

  }
  render(){
    const {getFieldDecorator}=this.props.form;  //获取表单中的属性
    const {disabled,editTaskData}=this.state;
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
        <div className='experience'>
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout}  label="等级名称">
                  {
                    getFieldDecorator('levelname',{
                      rules: [
                        {
                          required:true ,
                          whitespace: true,
                          message: '等级名称为必填项且最大长度不能超过16',
                          max:16,
                        },
                      ],initialValue:editTaskData?editTaskData.levelname:''
                    })
                    (<Input  />)
                  }
                </FormItem>
                <FormItem {...formItemLayout}  label="经验值大于">
                  {
                    getFieldDecorator('credits',{
                      rules: [
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '配置值为必填项',
                        },
                      ],initialValue:editTaskData?editTaskData.credits:''
                    })
                    (<InputNumber style={{width:'100%'}} min={1} />)
                  }
                </FormItem>
                <FormItem {...formItemLayout}  label="经验值小于">
                  {
                    getFieldDecorator('creditsmax',{
                      rules: [
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '配置值为必填项',
                        },
                      ],initialValue:editTaskData?editTaskData.creditsmax:''
                    })
                    (<InputNumber style={{width:'100%'}} min={1}  />)
                  }
                </FormItem>
                <FormItem {...formItemLayout}  label="级别">
                  {
                    getFieldDecorator('grade',{
                      rules: [
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '级别为必填项',
                        },
                      ],initialValue:editTaskData?editTaskData.grade:''
                    })
                    (<InputNumber style={{width:'100%'}} min={1}  />)
                  }
                </FormItem>
               
                <Row>
                  <Col span={3} offset={10}><Button className="resetBtn" onClick={()=>location.hash ='/SystemSettings/Experience' } >取消</Button></Col>
                  <Col span={3}><Button className="queryBtn" disabled={disabled} onClick={(e) => this.handleSubmit(e)}>保存</Button></Col>
                </Row>
              </Form>
         
        </div>
    );
  }
}