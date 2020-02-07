import React, { Component } from 'react';
import { Tabs ,Divider,Popconfirm,Message,Spin} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import ServiceApi from '../../apiprefix';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import {
  PartyTaskAdd,//党建任务新建
  PartyTaskEdit,//党建任务编辑
  PartyTaskDetail,//党建任务编辑
  PartyTaskCompletionRate,//查看完成率
} from '../URL';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action';
const TabPane = Tabs.TabPane;
import './PartyTaskList.css'
@connect(
    state => ({
      pageData:state.pageData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)
export default class List extends  Component {
  constructor(props){
    super(props);
    this.state={
      updateKeyOne:0,//未发布标签下TABLE的key值，用于在点击时更新页面数据
      updateKeyTwo:0,//已上线标签下TABLE的key值，用于在点击时更新页面数据
      updateKeyThree:0,//已下线标签下TABLE的key值，用于在点击时更新页面数据
      topicOption:[],//任务主题，
      typeOption:[],//任务类型
      statusOption:[],//任务状态
      currentTabsKey:GetQueryString(location.hash,['tabsVale']).tabsVale?GetQueryString(location.hash,['tabsVale']).tabsVale:0,//不同状态下，操作不同
      loading: false,
      tabsVale:GetQueryString(location.hash,['tabsVale']).tabsVale?GetQueryString(location.hash,['tabsVale']).tabsVale:0,

    }
  }
  componentDidMount(){
    console.log(this.state.tabsVale)
    this.setState({ loading: true });
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{

    // const topic=[
    //   { key: '', value: '全部'},
    //   { key: '1', value: '两学一做'},
    //   { key: '2', value: '十七大'},
    //   { key: '3', value: '十八大'},
    //   { key: '4', value: '习大大精神'},
    //
    // ];
    let topicOption =this.state.topicOption;
    //任务主题和类型假数据
    getService(ServiceApi+'services/partybuilding/task/taskTopicList/get/1/1000',(data)=>{
      if(data.retCode===1){
        topicOption.push( { key: '', value: '全部'});
        console.log('topicOption',data);
        data.root.list&&data.root.list.map(item=>{
          topicOption.push({key: item.id, value: item.name});
        });
        this.setState({topicOption,loading: false});
      }else{
        message.error(data.retMsg);
        this.setState({ loading: false });
      }
    });

    // const type=[   //3三会一课 (党员活动室)5党委中心组1重要工作部署
    //   { key: '', value: '全部'},
    //   { key: '3', value: '三会一课'},
    //   { key: '5', value: '党委中心组'},
    //   { key: '1', value: '重要工作部署'},
    // ];
    let typeOption =this.state.typeOption;
    //任务主题和类型假数据
    getService(ServiceApi+'services/partybuilding/task/taskTypeList/get/1/1000',(data)=>{
      if(data.retCode===1){
        typeOption.push( { key: '', value: '全部'});
        data.root.list&&data.root.list.map(item=>{
          typeOption.push({key: item.id, value: item.name});
        });
        this.setState({typeOption,loading: false});
      }
    });
    let statusOption=this.state.statusOption;
    //任务状态
    getService(ServiceApi+'services/lookup/init/taskStatus',(data)=>{
      console.log(data)
         data&&data.map((item)=>{
   statusOption.push({key:item.code,value:item.desp})
         });
      statusOption.splice(0,0,{
        key:'',
        value:'全部'
      },);
      this.setState({statusOption,loading: false});
    });

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

      }else if(activeKey=='2'){
        this.setState({
          updateKeyThree:this.state.updateKeyThree+1,
        });

      }
  }
  //编辑
  editTask=(record)=>{
    console.log("record==>",record)
    location.hash = PartyTaskEdit+`?id=${record.id}`;
  }
  //详情
  taskDetail=(record)=>{
    console.log("record==>",record)
    location.hash = PartyTaskDetail+`?id=${record.id}&detail=true`;

  }
  //发布
  publishTask=(record)=>{//可以调用上线的接口
    let body={
      ids:[record.id]
    }

    postService(ServiceApi+`services/partybuilding/task/update/updateTasksOnline`,body,data=>{
      if (data.retCode ===1) {
        Message.success("发布成功!");
        this.props.getData(ServiceApi+`services/partybuilding/task/taskList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }
      else{
        Message.error(data.retMsg);
      }
    });

}
//终止
  endTask=(record)=>{
    let body={
      ids:[record.id]
    }

    postService(ServiceApi+`services/partybuilding/task/update/stopTask`,body,data=>{
      if (data.retCode ===1) {
        Message.success("中止成功!");
        this.props.getData(ServiceApi+`services/partybuilding/task/taskList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }
      else{
        Message.error(data.retMsg);
      }
    });
  }
  //开启
  startTask=(record)=>{
    let body={
      ids:[record.id]
    }

    postService(ServiceApi+`services/partybuilding/task/update/resumeTask`,body,data=>{
      if (data.retCode ===1) {
        Message.success("开启成功!");
        this.props.getData(ServiceApi+`services/partybuilding/task/taskList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }
      else{
        Message.error(data.retMsg);
      }
    });
  }
  //查看完成率
  viewCompletionRate=(record)=>{
    location.hash = PartyTaskCompletionRate+`?id=${record.id}`;
  }

  //上线
  onTheLine=(selectedRowKeys)=>{
  console.log('selectedRowKeys',selectedRowKeys);
  if(selectedRowKeys.length>0){
    let body={ ids:selectedRowKeys}
    postService(ServiceApi+`services/partybuilding/task/update/updateTasksOnline`,body,data=>{
      if (data.retCode ===1) {
        Message.success("上线成功!");
        this.props.getData(ServiceApi+`services/partybuilding/task/taskList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }
      else{
        Message.error(data.retMsg);
      }
    });
  }else{
    Message.error('请选择任务');
  }
 
  }
  //下线
  offLine=(selectedRowKeys)=>{
    console.log(selectedRowKeys)
    if(selectedRowKeys.length>0){
      let body={ids:selectedRowKeys }
      postService(ServiceApi+`services/partybuilding/task/update/updateTasksOffline`,body,data=>{
       if (data.retCode ===1) {
         Message.success("下线成功!");
         this.props.getData(ServiceApi+`services/partybuilding/task/taskList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
       }
       else{
         Message.error(data.retMsg);
       }
     });
    }else{
      Message.error('请选择任务');
    }
    
  }

   render(){
    console.log("this.state.typeOption",this.state.typeOption)
    const {updateKeyOne,updateKeyTwo,updateKeyThree,tabsVale}=this.state;
    const columns=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width: 100,
        fixed: 'left'
      },
      {
        title: '任务名称',
        key: 'taskName',
        dataIndex: 'taskName',
        width: 100,
        fixed: 'left'
      },
      {
        title: '任务主题',
        dataIndex: 'topicName',
        key: 'topicName',
      },
      {
        title: '任务类型',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '发起人',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '发起人党组织',
        dataIndex: 'upPartyName',
        key: 'upPartyName',
      },
      {
        title: '任务截止时间',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '任务状态',
        dataIndex: 'statusDesp',
        key: 'statusDesp',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:250,
        fixed: 'right',
        render:(data,record)=>(
            <div>
             
              <a className='operation'  id={record.statusDesp=='已过期'?'operation_list':''} onClick={()=>this.editTask(record)}>编辑</a>
              <Divider type="vertical"/>
              <a className='operation'  onClick={()=>this.taskDetail(record)}>详情</a>
              <Divider type="vertical"/>
              {
                this.state.currentTabsKey=='0'?
                    <Popconfirm title="确定发布该任务吗?" onConfirm={()=>this.publishTask(record)}>
                      <a className='operation' >发布</a>
                    </Popconfirm>: (record.statusDesp=='完成'||record.statusDesp=='已过期')?
                            <span>
                              <Popconfirm title="确定终止该任务吗?" onConfirm={()=>this.endTask(record)}>
                              <a className='operation' id='operation_list' >终止</a>
                            </Popconfirm>
                            <Divider type="vertical"/>
                               {/* <a className='operation'  onClick={()=>this.viewCompletionRate(record)}>查看完成率</a> */}
                            </span>
                      :(record.statusDesp=='进行中'&&record.isStopDesp=='未终止')?<span>
                      <Popconfirm title="确定终止该任务吗?" onConfirm={()=>this.endTask(record)}>
                      <a className='operation'  >终止</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                       {/* <a className='operation'  onClick={()=>this.viewCompletionRate(record)}>查看完成率</a> */}
                    </span>
                      :<span>
                          <Popconfirm title="确定开启该任务吗?" onConfirm={()=>this.startTask(record)}>
                        <a className='operation' >开启</a>
                        </Popconfirm>
                        <Divider type="vertical"/>
                           {/* <a className='operation'  onClick={()=>this.viewCompletionRate(record)}>查看完成率</a> */}
                        </span>

              }


            </div>
     )
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

     //任务状态（1草稿、2进行中、3完成、4已过期 ）
     // const statusOption=[
     //   { key: '',
     //     value: '全部'
     //   },
     //   { key: 1,
     //     value: '草稿'
     //   },
     //   { key: 2,
     //     value: '进行中'
     //   },
     //   { key:3,
     //     value: '完成'
     //   },
     //   { key: 4,
     //     value: '已过期'
     //   },
     // ];
     const search = [
       { key: 'taskName', label: '任务名称',qFilter:'Q=taskName_LK',type:'input'},
       { key: 'topicId',label : '任务主题', qFilter: 'Q=topicId_S_EQ',type:'select',option: this.state.topicOption},
       { key: 'typeId', label: '任务类型', qFilter: 'Q=typeId_I_EQ', type: 'select', option: this.state.typeOption },
       { key: 'status', label: '任务状态', qFilter: 'Q=status_I_EQ', type: 'select', option: this.state.statusOption },
     ];
     const search2 = [
      { key: 'taskName', label: '任务名称',qFilter:'Q=taskName_LK',type:'input'},
      { key: 'topicId',label : '任务主题', qFilter: 'Q=topicId_S_EQ',type:'select',option: this.state.topicOption},
      { key: 'typeId', label: '任务类型', qFilter: 'Q=typeId_I_EQ', type: 'select', option: this.state.typeOption },
    ];
     return(
        <Spin spinning={this.state.loading}>
          <div>
            <Tabs type="card" defaultActiveKey={tabsVale} onChange={this.handleChangeTabs} className="tabCommon">
                <TabPane tab="未发布" key="0">
                  <TableAndSearch
                      key={updateKeyOne}
                      columns={columns}
                      search={search2}
                      scroll={{width:1600}}
                      urlfilter={'Q=pushStatus_I_EQ=0'}
                      url={'services/partybuilding/task/taskList/get'}
                      addBtn={{order:1,url:PartyTaskAdd}}
                      deleteBtn={{order:2,url:'services/partybuilding/task/delete/deleteTask',field:'ids'}}
                  />
                </TabPane>
              <TabPane tab="已上线" key="1">
                <TableAndSearch
                    key={updateKeyTwo}
                    columns={anotherColumns}
                    search={search}
                    scroll={{width:1600}}
                    urlfilter={'Q=pushStatus_I_EQ=1'}
                    url={'services/partybuilding/task/taskList/get'}
                    customBtn={{
                      label: '下线',
                      order: 1,
                      onClick: this.offLine
                    }}
                    deleteBtn={{order:2,url:'services/partybuilding/task/delete/deleteTask',field:'ids'}}
                />
              </TabPane>

              <TabPane tab="已下线" key="2">
                <TableAndSearch
                    key={updateKeyThree}
                    columns={anotherColumns}
                    search={search}
                    scroll={{width:1600}}
                    urlfilter={'Q=pushStatus_I_EQ=2'}
                    url={'services/partybuilding/task/taskList/get'}
                    customBtn={{
                      label: '上线',
                      order: 1,
                      onClick: this.onTheLine
                    }}
                    deleteBtn={{order:2,url:'services/partybuilding/task/delete/deleteTask',field:'ids'}}
                />

              </TabPane>
            </Tabs>
          </div>
        </Spin>   
     );
   }
}
