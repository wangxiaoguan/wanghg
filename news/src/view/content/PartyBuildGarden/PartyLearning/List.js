




import React, { Component } from 'react';
import { Tabs ,Divider,Popconfirm,Message,Spin} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import ServiceApi from '../../apiprefix';
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
      topicOption:[],
      typeOption:[],
      currentTabsKey:'0',//不同状态下，操作不同
      loading: false,
    }
  }

  componentDidMount(){
    this.setState({ loading: true });
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{


    let topicOption =this.state.topicOption;
    //学习主题和类型假数据  /partybuilding/partyNews/newsList/get/{page}/{pageSize}
    getService(ServiceApi+'services/partybuilding/partyNews/newsList/get/1/1000',(data)=>{
      if(data.retCode===1){
        topicOption.push( { key: '', value: '全部'});
        console.log('topicOption',data);
        data.root.list&&data.root.list.map(item=>{
          topicOption.push({key: item.id, value: item.title});
        });
        this.setState({topicOption,loading: false});
      }else{
        message.error(data.retMsg);
        this.setState({ loading: false });
      }
    });

    const typeOption=[   
      { key: '', value: '全部'},
      { key:'1', value: '选修'},
      { key:'2', value: '必修'},
      
    ];
    this.setState({typeOption})
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


    //编辑学习
    editLearn=(record)=>{
      location.hash = EditLearn+`?Id=${record.id}`;
    }
    //学习详情
    learnDetail=(record)=>{
      location.hash = DetailLearn+`?Id=${record.id}`;
  
    }
    //发布学习   // GET /partybuilding/partyNews/newsInfo/publish/{newsId}
    publishLearn=(record)=>{//可以调用上线的接口
      getService(ServiceApi+`services/partybuilding/partyNews/newsInfo/publish/${record.id}`,data=>{
        if (data.retCode ===1) {
          Message.success("发布成功!");
          this.props.getData(ServiceApi+`services/partybuilding/partyNews/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=ispulish_Z_EQ=false`);
        }
        else{
          Message.error(data.retMsg);
        }
      });
  
  }
 //查看完成率
 viewCompletionRate=(record)=>{
  location.hash = CompletionRateLearn+`?id=${record.id}`;
}



  //上线   GET /partybuilding/partyNews/newsInfo/onlineState/{newsId}/{onLineState}
  onTheLine=(record)=>{
    
    // let body={ ids:selectedRowKeys }
      console.log(record)
      getService(ServiceApi+`services/partybuilding/partyNews/newsInfo/onlineState/${record[0]}/1`,data=>{
        if (data.retCode ===1) {
          Message.success("上线成功!");
          this.props.getData(ServiceApi+`services/partybuilding/partyNews/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=0`);
        }
        else{
          Message.error(data.retMsg);
        }
      });
    }

  offLine=(record)=>{
    console.log(record[0])
    getService(ServiceApi+`services/partybuilding/partyNews/newsInfo/onlineState/${record[0]}/0`,data=>{
      if (data.retCode ===1) {
        Message.success("下线成功!");
        this.props.getData(ServiceApi+`services/partybuilding/partyNews/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=1`);
      }
      else{
        Message.error(data.retMsg);
      }
    });
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
        title: '学习名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '发布人',
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: '是否必修',
        dataIndex: 'isrequireddesp',
        key: 'isrequireddesp',
      },
      {
        title: '创建时间',
        dataIndex: 'createdate',
        key: 'createdate',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:250,
        fixed: 'right',
        render:(data,record)=>(
            <div>
              
              <Divider type="vertical" />
              <a className='operation' onClick={()=>this.editLearn(record) } >编辑</a>
              <Divider type="vertical"/>
              <a className='operation' onClick={()=>this.learnDetail(record) } >详情</a>
              <Divider type="vertical"/>
              {
                this.state.currentTabsKey=='0'?
                    <Popconfirm title="确定发布吗?" onConfirm={()=>this.publishLearn(record)}>
                    <a className='operation'>发布</a>
                    </Popconfirm>:null
                    // <a className='operation'  onClick={()=>this.viewCompletionRate(record)}>查看完成率</a>  暂时不需要
              }
              
            </div>
     )
      },


    ];
    let anotherColumns=[...columns];
    const search = [
      { key: 'categoryname', label: '学习名称',qFilter:'Q=title_LK',type:'input'},
      { key: 'isrequired', label: '是否必修', qFilter: 'Q=isrequired_I_EQ', type: 'select', option: this.state.typeOption },
    ];
    const {updateKeyOne,updateKeyTwo,updateKeyThree}=this.state;
     return(
    
          <div>
            <Tabs type="card" onChange={this.handleChangeTabs} className="tabCommon">
                <TabPane tab="未发布" key="0">
                  <TableAndSearch
                      key={updateKeyOne}
                      columns={columns}
                      search={search}
                      urlfilter={'Q=ispulish_Z_EQ=false'}
                      url={'services/partybuilding/partyNews/newsList/get'}
                      addBtn={{order:1,url:AddLearn}}
                      deleteBtn={{order:2,url:'services/partybuilding/partyNews/deleteNewsByIdList/delete',field:'ids'}}
                  />
                </TabPane>
              <TabPane tab="已上线" key="1">
                <TableAndSearch
                    key={updateKeyTwo}
                    columns={anotherColumns}
                    search={search}
                    urlfilter={'Q=onlineState_S_EQ=1'}
                    url={'services/partybuilding/partyNews/newsList/get'}
                    customBtn={{
                      label: '下线',
                      order: 1,
                      onClick: this.offLine
                    }}
                    deleteBtn={{order:2,url:'services/partybuilding/partyNews/deleteNewsByIdList/delete',field:'ids'}}
                />
              </TabPane>

              <TabPane tab="已下线" key="2">
                <TableAndSearch
                    key={updateKeyThree}
                    columns={anotherColumns}
                    search={search}
                    urlfilter={'Q=onlineState_S_EQ=0'}
                    url={'services/partybuilding/partyNews/newsList/get'}
                    customBtn={{
                      label: '上线',
                      order: 1,
                      onClick: this.onTheLine
                    }}
                    deleteBtn={{order:2,url:'services/partybuilding/partyNews/deleteNewsByIdList/delete',field:'ids'}}
                />

              </TabPane>
            </Tabs>
          </div>
      
     );
   }
}
