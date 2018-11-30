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
      editorData: state.editor.editorData, //获取富文本中的数据
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
export default class EditBase extends  Component {
  constructor(props){
    super(props);
    this.state={
      //选择用户
      checkBoxOption:this.props.checkBoxOption,//关联上级工作部署选项  通过接口获取数据
      topicOption:[],//任务主题下拉框选项
      typeOption:[],//任务类型下拉选项
      showModal:false,//modal的展示
      showModalKey:0,//modal的展示
      userSelectd:false,//发起人是否已经选择了  默认为未选择    只有选择了发起人，才能选择任务主题
      topictSeclected:false,//任务主题是否选择了，默认为未选择  只有选择了任务主题，才能选择任务类型和是否线下会议纪要
      isOfflineDisabled:true,//是否线下会议记录  若为先关主题对应的是否线下会议记录若为不固定，则 不禁用，否则禁用
      disabled:this.props.disabled,//是否禁用，详情时全部禁用，并且详情时只有返回按钮
      value:0,//截止 天 提醒
      editTaskData:this.props.editTaskData,//编辑的数据
      timePushModal:false,//定时发布的弹窗
      timePushKey:0,//定时发布弹窗的key
      timePushValue:'',//定时发布的时间
      selectedDate:'',//时间控件选择到的时间
      number:0,

    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.editorData !== prevState.editorData) {
      return { editorData: nextProps.editorData, updateEditor: true };
    }
    return null;
  }
 
