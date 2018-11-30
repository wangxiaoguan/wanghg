import React, { Component } from 'react';
import { Tabs ,Divider,Popconfirm} from 'antd';
import API_PREFIX from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import EditBase from './EditBase';
import EditRecevicer  from './EditRecevicer';
const TabPane = Tabs.TabPane;
export default class Add extends  Component {
constructor(props){
  super(props);
  this.state={
    id:GetQueryString(location.hash,['id','detail']).id,//编辑时的id
    disabled:GetQueryString(location.hash,['id','detail']).detail?GetQueryString(location.hash,['id','detail']).detail:false,//编辑时的id
    currentTabsKey:0,//当前标签
    editTaskData:{},//编辑时的数据
    checkBoxOption:[]
  }
}
  handleChangeTabs=(activeKey)=>{
    this.setState({currentTabsKey:activeKey});
  }
 
  componentWillMount(){
    //页面相关的数据处理
    this.dealData();

  }
  dealData=()=>{
    //根据传入的id，获取党建任务的详情信息
    getService(API_PREFIX+`services/partybuilding/task/get/getTaskById/${this.state.id}`,data=>{
      if(data.retCode===1){
        if(data.root.object){

          let editTaskData=data.root.object;
          if(editTaskData.upTaskInfo.length>0){
            let checkBoxOption=this.state.checkBoxOption
           editTaskData.upTaskInfo.forEach(item=>{
              let upTask=item.split('-');
              checkBoxOption.push({label:upTask[1] , value:upTask[0]})
                  
            })

            this.setState({checkBoxOption});
          }
         
             this.setState({editTaskData});
        }
       
       
      }
    });
  }
 render(){
   const tabs = [{
     tab:"填写任务信息" ,
     key:"0",
     content: <EditBase
         editTaskData={this.state.editTaskData}
         checkBoxOption={this.state.checkBoxOption}
         disabled={this.state.disabled}

     />,
   }, {
     tab:"设置接收人" ,
     key:"1",
     content: <EditRecevicer
         editTaskData={this.state.editTaskData}
         disabled={this.state.disabled}
     />,
   }];
  return (
      <Tabs onChange={this.handleChangeTabs} >
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