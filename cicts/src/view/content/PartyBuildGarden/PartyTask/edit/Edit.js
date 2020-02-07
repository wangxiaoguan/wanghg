import React, { Component } from 'react';
import { Tabs ,Divider,Popconfirm} from 'antd';
import API_PREFIX from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import EditBase from './EditBase';
import EditRecevicer  from './EditRecevicer';
const TabPane = Tabs.TabPane;
import { setFormData, setTopicId, setPartyId, setRecevicer, setArticleData, setArticleAdd, setActivityData, setActivityAdd, setFileAdd, setFileData } from '../../../../../redux-root/action/attach/attach';

import { connect } from 'react-redux';
@connect(
  state => ({
    getFormData: state.attach.getFormData,
    getRecevicer: state.attach.getRecevicer,
    getTopicId:state.attach.getTopicId,
    getPartyId:state.attach.getPartyId,
    getArticleData: state.attach.articleData,//获取添加文章的数据
    getActivityData: state.attach.activityData,//获取添加活动的数据
    getFileData: state.attach.fileData,//获取添加文件的数据
  }),
  dispatch => ({
    setTopicId: n => dispatch(setTopicId(n)),
    setPartyId: n => dispatch(setPartyId(n)),
    setFormData: n => dispatch(setFormData(n)),
    setRecevicer: n => dispatch(setRecevicer(n)),
    setArticleData: n => dispatch(setArticleData(n)),
    setArticleAdd: n => dispatch(setArticleAdd(n)),
    setActivityData: n => dispatch(setActivityData(n)),
    setActivityAdd: n => dispatch(setActivityAdd(n)),
    setFileData: n => dispatch(setFileData(n)),
    setFileAdd: n => dispatch(setFileAdd(n)),
  })
)
export default class Add extends  Component {
constructor(props){
  super(props);
  this.state={
    id:GetQueryString(location.hash,['id','detail']).id,//编辑时的id
    disabled:GetQueryString(location.hash,['id','detail']).detail?GetQueryString(location.hash,['id','detail']).detail:false,//编辑时的id
    currentTabsKey: '0',//当前标签
    editTaskData:{},//编辑时的数据
    checkBoxOption:[]
  }
}
  handleChangeTabs=(activeKey)=>{
    this.setState({currentTabsKey:activeKey});
    let taskAttachList = this.handleFile()
    this.props.setFormData({
      ...this.props.getFormData,
      taskAttachList, 
    })
    if(activeKey==1){//编辑后切换到设置接收人时如果partyId或者topicId改变了重新请求树数据
      let oldPartyId = sessionStorage.getItem('partyId')
      let oldTopicId = sessionStorage.getItem('topicId')
      let partyIdFlag  = this.props.getPartyId != oldPartyId
      let topicIdFlag  = this.props.getTopicId != oldTopicId
      if(partyIdFlag || topicIdFlag){
        sessionStorage.setItem('partyId', this.props.getPartyId)
        sessionStorage.setItem('topicId', this.props.getTopicId)
        this.child && this.child.dealData()
      }
    }
  }
 
  componentWillMount(){
    //页面相关的数据处理
    this.dealData();

  }
  handleFile = () => {
    let taskAttachList = []
      if(this.props.getArticleData && JSON.stringify(this.props.getArticleData) != "{}") {
        this.props.getArticleData.forEach(item => {
          taskAttachList.push({
            "attachType": 1,
            "attachUrl": item.id,
            "fileName": item.name,
            "content": item.content,
          })
        })
      }
      if(this.props.getActivityData && JSON.stringify(this.props.getActivityData) != "{}") {
        this.props.getActivityData.forEach(item => {
          taskAttachList.push({
            "attachType": 2,
            "attachUrl": item.id,
            "fileName": item.name,
            "content": item.content,
          })
        })
      }
      if(this.props.getFileData && JSON.stringify(this.props.getFileData) != "{}") {
        this.props.getFileData.forEach(item => {
          let size = Number(item.size).toFixed(2)
          let fileSize = ''
          if(size < 1024) {
            fileSize = `${size} KB`
          }else {
            fileSize = `${(size/1024).toFixed(2)} MB`
          }
          taskAttachList.push({
            "attachType": item.type,
            "attachUrl": item.url,
            "fileName": item.name,
            "fileSize": fileSize,
            "content": item.type == 5 ? JSON.stringify({length: fileSize, name: item.name}) : JSON.stringify({ w: 300, h: 300, width: 300, height: 300 })
          })
        })
      }
      return taskAttachList
  }
  next = () => {
    this.setState({ currentTabsKey: '1' });
    // this.child&&this.child.dealData()
    let oldPartyId = sessionStorage.getItem('partyId')
    let oldTopicId = sessionStorage.getItem('topicId')
    let partyIdFlag  = this.props.getPartyId != oldPartyId
    let topicIdFlag  = this.props.getTopicId != oldTopicId
    if(partyIdFlag || topicIdFlag){
      sessionStorage.setItem('partyId', this.props.getPartyId)
      sessionStorage.setItem('topicId', this.props.getTopicId)
      this.child && this.child.dealData()
    }
  }

