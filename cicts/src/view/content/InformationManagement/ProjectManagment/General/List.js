import React, { Component } from 'react';
import { Tabs,message,Popconfirm,Divider,Spin } from 'antd';
import NewTableSearch from '../../../../component/table/NewTableSearch';
import {postService,getService,GetQueryString} from '../../../myFetch';
import {pageJummps} from '../../PageJumps';
import API_PREFIX from '../../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../../redux-root/action/table/table';
const TabPane=Tabs.TabPane;
@connect(
    state => ({
      dataSource: state.table.tableData,
      pageData:state.table.pageData,
      powers: state.powers,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)

class Article extends Component {
  constructor(props){
    super(props);
    this.state={
      currentTabsKey:GetQueryString(location.hash,['tabsVale']).tabsVale?GetQueryString(location.hash,['tabsVale']).tabsVale:'1',
      tabsValeProject:GetQueryString(location.hash,['tabsVale']).tabsVale?GetQueryString(location.hash,['tabsVale']).tabsVale:'1',//返回到本页面时，生成对应的tab的值
      categoryData:[],//所属栏目的数据
      selectedCategory:'',//当前选中的栏目id
      newsTypeOptions:[],//文章类型
      loading: false,
    };
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
    localStorage.setItem("selectedRowKeys", '');
  }
  dealData=()=>{
    //所属栏目：获取全部的栏目信息
    getService(API_PREFIX+pageJummps.InfoColumn,data=>{
        if(data.status === 1){
            let Data = data.root.object.filter(item => item.type === 1 || item.type === 5);
            // data.root.object.map((item, index) => {
            //   if(item.name=='资讯' || item.name == '通用'){
            //     categoryList=[...categoryList, ...item]
            //   }
            // });
            this.dealCategory(Data);
            this.setState({categoryData:Data,loading:false});
        }
    });
  }

  //递归处理数据
  dealCategory(values){
    values&&values.map((item,index)=>{
      item.value=item.id+'';//将int型转换为字符串
      item.label=item.showType===2?`${item.name}(首页标签)`:item.name;
      item.children=item.subCategoryList;
      if(item.subCategoryList){
        this.dealCategory(item.subCategoryList);
      }
    });
  }
  //Tabs标签
  handleChangeTabs=(activeKey)=>{
    localStorage.setItem("selectedRowKeys", '');
    sessionStorage.setItem("projectGeneralTabsKey",activeKey);
    this.setState({currentTabsKey:activeKey});
    if(activeKey=='1'){
      this.props.getData(API_PREFIX+`${pageJummps.TopicCommonList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=type=6&Q=onlineState=0`);
    }else if(activeKey=='2'){
      this.props.getData(API_PREFIX+`${pageJummps.TopicCommonList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=type=6&Q=onlineState=1`);
    }else if(activeKey=='3'){
      this.props.getData(API_PREFIX+`${pageJummps.TopicCommonList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=type=6&Q=onlineState=2`);  
    }
  }
  //选中栏目
  getSelectedCategory=(value)=>{
    this.setState({selectedCategory:value?value[value.length-1].toString():''},()=>{
      console.log("当前选中的栏目selectedCategory：",value[value.length-1].toString());
    });
  }
  //发布
  issue=(record)=>{
    getService(API_PREFIX+`${pageJummps.TopicCommonPush}/${record.id}`,data=>{
      if(data.status==1){
        message.success('发布成功');
        this.props.getData(API_PREFIX+`${pageJummps.TopicCommonList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=type=6&Q=onlineState=0`);
      }else{
        message.error(data.errorMsg);
      }
    });
  }
  //上线
  onTheLine=(record)=>{
    postService(API_PREFIX+`${pageJummps.TopicCommonUpDown}/${record.id}/1`,{},data=>{
      if(data.status==1){
        message.success('上线成功');
        this.props.getData(API_PREFIX+`${pageJummps.TopicCommonList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=type=6&Q=onlineState=2`);     
        let  selectedRowKeys  = localStorage.getItem('selectedRowKeys');
        let s = selectedRowKeys.split(",");
        s.map((item,index)=>{
            if(item==record.id){
              s.splice(index, 1);
            }
        });
         localStorage.setItem('selectedRowKeys', s.join(','));   
      }else{
        message.error(data.errorMsg);
      }
    });
  }
  //下线
  offLine=(record)=>{
    postService(API_PREFIX+`${pageJummps.TopicCommonUpDown}/${record.id}/2`,{},data=>{
      if(data.status==1){
        message.success('下线成功');
        this.props.getData(API_PREFIX+`${pageJummps.TopicCommonList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=type=6&Q=onlineState=1`);
        let  selectedRowKeys  = localStorage.getItem('selectedRowKeys');
        let s = selectedRowKeys.split(",");
        s.map((item,index)=>{
            if(item==record.id){
              s.splice(index, 1);
            }
        });
        localStorage.setItem('selectedRowKeys', s.join(','));  
      }else{
        message.error(data.errorMsg);
      }
    });
  }

  //编辑
  editArticle=(record)=>{
    location.hash=`#/InformationManagement/project/Edit?newsId=${record.id}`;
  }
  //专题栏目
  subjectColumn=(record)=>{
    location.hash=`#/InformationManagement/project/normaltopic?newsId=${record.id}&type=normal`;
  }

  render() {
    let powers=this.props.powers;
    let {pic,testAPI,currentTabsKey} = this.state;
    let hasAddPower=powers && powers['20001.21608.001'];//新建
    let hasDelPower=powers && powers['20001.21608.004'];//删除
    let hasEditPower=powers && powers['20001.21608.002'];//修改
    let hasSearchPower=powers && powers['20001.21608.003'];//查询
    let hasExportPower=powers && powers['20001.21608.202'];//导出
    let hasReleasePower=powers && powers['20001.21608.005'];//发布
    let onlineOfflinePower=powers && powers['20001.21608.006'];//上线、下线
    
    const columns=[
      {
        title:'发布人',
        dataIndex:'createUserName',
        key:'createUserName',
        width:100,
        fixed:"left",
      },
      {
        title:'专题名称',
        dataIndex:'title',
        key:'title',
        width:100,
        fixed:"left",
      },{
        title:'所属栏目',
        dataIndex:'categoryName',
        key:'categoryName',
      },
      {
        title:'是否推送',
        dataIndex:'isPush',
        key:'isPush',
        render:(data,record)=>{
          return <span>{record.isPush?'是':'否'}</span>
        }
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:150,
      },{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:250,
        fixed:"right",
        render:(data,record)=>(
          <div>
              {
                hasReleasePower?(
                  <Popconfirm title="确定发布该文章吗?" onConfirm={()=>this.issue(record)}>
                    <span><a className='operation'>发布</a></span>
                  </Popconfirm>
                ):null
              }
              <Divider type="vertical" />
              {
                hasEditPower?(
                  <span><a className='operation' onClick={()=>this.editArticle(record)}>编辑</a></span>
                ):null
              }
              <Divider type="vertical" />
              {
                hasSearchPower?(
                  <span><a className='operation' onClick={()=>this.subjectColumn(record)}>专题栏目</a></span>
                ):null
              }
          </div>
        ),
      },
    ];
    const anotherColumns=[
      {
        title:'发布人',
        dataIndex:'createUserName',
        key:'createUserName',
        width:100,
        fixed: 'left',
      },
      {
        title:'专题名称',
        dataIndex:'title',
        key:'title',
        width:100,
        fixed: 'left',
      },{
        title:'所属栏目',
        dataIndex:'categoryName',
        key:'categoryName',
      },{
        title:'浏览数',
        dataIndex:'viewCount',
        key:'viewCount',
        width:100,
        render:(data,record)=>{
           return <a onClick={()=>location.hash=`#/InformationManagement/General/PageView?id=${record.id}&type=4&tabsVale=${record.onlineState+1}`} >
             {record.viewCount}</a>;
        },
      },{
        title:'评论数',
        dataIndex:'voteCount',
        key:'voteCount',
        width:80,
        render:(data,record)=>{
          return <a onClick={()=>location.hash=`#/InformationManagement/General/PageComment?id=${record.id}&&type=4&tabsVale=${record.onlineState+1}`} >
            {record.commentCount}</a>;
        },
      },
      {
        title:'是否推送',
        dataIndex:'isPush',
        key:'isPush',
        width:80,
        render:(data,record)=>{
          return <span>{record.isPush?'是':'否'}</span>
        }
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:150,
      }, 
      {
        title:`下线时间`,
        dataIndex:`lastUpdateDate`,
        key:`lastUpdateDate`,
        width:150,
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:250,
        fixed:"right",
        render:(data,record)=>(
            <div>
                {
                  onlineOfflinePower?(this.state.currentTabsKey=='2'?
                    <Popconfirm title="确定下线该文章吗?" onConfirm={()=>this.offLine(record)}>
                      <span><a className='operation' >下线</a></span><Divider type="vertical" />
                    </Popconfirm>:
                    <Popconfirm title="确定上线该文章吗?" onConfirm={()=>this.onTheLine(record)}>
                      <span><a className='operation' >上线</a></span><Divider type="vertical" />
                    </Popconfirm>):null
                }
                
                {
                  hasEditPower?(
                    <span><a className='operation' onClick={()=>this.editArticle(record)}>编辑</a></span>
                  ):null
                }
                {
                  hasSearchPower?(
                    <span>
                      <Divider type="vertical"/>
                      <span><a className='operation' onClick={()=>this.subjectColumn(record)}>专题栏目</a></span>
                    </span>
                  ):null
                }
            </div>
        ),
      },
    ];
    if(currentTabsKey == '2'){
        anotherColumns[7] = {title:'上线时间',dataIndex:'publishDate',key:'publishDate',width:150}
    }
    const isOrNotOptions = [{ key: '', value: '全部' },{ key: 1, value: '是' }, { key: 0, value: '否' }];
    const search = [
      { key: 'categoryId',label : '所属栏目', qFilter: 'Q=categoryId',type:'cascader',option: this.state.categoryData},
      { key: 'ispush', label: '是否推送', qFilter: 'Q=isPush', type: 'select', option: isOrNotOptions },
      { key: 'title', label: '专题名称',qFilter:'Q=title',type:'input'},
      { key: 'createdate', label: '创建时间', type: 'rangePicker' },
    ];
    const operUrl= {
          addUrl:'#/InformationManagement/project/Add',
          exportUrl:{url:pageJummps.TopicCommonExport,type:'专题'},
          delUrl:{url:pageJummps.TopicCommonDeleta,field:'NO'},
    };
   //设置按钮的权限
   const hasPower={
     add:hasAddPower,
     export:hasExportPower,
     delete:hasDelPower,
   };
    return (
      <Spin spinning={this.state.loading}>
        <div>
          <List
            hasPower={hasPower}
            type='article'
            url={pageJummps.TopicCommonList}
            onChange={this.handleChangeTabs}
            operUrl={operUrl}
            onSelect={(value)=>this.getSelectedCategory(value)}
            columns={columns}
            anotherColumns={anotherColumns}
            search={search}
            testAPI={testAPI}
            tabsValeProject={this.state.tabsValeProject}
           />
        </div>
      </Spin>
    );
  }
}

class CategoryAndLists extends Component{
  constructor(props){
    super(props);
    this.state={
    };
  }

  render(){
    const propsData=this.props;
    return(
        <div>
            <NewTableSearch
              url={this.props.url}
              urlfilter={this.props.urlfilter}
              columns={this.props.columns}
              search={this.props.search}
              typeId='Magazine'
              addBtn={this.props.hasPower.add?{order:1,url:propsData.operUrl.addUrl }:null }
              exportBtn={this.props.hasPower.export?{order:2,url:propsData.operUrl.exportUrl.url,type:propsData.operUrl.exportUrl.type}:null}
              deleteBtn={this.props.hasPower.delete?{order:3,url:propsData.operUrl.delUrl.url,field:propsData.operUrl.delUrl.field}:null}
              scroll={{width:1400}}
            />
        </div>
    );
  }
} 

export class List extends Component{
  constructor(props){
    super(props);
    this.state={};

  }
  render(){
    const props=this.props;
    return (
          <div>
            <Tabs type="card" onChange={props.onChange} defaultActiveKey={props.tabsValeProject}>
              <TabPane tab="未发布" key="1">
                <CategoryAndLists
                    hasPower={props.hasPower}
                    url={props.url}
                    operUrl={props.operUrl}
                    onSelect={props.onSelect}
                    columns={props.columns}
                    search={props.search}
                    urlfilter={'Q=type=6&Q=onlineState=0'}
                />
              </TabPane>
              <TabPane tab="已上线" key="2">
                <CategoryAndLists
                    hasPower={props.hasPower}
                    url={props.url}
                    operUrl={props.operUrl}
                    onSelect={props.onSelect}
                    columns={props.anotherColumns}
                    search={props.search}
                    urlfilter={'Q=type=6&Q=onlineState=1'}
                />
              </TabPane>
              <TabPane tab="已下线" key="3">
                <CategoryAndLists
                    hasPower={props.hasPower}
                    url={props.url}
                    operUrl={props.operUrl}
                    onSelect={props.onSelect}
                    columns={props.anotherColumns}
                    search={props.search}
                    urlfilter={'Q=type=6&Q=onlineState=2'}
                />
              </TabPane>
            </Tabs>
          </div>   
    );
  }
}

export default Article;