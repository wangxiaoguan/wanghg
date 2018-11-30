import React, { Component } from 'react';
import { Form, Table,Tabs, Row, Col, Select, Button, Input, DatePicker, Message, Popconfirm, Upload, Cascader } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import API_PREFIX from '../../apiprefix';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import {connect} from 'react-redux';
const Option = Select.Option;
@connect(
    state => ({
      pageData:state.table.pageData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)
export default class List extends  Component {
  constructor(props){
    super(props);
    this.state={
      totalNum:0,
      publicData:[], //列表展示数据
      queryRange:GetQueryString(location.hash,['queryRange']).queryRange,//获取前一个页面传过来的值
    }
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{
    //获取榜单的详细信息
    getService(API_PREFIX+`services/partybuilding/taskStateTxUI/boardDetai/get/1/10/${this.state.queryRange}`,(data)=>{
      if(data.retCode===1){
        data.root.list&&data.root.list.map((item,i)=>{
          item.indexN=i+1;
        });
        this.setState({
          totalNum:data.root.totalNum,
          publicData:data.root.list,
        });
      }
    });
  }

  //页码改变触发
  onPageChange = (current, pageSize) =>{
    getService(API_PREFIX + `services/partybuilding/taskStateTxUI/boardDetai/get/${current}/${pageSize}/${this.state.queryRange}`,data =>{
      if(data.retCode === 1){
        let n = (current - 1)*10 + 1;
        data.root.list&&data.root.list.map((item,i)=>{
          item.indexN=i+n;
        });
        this.setState({
          totalNum: data.root.totalNum,
          publicData: data.root.list,
          // pageSize: pageSize,
        });
      } else if(data.retCode === 0){
        message.error(data.retMsg);
      }
    });
  }


  render(){
    const columns=[
      {
        title: '排名',
        key: 'indexN',
        dataIndex: 'indexN',
      },
      {
        title: '榜支部名称',
        key: 'fullname',
        dataIndex: 'fullname',
      },
      {
        title: '组织完成率',
        dataIndex: 'partypercentage',
        key: 'partypercentage',
      },
      {
        title: '党员参与率',
        dataIndex: 'mempercentage',
        key: 'mempercentage',
      },
      {
        title: '党员人数',
        dataIndex: 'partymemnum',
        key: 'partymemnum',
      },
      {
        title: '党员活跃率',
        dataIndex: 'activepercentage',
        key: 'activepercentage',
      },

    ];
    let anotherColumns=[...columns];
     anotherColumns.splice(
         9,
         0,
         {
           title: '是否终止',
           dataIndex: 'isStopDesp',
           key: 'isStopDesp',
         },
     );
     

    let { data,totalNum } = this.state;

    console.log("data1==",data);
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: this.state.totalNum,
      pageSize: 10,
      pageSizeOptions: ['10', '15', '20'],
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
    };
    return(
      <div>
        <Table rowKey='id' bordered columns={columns} dataSource={this.state.publicData} pagination={pagination}/>
      </div>
    );
  }
}
