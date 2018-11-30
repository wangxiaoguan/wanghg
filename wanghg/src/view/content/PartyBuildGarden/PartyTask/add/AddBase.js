import React, { Component } from 'react';
import { Form, Message,Steps , Input, Button,Row,Col,Select,Modal ,Checkbox,DatePicker,InputNumber ,Radio} from 'antd';
import {PartyTaskList, //党建任务列表
} from '../../URL';
import API_PREFIX from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {connect} from 'react-redux';
import moment from 'moment';
import { BEGIN } from '../../../../../redux-root/action/table/table';
import TableSearch from '../../../../component/table/TableSearch';
// import TableAndSearch from '../../../../component/table/TableAndSearch';
import RichText from '../../../../component/richTexteditor/editor';
import ArticleAttach from '../attach/ArticleAttach';
import ActivityAttach from '../attach/ActivityAttach';
import FileAttach from '../attach/FileAttach'
const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Step = Steps.Step;
const { TextArea } = Input;
//日期格式
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
import {setFormData,setTopicId,setPartyId} from '../../../../../redux-root/action/attach/attach';

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
export default class AddBase extends  Component {
  constructor(props){
    super(props);
    console.log(props)
    this.state={
      //选择用户
      selectOptions:[],//发起人下拉框选项
      partyOptions:[],//发起人职务所在党组织下拉框选项
      checkBoxOption:[],//关联上级工作部署选项  通过接口获取数据
      topicOption:[],//任务主题下拉框选项
      typeOption:[],//任务类型下拉选项
      showModal:false,//modal的展示
      showModalKey:0,//modal的展示
      userSelectd:false,//发起人是否已经选择了  默认为未选择    只有选择了发起人，才能选择任务主题
      topictSeclected:false,//任务主题是否选择了，默认为未选择  只有选择了任务主题，才能选择任务类型和是否线下会议纪要
      isOfflineDisabled:true,//是否线下会议记录  若为先关主题对应的是否线下会议记录若为不固定，则 不禁用，否则禁用
      topicId:'',
      isDisalbed:false,//  如果是  回传数据（上一步），则isDisalbed:false  即不禁用，  否则，禁用
      level:'',//发起所在党组织的level
      timePushModal:false,//定时发布的弹窗
      timePushKey:0,//定时发布弹窗的key
      timePushValue:'',//定时发布的时间
      selectedDate:'',//时间控件选择到的时间
      flowData:this.props.flowData,
      topicName:'',
      typeName:'',
      holdBtn:false
    }
  }

  componentDidUpdate(){
    if (this.props.flowData&&this.props.flowData !== this.state.flowData) {
      this.setState({flowData: this.props.flowData}, () => {
        //总的数据，返回上一步，父组件传入的 initialValue
        let flowData = this.state.flowData;
        //页面相关的数据处理
        this.dealData(flowData);
      });
    }

  }
  dealData=(flowData)=>{
    //回传数据时，根据选中的任务主题id，调用任务类型接口 topicId

    if(flowData&&Object.keys(flowData).length!=0){
      if(flowData.timedDate&&flowData.isTimed==1){
        this.setState({timePushValue:flowData.timedDate});
      }
      this.setState({isDisalbed:true});
      if(flowData.topicId){//不为空
        let typeOption =flowData.typeOption;
        let partyOptions =flowData.partyOptions;
        this.setState({partyOptions});
          getService(API_PREFIX+`services/partybuilding/task/get/selectTaskTypeByTopicId/${flowData.topicId}`,(data)=>{
          if(data.retCode===1){
            data.root.list&&data.root.list.map(item=>{
              typeOption.push({key: item.id, value: item.name});
            });
 
            this.setState({typeOption,},()=>{

            });
          }
        });
        //任务主题    根据选中的任务类型，获取对应任务类型对应的 是否线下会议记录
          getService(API_PREFIX+`services/partybuilding/task/taskTopicList/get/1/10?Q=id_I_EQ=${flowData.topicId}`,(data)=>{
          if(data.retCode===1){
            if(data.root.list.length>0){
              let info=data.root.list[0];
              //设置任务主题的Option
              this.setState({topicOption:[{key: info.id, value: info.name}]});
              console.log('info',info);
              if(info.isOffline==2){ //对应是否需要线下会议纪要  不固定
                //不做任何处理
                this.setState({isOfflineDisabled:false});
              }else{
                //禁用，并设置值
                this.setState({isOfflineDisabled:true});
                this.props.form.setFieldsValue({isOffline:info.isOffline}); //为userId设置值
              }
            }
          }
        });

      }
    }
  }
  
