import React, { Component } from 'react';
import { Tabs,Select,Button,message,Cascader,Form,Popconfirm,Modal,Divider,Spin } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {postService,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
import {pageJummps} from '../PageJumps';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import moment from 'moment';
var QRCode = require('qrcode.react');
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
class Article extends Component {
  constructor(props){
    super(props);
    this.state={
      currentTabsKey:'1', //当前选中tab的key值
      categoryData:[],    //所属栏目的数据
      selectedCategory:'',//当前选中的栏目id
      newsTypeOptions:[], //文章类型
      visible: false,
      loading: false,
    }
  }
  componentDidMount(){}

  //Tabs标签切换
  handleChangeTabs=(activeKey)=>{
    this.setState({currentTabsKey:activeKey});
    if(activeKey=='1'){
      this.props.getData(ServiceApi+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=ispulish_Z_EQ=false&Q=type_S_NE=6`);
    }else if(activeKey=='2'){
      this.props.getData(ServiceApi+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=1&Q=type_S_NE=6`);
    }else if(activeKey=='3'){
      this.props.getData(ServiceApi+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=0&Q=type_S_NE=6`);
    }
  }
  //发布
  ArticlePush=(record)=>{
  }
  //上线
  onTheLine=(record)=>{
  }
  //下线
  offLine=(record)=>{
  }
  //编辑
  ArticleEdit=(record)=>{
    location.hash=pageJummps.editArticle+`?newsId=${record.id}`;
  }
  //详情
  ArticleDetail=(record)=>{
    location.hash=pageJummps.detailAriticle+`?newsId=${record.id}`;
  }



  render() {
    let powers=this.props.powers;
    const columns=[
      {
        title:'发布人',
        dataIndex:'publishName',
        key:'publishName',
        width:100,
        fixed: 'left'
      },
      {
        title:'文章标题',
        dataIndex:'title',
        key:'title',
        width:100,
        fixed: 'left'
      },
      {
        title:'文章类型',
        dataIndex:'typedesp',
        key:'typedesp',
        width:80,
      },
      {
        title:'是否必修',
        dataIndex:'isrequireddesp',
        key:'isrequireddesp',
        width:80,
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
        key:'createdate',
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
            <Popconfirm title="确定发布该文章吗?" onConfirm={()=>this.ArticlePush(record)}><span><a className='operation' >发布</a></span></Popconfirm>
            <Divider type="vertical" />
            <span><a className='operation' onClick={()=>this.ArticleEdit(record)}>编辑</a></span>
            <Divider type="vertical"/>
            <span><a className='operation' onClick={()=>this.ArticleDetail(record)}>详情</a></span>
          </div>
        )
      }
    ];
    const isOrNotOptions = [{ key: '', value: '全部' },{ key: true, value: '是' }, { key: false, value: '否' }];
    const isRequiredOption = [{ key: '', value: '全部' },{ key: 2, value: '是' }, { key: 1, value: '否' }];
    const search = [
      { key: 'categoryId',      label: '所属栏目',    qFilter: 'Q=categoryid_S_LK', type:'cascader',option: []},
      { key: 'type',            label: '文章类型',    qFilter: 'Q=type_S_EQ',       type:'select',  option: []},
      { key: 'isrequireddesp',  label: '是否必修',    qFilter: 'Q=isrequired_L_EQ', type:'select',  option: isRequiredOption },
      { key: 'ispush',          label: '是否推送',    qFilter: 'Q=ispush_Z_EQ',     type:'select',  option: isOrNotOptions },
      { key: 'ishomepage',      label: '是否上首页',  qFilter: 'Q=ishomepage_Z_EQ', type:'select',  option: isOrNotOptions },
      { key: 'title',           label: '文章标题',    qFilter: 'Q=title_LK',        type:'input'},
      { key: 'createdate',      label: '创建时间',                                  type:'rangePicker' },
    ];
    const operUrl= {
        addUrl: pageJummps.newArticle,
        exportUrl:{url:'services/news/artical/export',type:'文章'},
        delUrl:{url:'services/news/artical/deleteNewsByIdList/delete',field:'idList'}
    };
    return (
     
      <div> 
          <List
              type='article'
              url='services/news/artical/newsList/get'
              onChange={this.handleChangeTabs}
              operUrl={operUrl}
              onSelect={(value)=>this.getSelectedCategory(value)}
              columns={columns}
              search={search}
          >
          </List>
      </div>
     
    );
  }
}
export default Article;