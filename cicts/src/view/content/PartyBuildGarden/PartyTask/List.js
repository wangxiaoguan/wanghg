import React, { Component } from 'react';
import { Tabs ,Divider,Popconfirm,message,Spin} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import API_PREFIX from '../../apiprefix';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import {
  PartyTaskAdd,//党建任务新建
  PartyTaskEdit,//党建任务编辑
  PartyTaskDetail,//党建任务编辑
  PartyTaskCompletionRate,//查看完成率
} from '../URL';
import './add.css';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
const TabPane = Tabs.TabPane;
@connect(
    state => ({
      pageData:state.table.pageData,
      selectRowsData: state.table.selectRowsData,  //获取选中行的数据
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
      topicOption:[],//任务主题，
      typeOption:[],//任务类型
      statusOption:[],//任务状态
      currentTabsKey:String(activeKey),//不同状态下，操作不同
      loading: false,
      tabsVale:String(activeKey),
      activeKey:String(activeKey),

    }
  }
    componentWillMount(){
      localStorage.setItem('selectedRowKeys','')
    }

  componentDidMount(){
    console.log(this.state.tabsVale)
    // this.setState({ loading: true });
    window.sessionStorage.checkBoxOption=''
    //页面相关的数据处理
    this.dealData();
    sessionStorage.setItem('level','')
    sessionStorage.setItem('topicId','')
    localStorage.setItem("selectedRowKeys", '');
  }
  componentWillReceiveProps(nextProps) {
    // this.child.handleReset()
    let param = nextProps.location.search.replace('?','').split('&');
    let activeKey = Number(decodeURIComponent(param[0].split('=')[1])) || '0';
    activeKey = String(activeKey);
    if(this.state.activeKey !== activeKey){
      this.setState({
        activeKey
      })
    }
  }
  dealData=()=>{
    let topicOption =this.state.topicOption;
    //任务主题数据
    getService(API_PREFIX+'services/web/party/taskTopic/getList/1/1000',(data)=>{
      if(data.status === 1){
        topicOption.push( { key: '', value: '全部'});
        console.log('topicOption',data);
        data.root.list&&data.root.list.map(item=>{
          topicOption.push({key: item.id, value: item.topicName});
        });
        this.setState({topicOption,loading: false});
      }else{
        message.error(data.errorMsg);
        this.setState({ loading: false });
      }
    });
    let typeOption =this.state.typeOption;
    //任务类型数据
    getService(API_PREFIX+'services/web/party/taskType/getList/1/1000',(data)=>{
      if(data.status === 1){
        typeOption.push( { key: '', value: '全部'});
        data.root.list&&data.root.list.map(item=>{
          typeOption.push({key: item.id, value: item.typeName});
        });
        this.setState({typeOption,loading: false});
      }
    });
    let statusOption=this.state.statusOption;
  //   //任务状态
  //   getService(API_PREFIX+'services/lookup/init/taskStatus',(data)=>{
  //     console.log(data)
  //        data&&data.map((item)=>{
  //  statusOption.push({key:item.code,value:item.desp})
  //        });
  //     statusOption.splice(0,0,{
  //       key:'',
  //       value:'全部'
  //     },);
  //     this.setState({statusOption,loading: false});
  //   });

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
            window.location.hash = `PartyBuildGarden/PartyTask?id=${activeKey}`
          });

      }else if(activeKey=='1'){
        this.setState({
          updateKeyTwo:this.state.updateKeyTwo+1,
        },()=>{
            window.location.hash = `PartyBuildGarden/PartyTask?id=${activeKey}`
          });

      }else if(activeKey=='2'){
        this.setState({
          updateKeyThree:this.state.updateKeyThree+1,
        },()=>{
            window.location.hash = `PartyBuildGarden/PartyTask?id=${activeKey}`
          });

      }
  }
  //编辑
  editTask=(record)=>{
    console.log("record==>",record);
    localStorage.setItem('selectedRowKeys','')
    location.hash = PartyTaskEdit+`?id=${record.id}&activeKey=${this.state.activeKey}`;
  }
  //详情
  taskDetail=(record)=>{
    console.log("record==>",record)
    localStorage.setItem('selectedRowKeys','')
    location.hash = PartyTaskDetail+`?id=${record.id}&detail=true&activeKey=${this.state.activeKey}`;

  }
  //发布
  publishTask=(record)=>{//可以调用上线的接口
    let body={
      ids:[record.id]
    }  
    localStorage.setItem('selectedRowKeys','')
    if(record.receiverJson){
      getService(API_PREFIX+`services/web/party/task/isLinked/${record.id}`,data=>{
        if (data.status !== 1) {
          message.error(data.errorMsg);
          return;
        }else{
          postService(API_PREFIX+`services/web/party/task/publish/${record.id}`,{},data=>{
            if (data.status ===1) {
              message.success("发布成功!");
              this.props.getData(API_PREFIX+`services/web/party/task/getList/-1/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }
            else{
              message.error(data.errorMsg);
            }
          });
        }
      })
      
    }else{
      message.error("无接收人，不能发布");
    }
    

}
//终止
  endTask=(record)=>{
    let body={
      ids:[record.id]
    }

    postService(API_PREFIX+`services/partybuilding/task/update/stopTask`,body,data=>{
      if (data.retCode ===1) {
        message.success("终止成功!");
        this.props.getData(API_PREFIX+`services/partybuilding/task/taskList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }
      else{
        message.error(data.errorMsg);
      }
    });
  }
  //开启
  startTask=(record)=>{
    let body={
      ids:[record.id]
    }

    postService(API_PREFIX+`services/partybuilding/task/update/resumeTask`,body,data=>{
      if (data.retCode ===1) {
        message.success("开启成功!");
        this.props.getData(API_PREFIX+`services/partybuilding/task/taskList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }
      else{
        message.error(data.errorMsg);
      }
    });
  }
  //查看完成率
  viewCompletionRate=(record)=>{
    location.hash = PartyTaskCompletionRate+`?id=${record.id}`;
  }

  //上线
  onTheLine=(selectedRowKeys)=>{
    // console.log(this.props.selectRowsData)
      let  data= this.props.selectRowsData.filter(item=>{
      return item.userName==undefined
    })
    let list=[]
    if(data.length>0){
        data.map(item=>{
         return list.push(item.sNum)
        })
        // console.log(list.join(','))
        let word=list.length>1?list.join(','):list[0]
        message.error(`序号${word}没有发起人，不能上线！`)
        return
    }
    // console.log('selectedRowKeys',selectedRowKeys);
    if(selectedRowKeys.length>0){
      let body = selectedRowKeys
      postService(API_PREFIX+`services/web/party/task/onAndOffline/1`,body,data=>{
        if (data.status ===1) {
          message.success("上线成功!");
          selectedRowKeys.length = 0;
          this.props.getData(API_PREFIX+`services/web/party/task/getList/-1/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
        }
        else{
          message.error(data.errorMsg);
        }
      });
    }else{
      message.error('请选择任务');
    }
 
  }
  //下线
  offLine=(selectedRowKeys)=>{
    console.log(selectedRowKeys)
    if(selectedRowKeys.length>0){
      let body = selectedRowKeys
      postService(API_PREFIX+`services/web/party/task/onAndOffline/0`,body,data=>{
       if (data.status ===1) {
         message.success("下线成功!");
         selectedRowKeys.length = 0;
         this.props.getData(API_PREFIX+`services/web/party/task/getList/-1/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
       }
       else{
         message.error(data.errorMsg);
       }
     });
    }else{
      message.error('请选择任务');
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
        dataIndex: 'partyName',
        key: 'partyName',
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
              <a className='operation' onClick={()=>this.editTask(record)}>编辑</a>
              {/* 20190226  pyj  与小琛确认此处不需要针对编辑进行判断 */}
              {/* <a className='operation'  id={record.statusDesp=='已截止'||record.statusDesp=='未完成'?'operation_list':''} onClick={()=>this.editTask(record)}>编辑</a> */}
              <Divider type="vertical"/>
              <a className='operation'  onClick={()=>this.taskDetail(record)}>详情</a>
              {
                this.state.currentTabsKey=='0'?
                    <Divider type="vertical"/>
                : null
              }
              {
                this.state.currentTabsKey=='0'?
                    <Popconfirm title="确定发布该任务吗?" onConfirm={()=>this.publishTask(record)}>
                      <a className='operation' >发布</a>
                    </Popconfirm>: record.isStop==0?
                            <span>
                              {/* <Popconfirm title="确定终止该任务吗?" onConfirm={()=>this.endTask(record)}>//注释操作里面的终止操作xwx2019/2/25
                              <a className='operation' id={record.statusDesp=='已截止'||record.statusDesp=='已完成'||record.statusDesp=='未完成'?'operation_list':''} >终止</a>
                            </Popconfirm>
                            <Divider type="vertical"/> */}
                               {/* <a className='operation'  onClick={()=>this.viewCompletionRate(record)}>查看完成率</a> */}
                            </span>
                      :(record.statusDesp=='进行中'&&record.isStopDesp=='未终止')?
                      <span>
                      {/* <Popconfirm title="确定终止该任务吗?" onConfirm={()=>this.endTask(record)}>//注释操作里面的终止操作xwx2019/2/25
                      <a className='operation'  >终止</a>
                    </Popconfirm>
                    <Divider type="vertical"/> */}
                       {/* <a className='operation'  onClick={()=>this.viewCompletionRate(record)}>查看完成率</a> */}
                    </span>
                      :<span>
                          {/* <Popconfirm title="确定开启该任务吗?" onConfirm={()=>this.startTask(record)}>//注释操作里面的开启操作xwx2019/2/25
                        <a className='operation' id={record.statusDesp=='已截止'||record.statusDesp=='已完成'||record.statusDesp=='未完成'?'operation_list':''} >开启</a>
                        </Popconfirm>
                        <Divider type="vertical"/> */}
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
        //  {//是否终止注释xwx2019/2/25
        //    title: '是否终止',
        //    dataIndex: 'isStopDesp',
        //    key: 'isStopDesp',
        //  },
     );

     //任务状态（1草稿、2进行中、3完成、4已过期 ）
     const statusOption=[
       { key: '',
         value: '全部'
       },
       { key: '进行中',
         value: '进行中'
       },
       { key: '已截至',
         value: '已截至'
       },
     ];
     const search = [
       { key: 'taskName', label: '任务名称',qFilter:'Q=taskName',type:'input'},
       { key: 'topicId',label : '任务主题', qFilter: 'Q=topicId',type:'select',option: this.state.topicOption},
       { key: 'typeId', label: '任务类型', qFilter: 'Q=typeId', type: 'select', option: this.state.typeOption },
       { key: 'statusDesp', label: '任务状态', qFilter: 'Q=statusDesp', type: 'select', option: statusOption },
     ];
     const search2 = [
      { key: 'taskName', label: '任务名称',qFilter:'Q=taskName',type:'input'},
      { key: 'topicId',label : '任务主题', qFilter: 'Q=topicId',type:'select',option: this.state.topicOption},
      { key: 'typeId', label: '任务类型', qFilter: 'Q=typeId', type: 'select', option: this.state.typeOption },
    ];
    let powers = this.props.powers;
    let hasAddBtn = powers&&powers['20005.23006.001'];
    let hasDeleteBtn = powers &&powers['20005.23006.004']
    let hasOnline = powers &&powers['20005.23006.002']
    let hasOffline = powers &&powers['20005.23006.002']
     return(
        <Spin spinning={this.state.loading}>
          <div>
            <Tabs type="card" defaultActiveKey={this.state.activeKey} onChange={this.handleChangeTabs} className="tabCommon">
                <TabPane tab="未发布" key="0">
                  <TableAndSearch
                      key={updateKeyOne}
                      columns={columns}
                      search={search2}
                      scroll={{width:1600}}
                      urlfilter={'Q=pushStatus=0'}
                      url={'services/web/party/task/getList/-1'}
                      addBtn={hasAddBtn?{order:1,url:PartyTaskAdd}:null}
                      deleteBtn={hasDeleteBtn?{order:2,url:'services/web/party/task/delete',field:''}:null}
                  />
                </TabPane>
              <TabPane tab="已上线" key="1">
                <TableAndSearch
                    key={updateKeyTwo}
                    columns={anotherColumns}
                    search={search}
                    scroll={{width:1600}}
                    urlfilter={'Q=pushStatus=1'}
                    url={'services/web/party/task/getList/-1'}
                    customBtn={hasOffline?{
                      label: '下线',
                      order: 1,
                      onClick: this.offLine
                    }:null}
                    deleteBtn={hasDeleteBtn?{order:2,url:'services/web/party/task/delete',field:''}:null}
                />
              </TabPane>

              <TabPane tab="已下线" key="2">
                <TableAndSearch
                    key={updateKeyThree}
                    columns={anotherColumns}
                    search={search}
                    scroll={{width:1600}}
                    urlfilter={'Q=pushStatus=2'}
                    url={'services/web/party/task/getList/-1'}
                    customBtn={ hasOnline?{
                      label: '上线',
                      order: 1,
                      onClick: this.onTheLine
                    }:null}
                    deleteBtn={hasDeleteBtn?{order:2,url:'services/web/party/task/delete',field:''}:null}
                />

              </TabPane>
            </Tabs>
          </div>
        </Spin>   
     );
   }
}