  //按钮点击事件  弹出modal
  handleClick=()=>{
    this.setState({
      showModal:true,
      showModalKey:this.state.showModalKey+1
    });
  }
  //modal确定     1、将选中数据设置给select  2、关闭弹窗
  handleOk=()=>{
    this.setState({
      showModal:false,
    });
    let selectedData=this.props.selectRowsData; //获取勾选的值
    sessionStorage.partyId=selectedData[0].partyId;
    //根据发起人的level确定其能发布的任务主题
    let topicOption =this.state.topicOption;
    getService(API_PREFIX+`services/partybuilding/task/get/selectTopicIdByUserLevel/${selectedData[0].level}`,(data)=>{
      if(data.retCode===1){
        topicOption = [];
        data.root.list&&data.root.list.map(item=>{
          topicOption.push({key: item.id, value: item.name});
        });
        this.setState({topicOption,level:selectedData[0].level},()=>{

        });
      }
    });
    //关联上级工作部署
    getService(API_PREFIX+`services/partybuilding/task/get/queryUntiedTask/${selectedData[0].partyId}`,data=>{
      if(data.retCode===1){
        //通过接口获取多选框中的数据
        let checkBoxOption=[];
        data.root.list&&data.root.list.map(item=>{
          checkBoxOption.push({label:item.taskName, value: item.id});
        });
        this.setState({checkBoxOption},()=>{
 
        });
      }
    });
 
    this.setState({selectOptions:[{key:selectedData[0].userId,value:selectedData[0].userName,}],
      partyOptions:[{key:selectedData[0].partyId,value:selectedData[0].partyName,}],
      userSelectd:true,
    },()=>{

      this.props.form.setFieldsValue({userId:selectedData[0].userId}); //为userId设置值
      this.props.form.setFieldsValue({upPartyId:selectedData[0].partyId}); //为userId设置值
    });

  }
  //modal 取消
  handleCancel=()=>{
    this.setState({
      showModal:false,
    });
  }
  handleSubmit=(e,next)=>{   //如果next不为空，则为“保存并下一步”
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
  
      if (err) {
    
        return;
      }
      this.setState({holdBtn:true})
      //将 topicId   upPartyName（PartyId） 放入缓存中，在设置接收人中使用
      // console.log('this.props.selectRowsData',this.props.selectRowsData,this.props.selectRowsData[0]);

      // console.log('getArticleData',this.props.getArticleData);
      // console.log('getActivityData',this.props.getActivityData);
      // console.log('getFileData',this.props.getFileData);
      let values={
        ...fieldsValue,
        'endDate':fieldsValue['endDate'].format(dateFormat),
        'articleAttach':this.props.getArticleData?this.props.getArticleData:[],
        'activityAttach':this.props.getActivityData?this.props.getActivityData:[],
        'fileAttach':this.props.getFileData?this.props.getFileData:[],
        'taskId':fieldsValue['taskId'].toString(),
        'upPartyName':this.state.partyOptions[0].value,
        'userName':this.state.selectOptions[0].value,
        'topicName':this.state.topicOption[0].value,
        'typeName':this.state.typeOption[0].value,
        'pushStatus':0,

      }
  
      if(this.props.flowData&&this.props.flowData.id){//编辑
        values={...values,
          'id':this.props.flowData.id,
        }  
        //编辑的接口  （点击上一步后再点击保存）
        postService(API_PREFIX+'services/partybuilding/task/update/updateTask',values,data=>{
          if(data.retCode===1){ //增加成功  返回一系列数据，放入redux中
            Message.success('保存成功');
            if(next){ //保存并下一步
              if(data.root.object){
                //向缓存中放数据
                this.props.setFormData({...data.root.object,
                      selectOptions:this.state.selectOptions,
                      partyOptions:this.state.partyOptions,
                      level:this.state.level,
                      timedDate:data.root.object?this.state.timePushValue:'',
                      topicName:this.state.topicName,
                      typeName:this.state.typeName,
                      topicOption:this.state.topicOption,
                      typeOption:this.state.typeOption
                    }
                );
              }
              this.props.setPartyId(fieldsValue['upPartyId']);
              this.props.setTopicId(fieldsValue['topicId']);
              this.props.next();//跳到下一步
            }else{ //单单保存，返回当前页面
              location.hash = PartyTaskList;
            }
    

            //定时发布设置：
            if(values.isTimed==1){//是  定时发布
              if(this.props.flowData.timedDate){ //之前有过定时
                this.timePush(this.props.flowData.id);
              }else{
                this.timePush(this.props.flowData.id,'add');
              }
            }


          }else{
            Message.error(data.retMsg);
          }
        });
      }else{ //新增
        //新增的接口
        postService(API_PREFIX+'services/partybuilding/task/add/insertTask',values,data=>{
          if(data.retCode===1){ //增加成功  返回一系列数据，放入redux中
            Message.success('新增成功');
            if(data.root.object){
    
              this.props.setFormData({...data.root.object,
                    selectOptions:this.state.selectOptions,
                    partyOptions:this.state.partyOptions,
                    level:this.state.level,
                    timedDate:data.root.object?this.state.timePushValue:'',
                    topicName:this.state.topicName,
                    typeName:this.state.typeName,
                    topicOption:this.state.topicOption,
                    typeOption:this.state.typeOption
                  }
              );
        
              //定时发布设置：
              if(values.isTimed==1){//是  定时发布
                this.timePush(data.root.object.id,'add');
              }

            }
            if(next){ //保存并下一步
              this.props.next();//跳到下一步
            }else{ //单单保存，返回当前页面
              location.hash = PartyTaskList
            }
          }else{
            Message.error(data.retMsg);
          }
        });
      }
    });
  }
  //定时发布相关
  timePush=(id,add)=>{

    let  body= {
      taskName: '党建任务定时发布任务',
      operateType: 1,
      queryType: 'post',
      queryUrl: API_PREFIX+'services/partybuilding/task/update/updateTasksOnline',
      queryValue: {
        ids: [id]
      },
      cronDate:this.state.timePushValue,
      queryContentType: 'application/json',
    };
    postService(API_PREFIX + `services/automation/job/${add?'add':'update'}`, body, timeData => {
      if (timeData.retCode === 1) {
        let jobId = timeData.root.id;
        getService(API_PREFIX + `services/partybuilding/task/insert/addJobId/${id}/${jobId}`, bindData => {
              if (bindData.retCode !== 1) {
                Message.error(bindData.retMsg);
              }
            }
        );
      }else{
        Message.error(timeData.retMsg);
      }
    });

  }
  //  search框，点击回车后条件查询
  handleSearch=(data,url)=>{

    this.props.setTableData(API_PREFIX + `${url}/1/10?Q=userName_S_LK=${data.target.value}`);
  }
  //任务主题选择后
  handleSelect=(value)=>{

    sessionStorage.topicId=value;
    //任务类型
    let typeOption =this.state.typeOption; //
    getService(API_PREFIX+`services/partybuilding/task/get/selectTaskTypeByTopicId/${value}`,(data)=>{
      if(data.retCode===1){
        typeOption = [];
        data.root.list&&data.root.list.map(item=>{
          typeOption.push({key: item.id, value: item.name});
        });
    
        this.setState({typeOption,topictSeclected:true,},()=>{

        });
      }
    });
    //任务主题    根据选中的任务类型，获取对应任务类型对应的 是否线下会议记录
    getService(API_PREFIX+`services/partybuilding/task/taskTopicList/get/1/10?Q=id_I_EQ=${value}`,(data)=>{
      if(data.retCode===1){
        if(data.root.list.length>0){
           let info=data.root.list[0];
     
           this.setState({topicName:info.name})
           if(info.isOffline==2){ //对应是否需要线下会议纪要  不固定
              //不做任何处理
             this.setState({isOfflineDisabled:false});
           }else{
             //禁用，并设置值
             this.setState({isOfflineDisabled:true});
             this.props.form.setFieldsValue({isOffline:info.isOffline}); //为userId设置值
           }
        }
     
      
      }
    });
  }

  typeSelect=(value)=>{
    this.state.typeOption.map((item)=>{
      if(item.key==value){
        this.setState({typeName:item.value})
      }
    })
   
  }
  //任务截止前  天 提醒
  handleInputChange=(value)=>{
    this.props.form.setFieldsValue({remindDate:value}); //为userId设置值
  }
  //定时发布
  onRadioChange=(e)=>{

   if(e.target.value==1){ //是 出现定时发布的弹窗
   this.setState({
     timePushKey:this.state.timePushKey+1,
     timePushModal:true,
   });
   }else{
     this.setState({
       timePushModal:false,  //选择否，关闭弹窗
      timePushValue:'',//将定时发布的时间置空
     });
   }
  }
  //定时发布弹窗  取消
  cancleTimePush=()=>{
    this.setState({ timePushModal: false });
    this.props.form.setFieldsValue({isTimed:0});
  }
  //定时发布弹窗  确定
  okTimePush=()=>{
 
    this.setState({ timePushModal: false ,timePushValue:this.state.selectedDate});
  }
  //禁选的时间
  disabledDate=(current)=> {
    return moment(new Date()).subtract(1,'d').isAfter(current);
  }
  render(){
    const {getFieldDecorator}=this.props.form;  //获取表单中的属性
    let {selectOptions,showModalKey,showModal,partyOptions,checkBoxOption,topicOption,typeOption,topicName,holdBtn}=this.state;
    const {
      flowData,//回填数据，若不为空，则是回填数据，为空时，不做任何处理
    }=this.props;
    let isTopic=topicName=='重要工作部署'||topicName=='党课'||topicName=='支部党员大会'||topicName=='党支部委员会'||topicName=='党小组会'
    console.log(isTopic,topicName)
    if(JSON.stringify(flowData) != "{}"){
      selectOptions.push({key:flowData.userId, value:flowData.userName});
      partyOptions.push({key:flowData.upPartyId, value:flowData.upPartyName});
      topicOption.push({key:flowData.topicId, value:flowData.topicName});
      typeOption.push({key:flowData.typeId, value:flowData.typeName})
    }
   

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
    //发起人封装组件的数据
    const userData={
      operation:'选择用户',//按钮名称
      modalData:{
        title:'选择用户',
        cancelText:'取消',
        okText:'确定',
      },
      tableData:{
        columns:[
          {
            title: '序号',
            key: 'sNum',
            dataIndex: 'sNum',
          },
          {
            title:'用户姓名',
            dataIndex:'userName',
            key:'userName',
          },
          {
            title:'党组织',
            dataIndex:'partyName',
            key:'partyName',
          },
          {
            title:'职务',
            dataIndex:'postName',
            key:'postName',
          },
        ],
        url:'services/partybuilding/task/get/queryAllPost',
      }

    }
  
    return (
        <div>
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="任务名称"
                >
                  {
                    getFieldDecorator('taskName',{
                      rules: [
                        {
                          required:true ,
                          whitespace: true,
                          message: '任务名称为必填项且最大长度不能超过50',
                          max:50,
                        },
                      ],initialValue:flowData?flowData.taskName:''
                    })
                    (<Input disabled={this.state.isDisalbed} />)
                  }
                </FormItem>
                {/* <Row  gutter={6}>
                  <Col span={10} offset={2} > */}
                    <FormItem
                        {...formItemLayout}
                        label="发起人"
                    >
                      {
                        getFieldDecorator('userId',{
                          rules: [
                            {
                              type:'number',
                              required:true ,
                              whitespace: true,
                              message: '发起人为必填项',
                            }
                          ], initialValue:flowData?flowData.userId:''
                        })
                        (
                          <Select  style={{width:'50%',display:'inline-block'}}
                          >
                            {
                              selectOptions&&selectOptions.map((item,index)=>
                                  <Option value={item.key} key={item.key} >
                                    {item.value}
                                  </Option>)
                            }
                          </Select>
                            
                            
                        )
                      }　　　
                      <Button onClick={this.handleClick} disabled={this.state.isDisalbed}>
                      {userData.operation}
                    </Button>
                    </FormItem>
                  {/* </Col> */}
                  {/* <Col span={4}> */}
                    {/* <Button onClick={this.handleClick} disabled={this.state.isDisalbed}>
                      {userData.operation}
                    </Button> */}
                  {/* </Col>
                </Row> */}
                <FormItem
                    {...formItemLayout}
                    label="发起人党组织"
                >
                  {
                    getFieldDecorator('upPartyId',{
                      rules: [
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '发起人党组织为必填项',
                        }
                      ],
                   initialValue:flowData?flowData.upPartyId:''
                    })
                    (<Select 
                //  disabled={true}
                    >
                      {
                        partyOptions&&partyOptions.map((item)=>{
                          return (
                            <Option value={item.key} key={item.key}>{item.value}</Option>
                          )
                        })
                      }
                    </Select>)
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="关联上级工作部署"
                >
                  {
                    getFieldDecorator('taskId',{
                      rules:[
                        {
                          type: 'array',
                          required:false ,
                          whitespace: true,
                          message: '关联上级工作部署为必填项',
                        }
                      ],initialValue:flowData&&flowData.taskId?flowData.taskId.split(','):[]
                    })
                    (
                        <CheckboxGroup options={checkBoxOption}></CheckboxGroup>

                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="任务主题"
                >
                  {
                    getFieldDecorator('topicId',{
                      rules:[
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '任务主题为必填项',
                        }
                      ],initialValue:flowData?flowData.topicId:''
                    })
                    (
                        <Select
                            // disabled={!this.state.userSelectd}
                            onSelect={this.handleSelect}
                        >
                          {
                            topicOption&&topicOption.map((item)=>{
                              return (<Option key={item.key} value={item.key}>{item.value}</Option>)
                            })
                          }
                        </Select>

                    )
                  }

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="任务类型"
                >
                  {
                    getFieldDecorator('typeId',{
                      rules:[
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '任务类型为必填项',
                        }
                      ],initialValue:flowData?flowData.typeId:''
                    })
                    (
                        <Select     onSelect={this.typeSelect}
                        // disabled={!this.state.topictSeclected}
                        >
                          {
                            typeOption&&typeOption.map((item)=>{
                              return (<Option key={item.key} value={item.key}>{item.value}</Option>)
                            })
                          }
                        </Select>

                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否线下会议记录"
                >
                  {
                    getFieldDecorator('isOffline',{
                      rules:[
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '是否线下会议记录为必填项',
                        }
                      ],initialValue:JSON.stringify(flowData)!=='{}'?flowData.isOffline:isTopic?0:''
                    })
                    (
                        <Select  disabled={topicName=="重要工作部署"?true:false}
                            // disabled={!this.state.topictSeclected||this.state.isOfflineDisabled}
                        >
                          <Option key="1" value={1}>是</Option>
                          <Option key="0" value={0}>否</Option>
                        </Select>

                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否需要回执"
                >
                  {
                    getFieldDecorator('isNeedReceipt',{
                      rules:[
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '是否需要回执为必填项',
                        }
                      ],initialValue:JSON.stringify(flowData)!=='{}'?flowData.isNeedReceipt:topicName=='重要工作部署'?0:(topicName=='党课'||topicName=='支部党员大会'||topicName=='党支部委员会'||topicName=='党小组会')?1:''
                    })
                    (
                        <Select disabled={topicName=="重要工作部署"?true:false}>
                          <Option key="1" value={1}>是</Option>
                          <Option key="0" value={0}>否</Option>
                        </Select>

                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="任务截止时间"
                >
                  {
                    getFieldDecorator('endDate',{
                      rules:[
                        {
                          type:'object',
                          required:true ,
                          whitespace: true,
                          message: '任务截止时间为必填项',
                        }
                      ],initialValue:moment(flowData&&flowData.endDate?flowData.endDate:new Date((new Date()/1000+86400)*1000),dateFormat)
                    })
                    (
                        <DatePicker
                          showTime
                          format={dateFormat}
                        >

                        </DatePicker>

                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="任务内容"
                >
                  {
                    getFieldDecorator('content',{
                      rules:[
                        {
                          required:true ,
                          whitespace: true,
                          message: '任务内容为必填项',
                        }
                      ],initialValue:flowData&&flowData.content?flowData.content:''
                    })
                    (
                        <TextArea autosize={{ minRows: 8, maxRows: 10 }}/>
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="党建荣誉积分"
                >
                  {
                    getFieldDecorator('specialPoint', {
                      initialValue:flowData&&flowData.specialPoint?flowData.specialPoint:3
                    })
                    (
                        <InputNumber/>
                    )
                  }
                </FormItem>


                {/* <div>
                  <label>{ "任务附件"}</label> */}
                  {/* <Row><Col> */}
                    <FormItem
                        {...formItemLayout}   label="任务附件"
                    >
                      {
                        getFieldDecorator('articleAttach',{})
                        (
                            <ArticleAttach flowData={flowData?flowData.articleAttach:[]}/>
                        )
                      }
                    </FormItem>
                  {/* </Col></Row> */}
                  {/* <Row><Col> */}
                    <FormItem
                        {...formItemLayout}  label="　"
                    >
                      {
                        getFieldDecorator('activityAttach',{})
                        (
                            <ActivityAttach flowData={flowData?flowData.activityAttach:[]}/>
                        )
                      }
                    </FormItem>
                  {/* </Col></Row>
                  <Row><Col> */}
                    <FormItem
                        {...formItemLayout} label="　"
                    >
                      {
                        getFieldDecorator('fileAttach',{})
                        (
                            <FileAttach flowData={flowData?flowData.fileAttach:[]}/>

                        )
                      }
                    </FormItem>
                  {/* </Col></Row> */}
                {/* </div> */}
                <FormItem
                    {...formItemLayout}
                    label="提醒"
                > 截止前　
                  {
                    getFieldDecorator('remindDate', {
                      initialValue:flowData?flowData.remindDate:''
                    })
                    (
                        // <div>
                          <InputNumber onChange={this.handleInputChange}/>
                        // </div>
                    )
                  }　天
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="是否定时发布"
                >
                  {
                    getFieldDecorator('isTimed',{
                      rules:[
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '是否定时发布为必填项',

                        }
                      ],
                      initialValue:flowData&&flowData.isTimed?flowData.isTimed:0
                    })
                    (
                        <RadioGroup
                            onChange={this.onRadioChange}
                        >
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </RadioGroup>

                    )
                  }<span onClick={()=>this.setState({timePushModal:true,timePushKey:this.state.timePushKey+1})}>{this.state.timePushValue}</span>
                </FormItem>
                <Row>
                  <Col span={2}  offset={6}><Button  className="resetBtn" onClick={()=>location.hash = PartyTaskList}>取消</Button></Col>
                  <Col span={2} ><Button className="queryBtn" disabled={holdBtn} onClick={this.handleSubmit} >保存</Button></Col>
                  <Col span={2} ><Button className="queryBtn" disabled={holdBtn} onClick={e=>this.handleSubmit(e,'next')}>保存并下一步</Button></Col>
                </Row>
              </Form>
          <Modal
              width={1000}
              title={userData.modalData.title}
              cancelText={userData.modalData.cancelText}
              okText={userData.modalData.okText}
              maskClosable={false}//点击蒙层是否关闭
              key={showModalKey}
              visible={showModal}
              destroyOnClose={true}
              onOk={this.handleOk}
              onCancel={this.handleCancel}

          >
            <TableSearch
                scroll={{width:1000}}
                columns={userData.tableData.columns}
                url={userData.tableData.url}
                onSearch={(value)=>this.handleSearch(value,userData.tableData.url)}
            />
          </Modal>
          <Modal
              title="定时发布"
              key={this.state.timePushKey}
              visible={this.state.timePushModal}
              onCancel={this.cancleTimePush}
              onOk={this.okTimePush}
              destroyOnClose={true}>
            <label style={{marginRight:'10px'}}>定时发布时间</label>
            <DatePicker format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={this.disabledDate}
                        onChange={(moment,str) => this.setState({ selectedDate:str})}
                        showTime/>
          </Modal>
        </div>
    );
  }
}