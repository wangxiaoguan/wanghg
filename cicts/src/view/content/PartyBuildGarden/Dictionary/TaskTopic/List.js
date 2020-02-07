import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import API_PREFIX from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {TaskTopicAdd,TaskTopicEdit
} from '../URL';
import {BEGIN} from '../../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
@connect(
  state => ({
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class List extends  Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    // this.setState({ loading: true });
    //页面相关的数据处理
    localStorage.setItem("selectedRowKeys", '');
  }
  render(){
    console.log(this.props)
    let powers = this.props.powers;
    let hasAddBtn = powers&&powers['20005.23008.001'];
    let hasDeleteBtn = powers &&powers['20005.23008.004']
    let hasEditBtn = powers &&powers['20005.23008.002']
    const columns=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '任务主题名称',
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
        key: 'isEnabled',
        dataIndex: 'isEnabled',
        render: (text, record) => {
          if(record.isEnabled) {
            return '是'
          }else {
            return '否'
          }
        }
      },
      {
        title: '创建时间',
        key: 'createDate',
        dataIndex: 'createDate',
      },
      {
        title: '最后更新时间',
        dataIndex: 'lastUpdateDate',
        key: 'lastUpdateDate',
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render:(data,record)=>{
          return (<a id={hasEditBtn?'':'banEdit'} onClick={()=>{sessionStorage.setItem('topicTaskData', JSON.stringify(record)); location.hash = TaskTopicEdit+`?id=${record.id}`}}>编辑</a>)
        }
      },
    ];
    const enabledOption=[
      {key:'', value:'全部'},
      {key:true, value:'是'},
      {key:false, value:'否'},

    ];
    const search=[
      { key: 'topicName', label: '任务主题名称',qFilter:'Q=topicName',type:'input'},
      { key: 'isEnabled', label: '是否可用',qFilter:'Q=isEnabled',type:'select',option:enabledOption},
    ];
    return (<TableAndSearch
        columns={columns}
        search={search}
        url='services/web/party/taskTopic/getList'
        addBtn={hasAddBtn?{order:1,url:TaskTopicAdd}:null}
        deleteBtn={hasDeleteBtn?{order:2,url:'services/web/party/taskTopic/delete',field:''}:null}
    >
    </TableAndSearch>)
  }
}