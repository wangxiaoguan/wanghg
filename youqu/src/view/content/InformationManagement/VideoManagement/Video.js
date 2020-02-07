import React, { Component } from 'react';
import { Tabs,Button,message,Popconfirm,Divider,Steps ,Spin } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {postService,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
// import {CategoryAndList} from '../AriticleManagement/Article';
import {pageJummps} from '../PageJumps';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action';
import moment from 'moment';
import PictureWall from './PictureWall'
const TabPane=Tabs.TabPane;
const Step = Steps.Step;
@connect(
    state => ({
      dataSource: state.tableData,
      pageData:state.pageData,
      powers: state.powers,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)
class Video extends Component{
  constructor(props){
    super(props);
    this.state={
      currentTabsKey:'',//当前选中tab的key值
      categoryData:[],//所属栏目的数据
      selectedCategory:'',//当前选中的栏目及父辈
      newsTypeOptions:[],//文章类型
      loading: true,
    }
  }
  componentDidMount(){

  }
  dealData=()=>{

  }
 
  //Tabs标签切换的事件处理
  handleChangeTabs=(activeKey)=>{
    this.setState({currentTabsKey:activeKey});
    if(activeKey=='1'){
      //this.props.getData(ServiceApi+`services/news/video/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=ispulish_Z_EQ=false&Q=type_I_EQ=6`);
    }else if(activeKey=='2'){
      //this.props.getData(ServiceApi+`services/news/video/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=1&Q=type_I_EQ=6`);
    }else if(activeKey=='3'){
      //this.props.getData(ServiceApi+`services/news/video/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=0&Q=type_I_EQ=6`);
    }
  }

  //操作--发布：点击事件
  issue=(record)=>{
  }
  //操作--上线：点击事件
  onTheLine=(record)=>{
  }
  //操作--下线：点击事件
  offLine=(record)=>{
  }
  //编辑
  editArticle=(record)=>{
    location.hash=pageJummps.editVideo+`?newsId=${record.id}`;
  }
  //详情
  articleDetail=(record)=>{
    location.hash=pageJummps.detailVideo+`?newsId=${record.id}`;
  }
  render(){
    let powers=this.props.powers;

    const operUrl= {
      addUrl: pageJummps.newVideo,
      exportUrl:{
        url:'services/news/video/export',
        type:'视频',
      },
      delUrl:{
        url:'services/news/video/deleteNewsByIdList/delete',
        field:'idList',
      }
    };
    const columns=[
      {
        title:'发布人',
        dataIndex:'publishName',
        key:'publishName',
        width:100,
        fixed: 'left'
      },
      {
        title:'视频标题',
        dataIndex:'title',
        key:'title',
        width:100,
        fixed: 'left'
      },
      {
        title:'所属栏目',
        dataIndex:'categoryname',
        key:'categoryname',
      },
      {
        title:'是否推送',
        dataIndex:'ispushdesp',
        key:'ispushdesp',
        width:80,
      },
      {
        title:'是否上首页',
        dataIndex:'ishomepagedesp',
        key:'ishomepagedesp',
        width:80,
      }, {
        title:'创建时间',
        dataIndex:'createdate',
        key:'createdated',
        width:150,
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:250,
        fixed: 'right',
        render:(data,record)=>(
          <div>
            <Popconfirm title="确定发布该视频吗?" onConfirm={()=>this.issue(record)}><span><a className='operation'>发布</a></span></Popconfirm>
            <Divider type="vertical" />
           <span><a className='operation' disabled={!hasEditPower} onClick={()=>this.editArticle(record) }>编辑</a> </span>
          </div>
        )
      }
    ];
    
    const isOrNotOptions = [{ key: '1', value: '是' }, { key: '0', value: '否' }];
    const search = [
      { key: 'categoryId',label : '所属栏目', qFilter: 'Q=categoryid_S_LK',type:'cascader',option: this.state.categoryData},
      { key: 'ispush', label: '是否推送', qFilter: 'Q=ispush_S_EQ', type: 'select', option: isOrNotOptions },
      { key: 'ishomepage', label: '是否上首页', qFilter: 'Q=ishomepage_S_EQ', type: 'select', option: isOrNotOptions },
      { key: 'title', label: '视频标题',qFilter:'Q=title_LK',type:'input'},
      { key: 'createdate', label: '创建时间', type: 'rangePicker' },
    ];

    return (
     
       <div>
         <List
             type='video'
             url='services/news/video/newsList/get'
             onChange={this.handleChangeTabs}
             operUrl={operUrl}
             onSelect={(value)=>this.getSelectedCategory(value)}
             columns={columns}
             search={search}
         ></List>
       </div>
      
    );
  }
}
class List extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const props=this.props;
    return (
          <div>
            <Tabs type="card" onChange={props.onChange} defaultActiveKey="1">
              <TabPane
                  tab="未发布"
                  key="1"
              >
                <CategoryAndList
                    url={props.url}
                    operUrl={props.operUrl}
                    onSelect={props.onSelect}
                    columns={props.columns}
                    search={props.search}
                    urlfilter={props.type==="article"?'Q=ispulish_Z_EQ=false&Q=type_S_NE=6':'Q=ispulish_Z_EQ=false&Q=type_S_EQ=6'}
                />
              </TabPane>
              <TabPane
                  tab="已发布"
                  key="2"
              >
                <CategoryAndList
                    url={props.url}
                    operUrl={props.operUrl}
                    onSelect={props.onSelect}
                    columns={props.columns}
                    search={props.search}
                    urlfilter={props.type==="article"?'Q=onlineState_S_EQ=1&Q=type_S_NE=6':'Q=onlineState_S_EQ=1&Q=type_S_EQ=6'}
                />
              </TabPane>
              <TabPane
                  tab="已下线"
                  key="3"
              >
                <CategoryAndList
                    url={props.url}
                    operUrl={props.operUrl}
                    onSelect={props.onSelect}
                    columns={props.columns}
                    search={props.search}
                    urlfilter={props.type==="article"?'Q=onlineState_S_EQ=0&Q=type_S_NE=6':'Q=onlineState_S_EQ=0&Q=type_S_EQ=6'}
                />
              </TabPane>
            </Tabs>
          </div>   
    );
  }
}
class CategoryAndList extends Component{
  constructor(props){
    super(props);
    this.state={
      categoryData:[],//所属栏目的数据
    }
  }
  componentDidMount(){

  }

  render(){
    const propsData=this.props;
    return(
      
        <div>
            <TableAndSearch
                url={this.props.url}
                urlfilter={this.props.urlfilter}
                columns={this.props.columns}
                search={this.props.search}
                addBtn={{order:1,url:propsData.operUrl.addUrl  }}
                exportBtn={{order:2,url:propsData.operUrl.exportUrl.url,type:propsData.operUrl.exportUrl.type}}
                deleteBtn={{order:3,url:propsData.operUrl.delUrl.url,field:propsData.operUrl.delUrl.field}}
                scroll={{width:1200}}>
            </TableAndSearch>
        </div>
    );
  }
}
export default Video;