  componentDidUpdate(){
    //页面相关的数据处理
    this.dealData();

  }
  dealData=()=> {

    if (this.props.editTaskData !== this.state.editTaskData) {
      this.setState({ editTaskData: this.props.editTaskData },()=>{
        //通过接口获取多选框中的数据
        let editTaskData=this.state.editTaskData;
       
        if(editTaskData&&editTaskData.timedDate&&editTaskData.isTimed==1){
          this.setState({timePushValue:editTaskData.timedDate});
        }
        //关联上级工作部署
        getService(API_PREFIX+`services/partybuilding/task/get/queryUntiedTask/${editTaskData.upPartyId}`,data=>{
          if(data.retCode===1){
            //通过接口获取多选框中的数据
            let checkBoxOption=this.state.checkBoxOption;
            data.root.list&&data.root.list.map(item=>{
              checkBoxOption.push({label:item.taskName, value: item.id});
            });

            this.setState({checkBoxOption,},()=>{
             
            });
          }
        });

        //任务主题
        let topicOption = this.state.topicOption;
        topicOption.push({key:editTaskData.topicId, value: editTaskData.topicName});
        this.setState({topicOption});
        if(editTaskData){
          this.setState({value:editTaskData&&editTaskData.remindDate?editTaskData.remindDate:'',

              selectOptions:[{key:editTaskData.userId,value:editTaskData.userName,}],
            partyOptions:[{key:editTaskData.upPartyId,value:editTaskData.upPartyName,}]
              },
              );
          if(editTaskData.topicId){ //不为空
            let typeOption =this.state.typeOption;
            getService(API_PREFIX+`services/partybuilding/task/taskTypeList/get/1/1000`,(data)=>{
              if(data.retCode===1){
                data.root.list&&data.root.list.map(item=>{
                  typeOption.push({key: item.id, value: item.name});
                });
   
                this.setState({typeOption,},()=>{
                });
              }
            });
            //任务主题    根据选中的任务类型，获取对应任务类型对应的 是否线下会议记录
            getService(API_PREFIX+`services/partybuilding/task/taskTopicList/get/1/10?Q=id_I_EQ=${editTaskData.topicId}`,(data)=>{
              if(data.retCode===1){
                if(data.root.list.length>0){
                  let info=data.root.list[0];
  
                  if(info.isOffline==2){ //对应是否需要线下会议纪要  不固定
                    //不做任何处理
                    this.setState({isOfflineDisabled:false});
                  }else{
                    //禁用，并设置值
                    this.setState({isOfflineDisabled:true});
                    this.props.form.setFieldsValue({isOffline:info.isOffline});
                  }
                }
  
              }
            });
          }
        }
      });
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
  handleSubmit=(e)=>{   //如果next不为空，则为“保存并下一步”
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
 
      if (err) {

        return;
      }

      let values={
        ...fieldsValue,
        'id':this.props.editTaskData.id,
        'endDate':fieldsValue['endDate'].format(dateFormat),
        'articleAttach':this.props.getArticleData?this.props.getArticleData:[],
        'activityAttach':this.props.getActivityData?this.props.getActivityData:[],
        'fileAttach':this.props.getFileData?this.props.getFileData:[],
         'taskId':fieldsValue['taskId'].toString(),
        'upPartyName':this.state.partyOptions[0].value,
        'userName':this.state.selectOptions[0].value,
      }

      //编辑的接口
      postService(API_PREFIX+'services/partybuilding/task/update/updateTask',values,data=>{
         if(data.retCode===1){ //增加成功  返回一系列数据，放入redux中
           Message.success('编辑成功');
    
         }else{
           Message.error(data.retMsg);
         }
      });
  
      if(values.isTimed==1){//是  定时发布
        //定时发布设置：
 
        let  body= {
          taskName: '党建任务定时发布任务',
          operateType: 1,
          queryType: 'post',
          queryUrl: API_PREFIX+'services/partybuilding/task/update/updateTasksOnline',
          queryValue: {
            ids: [this.props.editTaskData.id]
          },
          cronDate:this.state.timePushValue,
          queryContentType: 'application/json',
          id:this.props.editTaskData.jobId,
        };
        //通过接口返回的数据  jobId 来判断是 add 还是 update

        postService(API_PREFIX + `services/automation/job/${this.props.editTaskData.jobId?'update':'add'}`, body, timeData => {
          if (timeData.retCode === 1) {
            let jobId = timeData.root.id;
            getService(API_PREFIX + `services/partybuilding/task/insert/addJobId/${this.props.editTaskData.id}/${jobId}`, bindData => {
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
    });

  }
  //  search框，点击回车后条件查询
  handleSearch=(data,url)=>{
    this.props.setTableData(API_PREFIX + `${url}/1/10?Q=userName_S_LK=${data.target.value}`);
    // this.props.setTableData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=userName_S_LK=${value}`);
  }
  //任务主题选择后
  handleSelect=(value)=>{

    //任务类型
    let typeOption =this.state.typeOption; //
    getService(API_PREFIX+`services/partybuilding/task/taskTypeList/get/1/1000?Q=topicId_I_EQ=${value}`,(data)=>{
      if(data.retCode===1){
        data.root.list&&data.root.list.map(item=>{
          typeOption.push({key: item.id, value: item.name});
        });

        this.setState({typeOption,topictSeclected:true},()=>{

        });
      }
    });
    //任务主题    根据选中的任务类型，获取对应任务类型对应的 是否线下会议记录
    getService(API_PREFIX+`services/partybuilding/task/taskTopicList/get/1/10?Q=id_I_EQ=${value}`,(data)=>{
      if(data.retCode===1){
        if(data.root.list.length>0){
           let info=data.root.list[0];

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
  //任务截止前  天 提醒
  handleInputChange=(value)=>{
    this.setState({value:value});
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
 //点击取消返回
  backHtml=()=>{
    let pushStatus=this.state.editTaskData.pushStatus
    location.hash = PartyTaskList+`?tabsVale=${pushStatus}`
    console.log(location)
  }
  render(){

    
    const {getFieldDecorator}=this.props.form;  //获取表单中的属性
    const {selectOptions,showModalKey,showModal,partyOptions,checkBoxOption,topicOption,typeOption,disabled}=this.state;
    const {
      editTaskData,//回填数据，若不为空，则是回填数据，为空时，不做任何处理
    }=this.props;
   console.log(editTaskData)
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
                      ],initialValue:editTaskData?editTaskData.taskName:''
                    })
                    (<Input  disabled={editTaskData.pushStatus==0?false:true} />)
                  }
                </FormItem>
                {/* <Row>
                  <Col span={8}> */}
                    <FormItem
                        {...formItemLayout}
                        label="发起人"
                    >{console.log(editTaskData,editTaskData.userId)}
                      {
                        getFieldDecorator('userId',{
                          rules: [
                            {
                              type:'number',
                              required:true ,
                              whitespace: true,
                              message: '发起人为必填项',
                            }
                          ], initialValue:editTaskData?editTaskData.userId:''
                        })
                        (
                            <Select style={{width:'50%',display:'inline-block'}}
                            disabled={editTaskData.pushStatus==0?false:true}
                            >
                              {
                                selectOptions&&selectOptions.map((item,index)=>
                                    <Option key={item.key} value={item.key}>
                                      {item.value}
                                    </Option>)
                              }
                            </Select>
                        )
                      }　　　
                     <Button onClick={this.handleClick} >
                      {userData.operation}
                    </Button>
                    </FormItem>
                  {/* </Col>
                  <Col span={4}> */}
                   
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
                   initialValue:editTaskData?editTaskData.upPartyId:''
                    })
                    (<Select disabled={editTaskData.pushStatus==0?false:true}
                           
                    >
                      {
                        partyOptions&&partyOptions.map((item)=>{
                          return (
                              <Option key={item.key} value={item.key}>{item.value}</Option>
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
                      ],initialValue:editTaskData&&editTaskData.taskId?editTaskData.taskId.split(','):[]
                    })
                    (
                        <CheckboxGroup
                            options={checkBoxOption.length>0?checkBoxOption:[]}
                        >

                        </CheckboxGroup>

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
                      ],initialValue:editTaskData?editTaskData.topicId:''
                    })
                    (
                        <Select
                        disabled={editTaskData.pushStatus==0?false:true}
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
                      ],initialValue:editTaskData?editTaskData.typeId:''
                    })
                    (
                        <Select disabled={editTaskData.pushStatus==0?false:true}
                           
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
                      ],initialValue:editTaskData?editTaskData.isOffline:''
                    })
                    (
                        <Select disabled={editTaskData.pushStatus==0?false:true}
                           
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
                      ],initialValue:editTaskData?editTaskData.isNeedReceipt:''
                    })
                    (
                        <Select
                            disabled={editTaskData.pushStatus!=0?true:false}
                        >
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
                      ],initialValue:moment(editTaskData&&editTaskData.endDate?editTaskData.endDate:new Date(),dateFormat)
                    })
                    (
                        <DatePicker
                            disabled={disabled}
                            showTime
                            format={dateFormat}>

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
                      ],initialValue:editTaskData?editTaskData.content:''
                    })
                    (
                        <TextArea  autosize={{ minRows: 8, maxRows: 10 }}/>
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="党建荣誉积分"
                >
                  {
                    getFieldDecorator('specialPoint', {
                      initialValue:editTaskData?editTaskData.specialPoint:3
                    })
                    (
                        <InputNumber  disabled={editTaskData.pushStatus==0?false:true}/>
                    )
                  }
                </FormItem>


               
                    <FormItem label='任务附件'
                        {...formItemLayout}
                    >
                      {
                        getFieldDecorator('articleAttach',{})
                        (
                            <ArticleAttach initialValue={editTaskData&&editTaskData.articleAttach?editTaskData.articleAttach:[]} />
                        )
                      }
                    </FormItem>
                 
                    <FormItem
                        {...formItemLayout} label='　'
                    >
                      {
                        getFieldDecorator('activityAttach',{})
                        (
                            <ActivityAttach initialValue={editTaskData&&editTaskData.activityAttach?editTaskData.activityAttach:[]}  />
                        )
                      }
                    </FormItem>
                
                    <FormItem
                        {...formItemLayout} label='　'
                    >
                      {
                        getFieldDecorator('fileAttach',{})
                        (
                            <FileAttach initialValue={editTaskData&&editTaskData.fileAttach?editTaskData.fileAttach:[]}  />

                        )
                      }
                    </FormItem>
                 
                <FormItem
                    {...formItemLayout}
                    label="提醒"
                >截止前　
                  {
                    getFieldDecorator('remindDate', {
                      initialValue:editTaskData?editTaskData.remindDate:''
                    })
                    (
                        
                          <InputNumber  disabled={editTaskData.pushStatus==0?false:true}
                                            onChange={this.handleInputChange}
                                            // value={this.state.value}
                                            />
                       
                    )
                  } 　天
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
                      initialValue:editTaskData?editTaskData.isTimed:0
                    })
                    (
                        <RadioGroup  disabled={editTaskData.pushStatus==0?false:true} onChange={this.onRadioChange}>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </RadioGroup>
                    )}<span onClick={()=>this.setState({timePushModal:true,timePushKey:this.state.timePushKey+1})}>{this.state.timePushValue}</span>
                </FormItem>
                <Row>
                  <Col span={2}  offset={6}><Button  className="resetBtn" onClick={this.backHtml}>{disabled?'返回':'取消'}</Button></Col>
                  <Col span={6} ><Button className="queryBtn" onClick={this.handleSubmit} style={{display:disabled?'none':'inline-block'}} >保存</Button></Col>
                </Row>
              </Form>
          <Modal
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