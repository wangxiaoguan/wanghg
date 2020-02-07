




import React, { Component } from 'react';
import { Tabs ,Divider,Popconfirm,message,Spin} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import API_PREFIX from '../../apiprefix';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
const TabPane = Tabs.TabPane;
import {
  AddLearn,//党建学习新建
  EditLearn,//党建学习编辑
  DetailLearn,//党建学习编辑
  CompletionRateLearn,//查看完成率
} from '../URL';
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
    let activeKey = GetQueryString(location.hash, ['id']).id || '0';
    this.state={
      updateKeyOne:0,//未发布标签下TABLE的key值，用于在点击时更新页面数据
      updateKeyTwo:0,//已上线标签下TABLE的key值，用于在点击时更新页面数据
      updateKeyThree:0,//已下线标签下TABLE的key值，用于在点击时更新页面数据
      topicOption:[],
      typeOption:[],
      currentTabsKey:String(activeKey),//不同状态下，操作不同
      loading: false,
      activeKey:String(activeKey),
    }
  }

  componentDidMount(){
    localStorage.setItem("selectedRowKeys", '');
  }

  //切换标签
  handleChangeTabs=(activeKey)=>{
    localStorage.setItem("selectedRowKeys", '');
    this.setState({
      currentTabsKey:activeKey,
      activeKey
    });
      if(activeKey=='0'){
        this.setState({
          updateKeyOne:this.state.updateKeyOne+1,
        },()=>{
            window.location.hash = `PartyBuildGarden/PartyLearning?id=${activeKey}`
          });

      }else if(activeKey=='1'){
        this.setState({
          updateKeyTwo:this.state.updateKeyTwo+1,
        },()=>{
            window.location.hash = `PartyBuildGarden/PartyLearning?id=${activeKey}`
          });

      }else if(activeKey=='2'){
        this.setState({
          updateKeyThree:this.state.updateKeyThree+1,
        },()=>{
            window.location.hash = `PartyBuildGarden/PartyLearning?id=${activeKey}`
          });

      }
  }


    //编辑
    editLearn=(record)=>{
      location.hash = EditLearn+`?Id=${record.id}&activeKey=${this.state.activeKey}`;
    }

    //详情
    learnDetail=(record)=>{
      location.hash = DetailLearn+`?Id=${record.id}&activeKey=${this.state.activeKey}`;
  
    }

    //笔记
    learnNote=(record)=>{
      location.hash = `/PartyBuildGarden/PartyLearning/Note?id=${record.id}&activeKey=${this.state.activeKey}`;
  
    }

    publishLearn=(record)=>{
        postService(API_PREFIX+`services/web/party/partyStudy/publishPartyStudy/${record.id}`,{},data=>{
            if (data.status ===1) {
                message.success("发布成功!");
                this.props.getData(API_PREFIX+`services/web/party/partyStudy/getPartyStudyList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState=0`);
            }
            else{
                message.error(data.errorMsg);
            }
        });
  
    }
   render(){
    let powers = this.props.powers;
    let hasAddBtn = powers&&powers['20005.23018.001'];
    let hasEditBtn = powers && powers ['20005.23018.002']
    let hasDeleteBtn = powers &&powers['20005.23018.004']
    let hasPublishBtn = powers && powers['20005.23018.005']
    let hasOnline = powers &&powers['20005.23018.006']
    const columns1=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width: 100,
        fixed: 'left'
      },
      {
        title: '学习名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '发布人',
        dataIndex: 'createUserName',
        key: 'createUserName',
      },
      {
        title: '是否必修',
        dataIndex: 'isRequired',
        key: 'isRequired',
        render:(_,record)=>{
          return <span>{record.isRequired===2?'是':'否'}</span>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:250,
        fixed: 'right',
        render:(_,record)=>(
            <div>
                <a className='operation' disabled={!hasEditBtn} onClick={()=>this.editLearn(record) } >编辑</a>
                <Divider type="vertical"/>
                <a className='operation' onClick={()=>this.learnDetail(record) } >详情</a>
                <Divider type="vertical"/> 
                <Popconfirm title="确定发布吗?" onConfirm={()=>this.publishLearn(record)}><a disabled={!hasPublishBtn} className='operation'>发布</a></Popconfirm>
            </div>
        )
      },
    ];
    const columns2=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width: 100,
        fixed: 'left'
      },
      {
        title: '学习名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '发布人',
        dataIndex: 'createUserName',
        key: 'createUserName',
      },
      {
        title: '是否必修',
        dataIndex: 'isRequired',
        key: 'isRequired',
        render:(_,record)=>{
          return <span>{record.isRequired===2?'是':'否'}</span>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:250,
        fixed: 'right',
        render:(_,record)=>(
            <div>
                <a className='operation' disabled={!hasEditBtn} onClick={()=>this.editLearn(record) } >编辑</a>
                <Divider type="vertical"/>
                <a className='operation' onClick={()=>this.learnDetail(record) } >详情</a>
                <Divider type="vertical"/> 
                <a className='operation' onClick={()=>this.learnNote(record) } >查看学习笔记</a>
            </div>
        )
      },
    ];
    const columns3=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width: 100,
        fixed: 'left'
      },
      {
        title: '学习名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '发布人',
        dataIndex: 'createUserName',
        key: 'createUserName',
      },
      {
        title: '是否必修',
        dataIndex: 'isRequired',
        key: 'isRequired',
        render:(_,record)=>{
          return <span>{record.isRequired===2?'是':'否'}</span>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:250,
        fixed: 'right',
        render:(_,record)=>(
            <div>
                <a className='operation' disabled={!hasEditBtn} onClick={()=>this.editLearn(record) } >编辑</a>
                <Divider type="vertical"/>
                <a className='operation' onClick={()=>this.learnDetail(record) } >详情</a>
                <Divider type="vertical"/> 
                <a className='operation' onClick={()=>this.learnNote(record) } >查看学习笔记</a>
            </div>
        )
      },
    ];
    const typeOption=[{ key: '', value: '全部'},{ key:'2', value: '是'},{ key:'1', value: '否'}];
    const search = [
      { key: 'title', label: '学习名称',qFilter:'Q=title',type:'input'},
      { key: 'isRequired', label: '是否必修', qFilter: 'Q=isRequired', type: 'select', option: typeOption },
    ];
    const {updateKeyOne,updateKeyTwo,updateKeyThree}=this.state;
    let getListUrl = 'services/web/party/partyStudy/getPartyStudyList'
     return(
      <Spin spinning={this.state.loading}>
          <div>
            <Tabs defaultActiveKey={this.state.activeKey} type="card" onChange={this.handleChangeTabs} className="tabCommon">
                <TabPane tab="未发布" key="0">
                  <TableAndSearch
                      key={updateKeyOne}
                      columns={columns1}
                      search={search}
                      urlfilter={'Q=onlineState=0'}
                      url={getListUrl}
                      addBtn={hasAddBtn?{order:1,url:AddLearn}:null}
                      deleteBtn={hasDeleteBtn?{order:2,url:'services/web/party/partyStudy/deletePartyStudy'}:null}
                  />
                </TabPane>
                <TabPane tab="已上线" key="1">
                  <TableAndSearch
                      key={updateKeyTwo}
                      columns={columns2}
                      search={search}
                      urlfilter={'Q=onlineState=1'}
                      url={getListUrl}
                      offOrOnLineBtn={hasOnline ? { label: '下线', order: 1, url: 'services/web/party/partyStudy/onlineState/2' } : null}
                      deleteBtn={hasDeleteBtn?{order:2,url:'services/web/party/partyStudy/deletePartyStudy'}:null}
                  />
                </TabPane>

                <TabPane tab="已下线" key="2">
                  <TableAndSearch
                      key={updateKeyThree}
                      columns={columns3}
                      search={search}
                      urlfilter={'Q=onlineState=2'}
                      url={getListUrl}
                      offOrOnLineBtn={hasOnline ? { label: '上线', order: 1, url: 'services/web/party/partyStudy/onlineState/1',typeLine:'上线' } : null}
                      deleteBtn={hasDeleteBtn?{order:2,url:'services/web/party/partyStudy/deletePartyStudy'}:null}
                  />
                </TabPane>
            </Tabs>
          </div>
      </Spin>  
     );
   }
}
