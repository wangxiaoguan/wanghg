import React, { Component } from 'react';
import { Form, message,Steps , Input, Button,Row,Col,Select,Modal ,Checkbox,DatePicker,InputNumber ,Radio} from 'antd';
import {PartyTaskList, //党建任务列表
} from '../../URL';
import API_PREFIX from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {connect} from 'react-redux';
import moment from 'moment';
import { BEGIN, getPageData  } from '../../../../../redux-root/action/table/table';// yelu 2019-01-16 取出缓存里面设置分页数据函数getPageData
import TableSearch from '../../../../component/table/TableSearch';
import FormAndInput from '../../../../component/table/FormAndInput';
// import RichText from '../../../../component/richTexteditor/editor';
import RichText from '../../../../component/richTexteditor/braftEditor';
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
      getFormData: state.attach.getFormData,
    }),
    dispatch => ({
      setTableData: n =>dispatch(BEGIN(n)),
      setTopicId:n=>dispatch(setTopicId(n)),
      setPartyId:n=>dispatch(setPartyId(n)),
      setFormData:n=>dispatch(setFormData(n)),
      getPageData:n=>dispatch(getPageData(n)), // yelu 2019-01-02 每次查询时初始缓冲里面的页码为默认值
    })
)
@Form.create()
export default class EditBase extends  Component {
  constructor(props){
    super(props);
    let activeKey = GetQueryString(location.hash, ['activeKey']).activeKey || '0';
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
      restart:true,
      topicName: this.props.editTaskData && this.props.editTaskData.topicName ? this.props.editTaskData.topicName : '',
      typeName: this.props.editTaskData && this.props.editTaskData.typeName ? this.props.editTaskData.typeName : '',
      qfilter: '', // yelu 2019-01-16 添加作者查询条件字段
      activeKey:String(activeKey),

    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.editTaskData !== this.state.editTaskData){
      this.setState({editTaskData: nextProps.editTaskData}, () => this.dealData())
    }
  }
  componentWillMount(){
      // this.dealData()
  }
  dealData=()=> {
    //回传数据时，根据选中的任务主题id，调用任务类型接口 topicId
    console.log(flowData)
    let flowData = this.props.editTaskData
    if (flowData && Object.keys(flowData).length != 0) {
      if (flowData.timedDate && flowData.isTimed) {
        this.setState({ timePushValue: flowData.timedDate });
      }
      if (flowData.topicId) {//不为空
        //根据选中的任务主题id，调用任务类型接口 topicId
        getService(API_PREFIX + `services/web/party/taskType/getList/1/1000?Q=topicId=${flowData.topicId}`, (res) => {
          if (res.status === 1) {
            let typeOption = []
            res.root.list && res.root.list.map(item => {
              typeOption.push({ key: item.id, value: item.typeName });
            });

            this.setState({ typeOption });
          }
        });
      }

      if (flowData.partyId) {
        let level=1;
        if(flowData.partyName && flowData.partyName.indexOf('支部')!=-1){
          level=2
        }
        //获取任务主题下拉框数据
        getService(API_PREFIX + `services/web/party/taskTopic/getListByUserLevel/${flowData.partyLevel ? flowData.partyLevel : level}`, (data) => {
          if (data.status === 1) {
            let topicOption = [];
            data.root.object && data.root.object.map(item => {
              topicOption.push({ key: item.id, value: item.topicName });
            });
            this.setState({ topicOption });
          }
        });
        //关联上级工作部署
        getService(API_PREFIX + `services/web/party/task/getUntiedTaskList/${flowData.partyId}?taskId=${flowData.id}`, data => {
          if (data.status === 1) {
            //通过接口获取多选框中的数据
            let checkBoxOption = [];
            data.root.object && data.root.object.map(item => {
              checkBoxOption.push({ label: item.taskName, value: item.id });
            });
            this.props.form.setFieldsValue({
              taskId: flowData.taskId ? flowData.taskId.split(',') : []
            })
            this.setState({ checkBoxOption, taskId: flowData.taskId });
          }
        });

        this.setState({
          selectOptions: [{ key: flowData.userId, value: flowData.userName, }],
          partyOptions: [{ key: flowData.partyId, value: flowData.partyName, }],
          level: flowData.partyLevel,
          typeName: flowData.typeName ? flowData.typeName : '',
          topicName: flowData.topicName ? flowData.topicName : '',
        });
      }
    }
  }
  //按钮点击事件  弹出modal
  handleClick=()=>{
    localStorage.setItem("selectedRowKeys", '');
    this.setState({
      showModal:true,
      showModalKey:this.state.showModalKey+1
    });
  }
  //modal确定     1、将选中数据设置给select  2、关闭弹窗
  handleOk=()=>{
    this.setState({
      showModal:false,restart:false
    });
    this.props.form.setFieldsValue({topicId:''}); //为userId设置值
    this.props.form.setFieldsValue({typeId:''}); //为userId设置值
    this.props.form.setFieldsValue({isOffline:''}); //为userId设置值
    this.props.form.setFieldsValue({isNeedReceipt:''}); //为userId设置值
    let selectedData=this.props.selectRowsData; //获取勾选的值
    console.log(selectedData)
    
    this.props.setPartyId(selectedData[0].partyId)
    this.props.setFormData({
      ...this.props.getFormData,
      partyId: selectedData[0].partyId,
      partyName: selectedData[0].fullName,
      partyLevel: selectedData[0].partyLevel,
      userId: selectedData[0].userId,
      userName: selectedData[0].userName,
    })
    if(selectedData[0]){
      if((selectedData[0].fullName).indexOf("党小组")!=-1){//存在党小组(将党组织中含有党小组的将党小组截取掉)xwx2019/2/26
        let partyNameSplit=selectedData[0].fullName.split(">")
            partyNameSplit.splice(-1,1)
        let combinationString=partyNameSplit.join('>')
            selectedData[0].fullName=combinationString
      }
    }
  
    getService(API_PREFIX+`services/web/party/taskTopic/getListByUserLevel/${selectedData[0].partyLevel}`,(data)=>{
      if(data.status===1){
        let topicOption = [];
        data.root.object&&data.root.object.map(item=>{
          topicOption.push({key: item.id, value: item.topicName});
        });
        this.setState({topicOption,level:selectedData[0].partyLevel});
      }
    });
    getService(API_PREFIX+`services/web/party/task/getUntiedTaskList/${selectedData[0].partyId}??taskId=${this.state.editTaskData.id}`,(data)=>{
      
      sessionStorage.setItem('partyId',selectedData[0].partyId)
      if(data.status===1){
        //通过接口获取多选框中的数据
        let checkBoxOption=this.state.checkBoxOption;
        checkBoxOption=[];
        let dataList=data.root.object&&data.root.object
        dataList.map(item=>{
          checkBoxOption.push({label:item.taskName, value: item.id});
        });
        this.setState({checkBoxOption,});
      }
    });
    this.setState({selectOptions:[{key:selectedData[0].userId,value:selectedData[0].userName,}],
      partyOptions:[{key:selectedData[0].partyId,value:selectedData[0].fullName,}],
      userSelectd:true,
    },()=>{
      this.props.form.setFieldsValue({userId:selectedData[0].userId}); //为userId设置值
      this.props.form.setFieldsValue({partyId:selectedData[0].partyId}); //为userId设置值
    });
  }
  //modal 取消
  handleCancel=()=>{
    this.setState({
      showModal:false,
      qfilter: '',
    });
  }
  handleSubmit=(e,back)=>{   //如果next不为空，则为“保存并下一步”
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) {
        return;
      }
      if(this.state.checkBoxOption.length===0){
        fieldsValue['taskId'].length = 0;
      }
      let nowDate = moment(new Date())
      let endData = moment(fieldsValue['endDate'])
      let diffDate = endData - nowDate;
      if(diffDate < 0&&GetQueryString(location.hash, ['activeKey']).activeKey!=1){
        message.error('任务截止时间必须大于当前时间！')
        return
      }
      let taskAttachList = this.props.handleFile() //处理任务附件信息
      let values={
        ...this.props.getFormData,
        ...fieldsValue,
        'id':this.props.editTaskData.id,
        'taskAttachList': taskAttachList,
        'endDate':fieldsValue['endDate'].format(dateFormat),
        'taskId':fieldsValue['taskId'].toString(),
        'partyName':this.state.partyOptions[0].value,
        'userName':this.state.selectOptions[0].value,
        'isOffline': fieldsValue['isOffline'] == 1 ? true : false,
        'isNeedReceipt':fieldsValue['isNeedReceipt'] == 1 ? true : false,
        'isTimed':fieldsValue['isTimed'] == 1 ? true : false,
        'pushStatus': this.state.activeKey,
        'topicName': this.state.topicName,
        'typeName': this.state.typeName,
        'partyLevel': this.state.level,
      }
      // if(values.isTimed){//是  定时发布
      //   //定时发布设置：
      //   let timePushValue=this.state.timePushValue
      //   let nowTime = moment(new Date())
      //   let endTime = moment(timePushValue)
      //   let diffTime = endTime - nowTime;
      //   if(diffTime < 0&&GetQueryString(location.hash,['activeKey']).activeKey!=1){
      //     message.error('定时发布时间必须大于当前时间！')
      //     return
      //   }
      //   let  body= {
      //     taskName: '党建任务定时发布任务',
      //     operateType: 1,
      //     queryType: 'post',
      //     queryUrl: API_PREFIX+'services/partybuilding/task/update/updateTasksOnline',
      //     queryValue: {
      //       ids: [this.props.editTaskData.id]
      //     },
      //     cronDate:this.state.timePushValue,
      //     queryContentType: 'application/json',
      //     id:this.props.editTaskData.jobId,
      //   };
      //   //通过接口返回的数据  jobId 来判断是 add 还是 update
      //   if(GetQueryString(location.hash, ['activeKey']).activeKey!=1){//判断是否是已上线，是，就取消创建定时任务xwx2019/4/1
      //     postService(API_PREFIX + `services/automation/job/${this.props.editTaskData.jobId?'update':'add'}`, body, timeData => {
      //       if (timeData.retCode === 1) {
      //         let jobId = timeData.root.id;
      //         getService(API_PREFIX + `services/partybuilding/task/insert/addJobId/${this.props.editTaskData.id}/${jobId}`, bindData => {
      //               if (bindData.retCode !== 1) {
      //                 message.error(bindData.retMsg);
      //               }
      //             }
      //         );
      //       }else{
      //         message.error(timeData.retMsg);
      //       }
      //     });
      //   }
      // }
      if (values.isTimed) {
        values.timedDate = this.state.timePushValue
      }
      if (this.props.getFormData.id) {
        values.id = this.props.getFormData.id
      }
      this.props.setFormData(values)
      this.props.next();//跳到下一步
    });

  }
  //  search框，点击回车后条件查询
  handleSearch=(e)=>{
    let qfilter = e.target.value == '' ? '' : `Q=userName=${e.target.value}` // yelu 2019-01-16 修改选择人员查询后分页后不带查询条件
    this.setState({qfilter,})
    // yelu 2019-01-16 每次查询的时候要重置页码为1
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter}); // 每次查询时初始缓冲里面的页码为默认值
    this.props.setTableData(API_PREFIX + `services/web/party/partyUser/getAllPostUserByTenantId/1/10?${qfilter}`);
    // this.props.setTableData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=userName_S_LK=${value}`);
  }
  //任务主题选择后
  handleSelect=(value)=>{
    //任务类型
    this.props.setTopicId(value)
    this.setState({restart:false})
    this.props.setFormData({
      ...this.props.getFormData,
      topicId:value,
    })
    this.props.form.setFieldsValue({typeId:''});
    getService(API_PREFIX+`services/web/party/taskType/getList/1/1000?Q=topicId=${value}`,(data)=>{
      if(data.status===1){
        let typeOption = [];
        data.root.list&&data.root.list.map(item=>{
          typeOption.push({key: item.id, value: item.typeName});
        });
    
        this.setState({typeOption,topictSeclected:true,},()=>{

        });
      }
    });
    //任务主题    根据选中的任务类型，获取对应任务类型对应的 是否线下会议记录
    getService(API_PREFIX+`services/web/party/taskTopic/getList/1/10?Q=id=${value}`,(data)=>{
      if(data.status===1){
        if(data.root.list.length>0){
           let info=data.root.list[0];
           console.log(info)
           
          //  let isTopic=topicName=='重要工作部署'||topicName=='党课'||topicName=='支部党员大会'||topicName=='党支部委员会'||topicName=='党小组会'
           if(info.topicName=='重要工作部署'){
            this.props.form.setFieldsValue({isOffline:2}); 
            this.props.form.setFieldsValue({isNeedReceipt:0}); 
            this.props.form.setFieldsValue({specialPoint:0});
            this.props.setFormData({
              ...this.props.getFormData,
              isOffline:false,
              isNeedReceipt:false,
              specialPoint: 0,
              topicName:info.topicName,
            })
           }else{
            this.props.form.setFieldsValue({isOffline: info.isOffline == 1 ? 1 : 2}); 
            this.props.form.setFieldsValue({isNeedReceipt:1});
            this.props.form.setFieldsValue({specialPoint:5});
            this.props.setFormData({
              ...this.props.getFormData,
              isOffline: info.isOffline == 1 ? true : false,
              isNeedReceipt:true,
              specialPoint: 5,
              topicName:info.topicName,
            })
           }
           this.setState({topicName:info.topicName})
          //  if(info.isOffline==0){ //对应是否需要线下会议纪要  不固定
          //     //不做任何处理
          //    this.setState({isOfflineDisabled:false});
          //  }else{
          //    //禁用，并设置值
          //    this.setState({isOfflineDisabled:true});
          //    this.props.form.setFieldsValue({isOffline:info.isOffline}); //为userId设置值
          //  }
        }


      }
    });

  }
  //任务类型选中后
  handleType=(value)=>{
    console.log(value)
    this.props.form.setFieldsValue({typeId:value});
    this.state.typeOption.map((item)=>{
      if(item.key==value){
        this.setState({typeName:item.value})
        this.props.setFormData({
          ...this.props.getFormData,
          typeId:value,
          typeName: item.value,
        })
      }
    })
  }
  //任务截止前  天 提醒
  handleInputChange=(value)=>{
    this.setState({value:value});
    this.props.setFormData({
      ...this.props.getFormData,
      remindDate: value,
    })
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
    this.props.setFormData({
      ...this.props.getFormData,
      isTimed: e.target.value == 1 ? true : false,
    })
  }
  //定时发布弹窗  取消
  cancleTimePush=()=>{
    this.setState({ timePushModal: false });
    this.props.form.setFieldsValue({isTimed:0});
    this.props.setFormData({
      ...this.props.getFormData,
      isTimed: false,
    })
  }
  //定时发布弹窗  确定
  okTimePush=()=>{

    this.setState({ timePushModal: false ,timePushValue:this.state.selectedDate});
    this.props.setFormData({
      ...this.props.getFormData,
      timedDate: this.state.selectedDate,
    })
  }
  //禁选的时间
  disabledDate=(current)=> {
    return moment(new Date()).subtract(1,'d').isAfter(current);
  }
 //点击取消返回
  backHtml=()=>{
    let pushStatus=this.state.editTaskData.pushStatus
    location.hash = PartyTaskList+`?id=${this.state.activeKey}`
    console.log(location)
  }
  receiptSelect=(value)=>{
    if(value){
      this.props.form.setFieldsValue({specialPoint:5});
    }else{
      this.props.form.setFieldsValue({specialPoint:3});
    }
    this.props.setFormData({
      ...this.props.getFormData,
      isNeedReceipt: value == 1 ? true : false,
      specialPoint: value == 1 ? 5 : 3,
    })
    
  }
   removeRepeat=(arr, key)=>{
    for(let i = 0; i < arr.length; i++) {
      for(let j = i+1; j < arr.length; j++) {
        if(arr[i][key] === arr[j][key]){
          arr.splice(j, 1);
          j = j-1;  
        }
      }
    }
  }
  render(){

    
    const {getFieldDecorator}=this.props.form;  //获取表单中的属性
    const {selectOptions,showModalKey,showModal,partyOptions,checkBoxOption,topicOption,typeOption,disabled,restart,topicName}=this.state;
    console.log("获取值",typeOption&&this.removeRepeat(typeOption,"key"))
    const {
      editTaskData,//回填数据，若不为空，则是回填数据，为空时，不做任何处理
    }=this.props;
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
            dataIndex:'fullName',
            key:'fullName',
          },
          {
            title:'职务',
            dataIndex:'postName',
            key:'postName',
          },
        ],
        url:'services/web/party/partyUser/getAllPostUserByTenantId',
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
                          type:'string',
                          required:true ,
                          whitespace: true,
                          message: '任务名称为必填项且最大长度不能超过16',
                          max:16,
                        },
                      ],initialValue:editTaskData?editTaskData.taskName:''
                    })
                    (<Input  disabled={disabled?true:editTaskData.pushStatus==0?false:true} onChange={(e) => {
                      console.log('taskName哈哈哈哈哈哈哈哈傻瓜威风威风毫无好感i为韩国i', e)
                      this.props.setFormData({
                        ...this.props.getFormData,
                        taskName:e.target.value,
                      })
                    }} />)
                  }
                </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="发起人"
                    >
                      {
                        getFieldDecorator('userId',{
                          rules: [
                            {
                              type:'string',
                              required:true ,
                              whitespace: true,
                              message: '发起人为必填项',
                            }
                          ], initialValue:editTaskData?editTaskData.userId:''
                        })
                        (
                            <Select style={{width:'50%',display:'inline-block'}}
                            disabled={disabled?true:editTaskData.pushStatus==0?false:true}
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
                     <Button onClick={this.handleClick} disabled={disabled?true:editTaskData.pushStatus==0?false:true}>
                      {userData.operation}
                    </Button>
                    </FormItem>
                  
                <FormItem
                    {...formItemLayout}
                    label="发起人党组织"
                >
                  {
                    getFieldDecorator('partyId',{
                      rules: [
                        {
                          type:'string',
                          required:true ,
                          whitespace: true,
                          message: '发起人党组织为必填项',
                        }
                      ],
                   initialValue:editTaskData?editTaskData.partyId:''
                    })
                    (<Select disabled={disabled?true:editTaskData.pushStatus==0?false:true}
                           
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
                        <CheckboxGroup disabled={disabled?true:false}
                            options={checkBoxOption.length>0?checkBoxOption:[]}
                            onChange={(value) => {
                              console.log('taskId哈哈哈哈哈哈哈哈傻瓜威风威风毫无好感i为韩国i', value)
                              this.props.setFormData({
                                ...this.props.getFormData,
                                taskId: value.length ? value.join(',') : '',
                              })
                            }}
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
                          type:'string',
                          required:true ,
                          whitespace: true,
                          message: '任务主题为必填项',
                        }
                      ],initialValue:editTaskData?editTaskData.topicId:''
                    })
                    (
                        <Select
                        disabled={disabled?true:editTaskData.pushStatus==0?false:true}
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
                          type:'string',
                          required:true ,
                          whitespace: true,
                          message: '任务类型为必填项',
                        }
                      ],initialValue:editTaskData?editTaskData.typeId:''
                    })
                    (
                        <Select disabled={disabled?true:editTaskData.pushStatus==0?false:true}
                        onSelect={(value)=>this.handleType(value)}
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
                      ],initialValue:editTaskData&&editTaskData.isOffline ? 1 : 2
                    })
                    (
                        <Select disabled={disabled?true:editTaskData.pushStatus!=0?true:topicName=='重要工作部署'||restart&&editTaskData.topicName=='重要工作部署'?true:false}
                          onSelect={(value) => {
                            console.log('isOffline哈哈哈哈哈哈哈哈傻瓜威风威风毫无好感i为韩国i', value)
                            this.props.setFormData({
                              ...this.props.getFormData,
                              isOffline: value == 1 ? true : false,
                            })
                          }}
                        >
                          <Option key="1" value={1}>是</Option>
                          <Option key="2" value={2}>否</Option>
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
                      ],initialValue:editTaskData&&editTaskData.isNeedReceipt ? 1 : 0
                    })
                    (
                        <Select   onSelect={this.receiptSelect}
                            disabled={disabled?true:editTaskData.pushStatus!=0?true:topicName=='重要工作部署'||restart&&editTaskData.topicName=='重要工作部署'?true:false}
                            
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
                            format={dateFormat}
                            onChange={(value) => {
                              console.log('endDate哈哈哈哈哈哈哈哈傻瓜威风威风毫无好感i为韩国i', value)
                              this.props.setFormData({
                                ...this.props.getFormData,
                                endDate: moment(value).format(dateFormat),
                              })
                            }}
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
                      ],initialValue:editTaskData?editTaskData.content:''
                    })
                    (
                        <TextArea disabled={disabled?true:false} autosize={{ minRows: 8, maxRows: 10 }}
                        onChange={(e) => {
                          console.log('content哈哈哈哈哈哈哈哈傻瓜威风威风毫无好感i为韩国i', e)
                          this.props.setFormData({
                            ...this.props.getFormData,
                            content: e.target.value,
                          })
                        }}
                        />
                    )
                  }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="奖励党员荣誉积分"
                >
                  {
                    getFieldDecorator('specialPoint', {
                      rules:[
                        {
                          type:'number',
                          required:true ,
                          whitespace: true,
                          message: '奖励党员荣誉积分为必填项',
                        }
                      ],initialValue:restart&&editTaskData?editTaskData.specialPoint:topicName=='重要工作部署'?0:5
                    })
                    (
                        <InputNumber  style={{width:'20%'}} disabled={disabled?true:editTaskData.pushStatus==0?restart&&editTaskData.topicName=='重要工作部署'||topicName=='重要工作部署'?true:false:true}
                        onChange={(value) => {
                          this.props.setFormData({
                            ...this.props.getFormData,
                            specialPoint: value,
                          })
                        }}
                        />
                    )
                  }
                </FormItem>
                    <FormItem label='任务附件'
                        {...formItemLayout}
                    >
                      {
                        getFieldDecorator('articleAttach',{})
                        (
                            <ArticleAttach disabled={disabled?true:false} initialValue={editTaskData&&editTaskData.taskAttachList?editTaskData.taskAttachList:[]} />
                        )
                      }
                    </FormItem>
                 
                    <FormItem colon={false}
                        {...formItemLayout} label='　'
                    >
                      {
                        getFieldDecorator('activityAttach',{})
                        (
                            <ActivityAttach disabled={disabled?true:false} initialValue={editTaskData&&editTaskData.taskAttachList?editTaskData.taskAttachList:[]}  />
                        )
                      }
                    </FormItem>
                
                    <FormItem colon={false}
                        {...formItemLayout} label='　'
                    >
                      {
                        getFieldDecorator('fileAttach',{})
                        (
                            <FileAttach  disabled={disabled?true:false} initialValue={editTaskData&&editTaskData.taskAttachList?editTaskData.taskAttachList:[]}  />

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
                        
                          <InputNumber style={{width:'10%'}}  disabled={disabled?true:editTaskData.pushStatus==0?false:true}
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
                      initialValue:editTaskData&&editTaskData.isTimed?1:0
                    })
                    (
                        <RadioGroup  disabled={disabled?true:editTaskData.pushStatus==0?false:true} onChange={this.onRadioChange}>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </RadioGroup>
                    )}<span onClick={()=>this.setState({timePushModal:true,timePushKey:this.state.timePushKey+1})}>{this.state.timePushValue}</span>
                </FormItem>
                <Row style={{margin:'0 auto 40px',textAlign:'center'}}>
                    <Button  className="resetBtn" onClick={this.backHtml}>{disabled?'返回':'取消'}</Button>
                    <Button className="queryBtn" onClick={e=>this.handleSubmit(e)} style={{display:disabled?'none':'inline-block'}} >下一步</Button>
                    {/* <Button className="queryBtn" onClick={e=>this.handleSubmit(e)} style={{display:disabled?'none':'inline-block'}} >保存</Button>
                    <Button className="queryBtn" onClick={e=>this.handleSubmit(e,'back')} style={{display:disabled?'none':'inline-block'}} >保存并返回</Button> */}
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
            {/* <TableSearch
                columns={userData.tableData.columns}
                url={userData.tableData.url}
                onSearch={(value)=>this.handleSearch(value,userData.tableData.url)}
            /> */}
            <FormAndInput
            columns={userData.tableData.columns}
            url={userData.tableData.url}
            onSearch={this.handleSearch}
            type="PartyTaskAddBase"
            qfilter={this.state.qfilter} // yelu 2019-01-16 传递过去查询条件，修改分页后不带查询条件的问题
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