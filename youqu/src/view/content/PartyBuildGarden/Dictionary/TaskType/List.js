import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import ServiceApi from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {TaskTypeAdd,TaskTypeEdit
} from '../URL';
export default class List extends  Component {
  constructor(props){
    super(props);
    this.state={
      topicOption:[],//任务主题option
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
          topicOption.push({key:'', value:'全部'});
          data.root.list&&data.root.list.map((item)=>{
            topicOption.push({key:item.id, value:item.name});
          });
      this.setState({
        topicOption
      });
        }else{
          console.log('任务主题接口报错',data.retMsg);
        }
    });
  }
  render(){
    const columns=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '任务类型名称',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '任务主题',
        key: 'topicName',
        dataIndex: 'topicName',
      },
      {
        title: '显示顺序',
        key: 'showIndex',
        dataIndex: 'showIndex',
      },
      {
        title: '是否可用',
        key: 'isEnabledDesp',
        dataIndex: 'isEnabledDesp',
      },
      {
        title: '创建时间',
        key: 'createDate',
        dataIndex: 'createDate',
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render:(data,record)=>{
          return (<a onClick={()=>location.hash = TaskTypeEdit+`?id=${record.id}`}>编辑</a>)
        }
      },
    ];
    const enabledOption=[
      {key:'', value:'全部'},
      {key:true, value:'是'},
      {key:false, value:'否'},

    ];
    const search=[
      { key: 'name', label: '任务类型名称',qFilter:'Q=name_LK',type:'input'},
      { key: 'topicId', label: '任务主题',qFilter:'Q=topicId_I_EQ',type:'select',option:this.state.topicOption},
      { key: 'enabled', label: '是否可用',qFilter:'Q=enabled_Z_EQ',type:'select',option:enabledOption},
    ];
    return (<TableAndSearch
        columns={columns}
        search={search}
        url='services/partybuilding/tasktype/taskTypeList/get'
        addBtn={{order:1,url:TaskTypeAdd}}
        deleteBtn={{order:2,url:'services/partybuilding/tasktype/delete/deleteTaskType',field:'ids'}}
    >
    </TableAndSearch>)
  }
}