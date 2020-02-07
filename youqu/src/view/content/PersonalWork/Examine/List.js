




import React, { Component } from 'react';
import { Tabs ,Divider,Popconfirm,Message,Spin} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import ServiceApi from '../../apiprefix';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import {BEGIN} from '../../../../redux-root/action';
import {connect} from 'react-redux';
const TabPane = Tabs.TabPane;

 class List extends  Component {

  constructor(props){
    super(props);
    this.state={
        updateKeyOne:0,//未发布标签下TABLE的key值，用于在点击时更新页面数据
        updateKeyTwo:0,//已上线标签下TABLE的key值，用于在点击时更新页面数据
        topicOption:[],
        typeOption:[],
        currentTabsKey:'0',//不同状态下，操作不同
    }
  }
//切换标签
handleChangeTabs=(activeKey)=>{
    this.setState({
      currentTabsKey:activeKey,
    });
      if(activeKey=='0'){
        this.setState({
          updateKeyOne:this.state.updateKeyOne+1,
        });

      }else if(activeKey=='1'){
        this.setState({
          updateKeyTwo:this.state.updateKeyTwo+1,
        });

      }
  }
   

   render(){
    const columns=[
        {
          title: '序号',
          key: 'sNum',
          dataIndex: 'sNum',
          width: 100,
          fixed: 'left'
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: '类型',
          dataIndex: 'author',
          key: 'author',
        },
        {
          title: '所属栏目',
          dataIndex: 'isrequireddesp',
          key: 'isrequireddesp',
        },
        {
          title: '提交人',
          dataIndex: 'createdate',
          key: 'createdate',
        },
        {
          title: '提交时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width:360,
          fixed: 'right',
          render:(data,record)=>(
              <div>
                
                <Divider type="vertical" />
                <a className='operation'   >编辑</a>
                <Divider type="vertical"/>
                <a className='operation'   >查看备注</a>
                <Divider type="vertical"/>
                <a className='operation'   >审核详情</a>
                <Divider type="vertical"/>
                <a className='operation'   >通过</a>
                <Divider type="vertical"/>
                <a className='operation'   >驳回</a>
                <Divider type="vertical"/>
                
              </div>
       )
        },
      ];
      const columnsTwo=[
        {
          title: '序号',
          key: 'sNum',
          dataIndex: 'sNum',
          width: 100,
          fixed: 'left'
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: '类型',
          dataIndex: 'author',
          key: 'author',
        },
        {
          title: '所属栏目',
          dataIndex: 'isrequireddesp',
          key: 'isrequireddesp',
        },
        {
          title: '提交人',
          dataIndex: 'createdate',
          key: 'createdate',
        },
        {
          title: '提交时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '提交状态',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width:200,
          fixed: 'right',
          render:(data,record)=>(
              <div>
                <Divider type="vertical" />
                <a className='operation'   >详情</a>
                <Divider type="vertical"/>
                <a className='operation'   >查看备注</a>
                <Divider type="vertical"/>
              </div>
       )
        },
      ];
      const search = [ { key: 'isrequired', label: '所属栏目', qFilter: 'Q=isrequired_I_EQ', type: 'select', option: typeOption } ];
      const {updateKeyOne,updateKeyTwo,updateKeyThree}=this.state;
     return(
        <div>
        <Tabs type="card" onChange={this.handleChangeTabs} className="tabCommon">
            <TabPane tab="待审核" key="0">
              <TableAndSearch
                  key={updateKeyOne}
                  columns={columns}
                  search={search}
                  urlfilter={''}
                  url={''}
                 
              />
            </TabPane>
          <TabPane tab="已审核" key="1">
            <TableAndSearch
                key={updateKeyTwo}
                columns={columnsTwo}
                search={search}
                urlfilter={''}
                url={''}
               
            />
          </TabPane>
        </Tabs>
      </div>
     );
   }
}

//所属栏目
const typeOption = [
    {key:1,  value:'文章' },
    {key:2,  value:'视频' },
    {key:3,  value:'考试' },
    {key:4,  value:'投票' },
    {key:5,  value:'活动' },
    {key:6,  value:'党建' },
  ];
export default List;
