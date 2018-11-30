import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import API_PREFIX from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {TaskTopicAdd,TaskTopicEdit
} from '../URL';
export default class List extends  Component {
  constructor(props){
    super(props);
  }
  render(){
    const columns=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '任务主题名称',
        key: 'name',
        dataIndex: 'name',
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
          return (<a onClick={()=>location.hash = TaskTopicEdit+`?id=${record.id}`}>编辑</a>)
        }
      },
    ];
    const enabledOption=[
      {key:'', value:'全部'},
      {key:true, value:'是'},
      {key:false, value:'否'},

    ];
    const search=[
      { key: 'name', label: '任务主题名称',qFilter:'Q=name_LK',type:'input'},
      { key: 'enabled', label: '是否可用',qFilter:'Q=enabled_Z_EQ',type:'select',option:enabledOption},
    ];
    return (<TableAndSearch
        columns={columns}
        search={search}
        url='services/partybuilding/tasktopic/taskTopicList/get'
        addBtn={{order:1,url:TaskTopicAdd}}
        deleteBtn={{order:2,url:'services/partybuilding/tasktopic/delete/deleteTaskTopic',field:'ids'}}
    >
    </TableAndSearch>)
  }
}