  prev = () => {
    this.setState({ currentTabsKey: '0' });
  }
  componentWillUnmount(){
    this.props.setFormData({});
    this.props.setPartyId('');
    this.props.setTopicId('');
    this.props.setRecevicer('');
    this.props.setArticleData('');
    this.props.setArticleAdd('');
    this.props.setActivityData('');
    this.props.setActivityAdd('');
    this.props.setFileData('');
    this.props.setFileAdd('');
  }
  dealData=()=>{
    //根据传入的id，获取党建任务的详情信息
    getService(API_PREFIX+`services/web/party/task/getById/${this.state.id}`,data=>{
      if(data.status===1){
        if(data.root.object){
         
          let editTaskData=data.root.object;
          sessionStorage.setItem('partyId', editTaskData.partyId)
          sessionStorage.setItem('topicId', editTaskData.topicId)
          this.props.setPartyId(editTaskData.partyId)
          this.props.setTopicId(editTaskData.topicId)
          // this.props.setFormData(editTaskData)
          this.props.setFormData({
            taskName: editTaskData.taskName,
            taskId: editTaskData.taskId,
            partyId: editTaskData.partyId,
            partyName: editTaskData.partyName,
            topicId: editTaskData.topicId,
            topicName: editTaskData.topicName,
            typeId: editTaskData.typeId,
            typeName: editTaskData.typeName,
            isOffline: editTaskData.isOffline,
            isNeedReceipt: editTaskData.isNeedReceipt,
            endDate: editTaskData.endDate,
            content: editTaskData.content,
            specialPoint: editTaskData.specialPoint,
            remindDate: editTaskData.remindDate,
            isTimed: editTaskData.isTimed,
            timedDate: editTaskData.timedDate,
            pushStatus: editTaskData.pushStatus,
            id: editTaskData.id,
            taskAttachList: editTaskData.taskAttachList,
            recevicerJson: editTaskData.recevicerJson,
            userId: editTaskData.userId,
            userName: editTaskData.userName,
          })
         
          this.setState({editTaskData});
        }
       
       
      }
    });
  }
  onRef = (ref) => {
    this.child = ref
  }
  // onEditBase = (ref) => {
  //   this.baseChild = ref
  // }
 render(){
   const tabs = [{
     tab:"填写任务信息" ,
     key:"0",
     content: <EditBase
         editTaskData={this.state.editTaskData}
        //  editTaskData={this.props.getFormData}
         checkBoxOption={this.state.checkBoxOption}
         disabled={this.state.disabled}
         next={this.next}
         handleFile={this.handleFile}
     />,
   }, {
     tab:"设置接收人" ,
     key:"1",
     content: <EditRecevicer
         editTaskData={this.state.editTaskData}
        //  editTaskData={this.props.getFormData}
         time={new Date()}
         disabled={this.state.disabled}
         prev={this.prev}
         onRef={this.onRef}
     />,
   }];
  return (
      <Tabs onChange={this.handleChangeTabs} activeKey={this.state.currentTabsKey} >
        {
          tabs.map((item)=>{
            return (
                <TabPane  tab={item.tab} key={item.key} >
                  {
                    item.content
                  }
                </TabPane>
            )
          })
        }

     </Tabs>
  );
 }
}