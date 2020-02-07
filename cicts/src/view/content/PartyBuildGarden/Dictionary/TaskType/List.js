import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import API_PREFIX from '../../../apiprefix';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {TaskTypeAdd,TaskTypeEdit
} from '../URL';
import {connect} from 'react-redux';
@connect(
  state => ({
    powers: state.powers,
  }),
)
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
    localStorage.setItem("selectedRowKeys", '');
  }
  dealData=()=>{
    //获取任务主题数据作为下拉框
    getService(API_PREFIX+'services/web/party/taskTopic/getList/1/1000',data=>{
        if(data.status===1){//接口返回成功
          let topicOption=this.state.topicOption;
          topicOption.push({key:'', value:'全部'});
          data.root.list&&data.root.list.map((item)=>{
            topicOption.push({key:item.id, value:item.topicName});
          });
          this.setState({
            topicOption
          });
        }else{
          console.log('任务主题接口报错',data.errorMsg);
        }
    });
  }
  render(){
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
        title: '任务类型名称',
        key: 'typeName',
        dataIndex: 'typeName',
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
          return (<a disabled={!hasEditBtn} onClick={()=>{sessionStorage.setItem('topicTypeData', JSON.stringify(record)); location.hash = TaskTypeEdit+`?id=${record.id}`}}>编辑</a>)
        }
      },
    ];
    const enabledOption=[
      {key:'', value:'全部'},
      {key:true, value:'是'},
      {key:false, value:'否'},

    ];
    const search=[
      { key: 'typeName', label: '任务类型名称',qFilter:'Q=typeName',type:'input'},
      { key: 'topicId', label: '任务主题',qFilter:'Q=topicId',type:'select',option:this.state.topicOption},
      { key: 'isEnabled', label: '是否可用',qFilter:'Q=isEnabled',type:'select',option:enabledOption},
    ];
    return (<TableAndSearch
        columns={columns}
        search={search}
        url='services/web/party/taskType/getList'
        addBtn={hasAddBtn ? {order:1,url:TaskTypeAdd} : null}
        deleteBtn={hasDeleteBtn ? {order:2,url:'services/web/party/taskType/delete',field:''} :null}
    >
    </TableAndSearch>)
  }
}