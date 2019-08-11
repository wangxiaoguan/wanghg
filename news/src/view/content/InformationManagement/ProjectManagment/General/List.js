import React, { Component } from 'react';
import { Tabs,Select,Button,message,Cascader,Form,Popconfirm,Modal,Divider,Spin } from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {postService,getService} from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
import {pageJummps} from '../../PageJumps';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../../redux-root/action/table/table';
import moment from 'moment';
var QRCode = require('qrcode.react');
const TabPane=Tabs.TabPane;
const FormItem = Form.Item;
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
      currentTabsKey:'1',//当前选中tab的key值，页面进入时，就开始判断了，但此时还没有点击事件，故应该给默认值，即一进入页面，应该展示哪个tab
      categoryData:[],//所属栏目的数据
      selectedCategory:'',//当前选中的栏目id
      newsTypeOptions:[],//文章类型
      visible: false,
      loading: false,
    }
  }
  componentDidMount(){
    //页面相关的数据处理
    // this.dealData();
  }
  dealData=()=>{


  }
  //处理lookup字典中的数据
  dealLookup(data){
    data.map((item,index)=>{
      item.key=item.code;
      item.value=item.desp;
    });
  }
  //递归处理数据
  dealCategory(values){
    values&&values.map((item,index)=>{
      item.value=item.id+'';//将int型转换为字符串
      item.label=item.name;
      item.children=item.subCategoryList;
      if(item.subCategoryList){
        this.dealCategory(item.subCategoryList);
      }
    });
  }
  //Tabs标签切换的事件处理  需要重新调用接口请求数据
  handleChangeTabs=(activeKey)=>{
    console.log("当前选中标签的key值",activeKey);
    this.setState({currentTabsKey:activeKey});
    if(activeKey=='1'){

      this.props.getData(ServiceApi+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=ispulish_Z_EQ=false&Q=type_S_NE=6`);

    }else if(activeKey=='2'){

      this.props.getData(ServiceApi+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=1&Q=type_S_NE=6`);

    }else if(activeKey=='3'){
      this.props.getData(ServiceApi+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=0&Q=type_S_NE=6`);

    }


  }
  //选中所属栏目的事件处理  将当前选中的栏目以及其父辈级栏目一起返回
  getSelectedCategory=(value)=>{
    console.log("当前选中的栏目：",value);
    this.setState({selectedCategory:value?value[value.length-1].toString():''},()=>{
      console.log("当前选中的栏目selectedCategory：",value[value.length-1].toString());
    });
  }
  //操作--发布：点击事件
  issue=(record)=>{
    console.log("发布----",record);
    getService(ServiceApi+`services/news/artical/newsInfo/publish/${record.id}`,data=>{
      if(data.retCode==1){
        message.success('发布成功');
        this.props.getData(ServiceApi+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=ispulish_Z_EQ=false&Q=type_S_NE=6`);

      }
    });

  }
  //操作--上线：点击事件
  onTheLine=(record)=>{
    console.log("上线----",record);
    getService(ServiceApi+`services/news/artical/newsInfo/onlineState/${record.id}/1`,data=>{
      if(data.retCode==1){
        message.success('上线成功');
        this.props.getData(ServiceApi+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=0&Q=type_S_NE=6`);

      }
    });

  }
  //操作--下线：点击事件
  offLine=(record)=>{
    console.log("下线----",record);
    getService(ServiceApi+`services/news/artical/newsInfo/onlineState/${record.id}/0`,data=>{
      if(data.retCode==1){
        message.success('下线成功');
        this.props.getData(ServiceApi+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=1&Q=type_S_NE=6`);

      }
    });
  }
  //操作--编辑：点击事件
  editArticle=(record)=>{
    location.hash=pageJummps.editArticle+`?newsId=${record.id}`;
    console.log("编辑----",record);
  }
//操作-专题栏目：点击事件
  subjectColumn=(record)=>{
    console.log("专题栏目",record);
  }
  //操作-详情：点击事件
  articleDetail=(record)=>{
    //携带id,进行页面跳转
    location.hash=pageJummps.detailAriticle+`?newsId=${record.id}`;
    console.log("详情",record);
  }
  previewArticle=(record)=>{
    console.log("预览",record);
    
    postService(ServiceApi+`services/activity/activity/overview`,{"content":record.content},data=>{console.log("data.root.list",data.root.list[0])
      this.setState({

        pic:data.root.list[0]
      },() => {this.showModal()})
      //<QRCode value="http://10.110.200.62:9080/4,033ff1c74461" />,
    });
  }
   showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  render() {
    let powers=this.props.powers;
    console.log("权限码：",powers);
    const {pic} = this.state;
    //console.log("value",value)
    let hasAddPower=powers && powers['20003.23001.001'];
    let hasDelPower=powers && powers['20003.23001.004'];
    let hasEditPower=powers && powers['20003.23001.002'];
    let hasSearchPower=powers && powers['20003.23001.003'];
    let hasExportPower=powers && powers['20003.23001.202'];
    console.log("this.props.pageData.query:",this.props.pageData.query);
    /**
     * 1、三个标签页面的column一致==》使用同一个columns
     * 2、三个标签中唯一不同：
     *       T1：发布    T2：上线    T3：下线
     *  通过Tabs标签的切换点击事件获取单签tab的key，通过key区分是属于哪一个tab，从而实现不同的操作
     * 3、文章类型不同，会有不同的操作，但公有的操作有：
     *     发布 编辑  文章类型==“专栏”？“专题栏目”：“详情”
     *     文章类型==“图片、文字”？预览：‘’
     */

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
      },{
        title:'所属栏目',
        dataIndex:'categoryname',
        key:'categoryname',
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
      }
      // ,
      // {
      //   title:'发布时间',
      //   dataIndex:'pulishdate',
      //   key:'pulishdate',
      //   render:(data,record)=>{
      //     return moment(record.pulishdate).format('YYYY-MM-DD HH:mm');
      //   }
      // }
      ,{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:250,
        fixed: 'right',
        render:(data,record)=>(
          <div>
            <Popconfirm title="确定发布该文章吗?" onConfirm={()=>this.issue(record)}>
             <a className='operation' disabled={!hasEditPower}>发布</a>
              <Divider type="vertical" />
            </Popconfirm>
            <span><a className='operation' disabled={!hasEditPower} onClick={()=>this.editArticle(record)}>编辑</a>
               {/*<Divider type="vertical"  style={{display:record.type==4?'none':'inline-block'}}/>*/}
              <Divider type="vertical"/>
               </span>
            {
              record.type==10|| record.type==5?
                  <span><a className='operation' disabled={!hasSearchPower} onClick={()=>this.articleDetail(record)}>详情</a>
                    {/*<Divider type="vertical" />*/}
                  </span>:
                  record.type==1|| record.type==2?
                      (
                          <span>
                            <a className='operation' disabled={!hasSearchPower} onClick={()=>this.articleDetail(record)}>详情</a><Divider type="vertical" />
                            {record.typedesp == "文字"?<span><a className='operation' onClick={()=>this.previewArticle(record)}>预览</a>
                              {/*<Divider type="vertical" />*/}
                            </span>:null}
                          </span>
                      ):
                      <a className='operation' disabled={!hasSearchPower} onClick={() => location.hash =`${pageJummps.newsSpecial}?newsId=${record.id}`}>专题栏目</a>
            }

          </div>
        )
      }
    ];
    const anotherColumns=[
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
        fixed: 'left',
      },
      {
        title:'文章类型',
        dataIndex:'typedesp',
        key:'typedesp',
        width:80,
      },{
        title:'所属栏目',
        dataIndex:'categoryname',
        key:'categoryname',
      },{
        title:<span>浏览数<br/>(实际点击量)</span>,
        dataIndex:'pviews',
        key:'pviews',
        width:120,
        render:(data,record)=>{
           return <a onClick={()=>location.hash=pageJummps.pageVies+`?newsId=${record.id}`} >
             {record.pviews+'('+record.realityprivews+')'}</a>;
        }
      },{
        title:'评论数',
        dataIndex:'commentcount',
        key:'commentcount',
        width:70,
        render:(data,record)=>{
          return <a onClick={()=>location.hash=pageJummps.comment+`?id=${record.id}&targetType=2`} >
            {record.commentcount}</a>;
        }
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
      }, {
        title:'发布时间',
        dataIndex:'pulishdate',
        key:'pulishdate',
        width:150,
        render:(data,record)=>{
          if(record.pulishdate){
            return moment(record.pulishdate).format('YYYY-MM-DD HH:mm');
          }else{
            return '';
          }
        }
      },{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:250,
        fixed: 'right',
        render:(data,record)=>(
            <div>
            {
                this.state.currentTabsKey=='2'?
                    <Popconfirm title="确定下线该文章吗?" onConfirm={()=>this.offLine(record)}>
                <a className='operation'  disabled={!hasEditPower} >下线</a>
                      <Divider type="vertical" />
                    </Popconfirm>:
                    <Popconfirm title="确定上线该文章吗?" onConfirm={()=>this.onTheLine(record)}>
                <a className='operation'  disabled={!hasEditPower} >上线</a>
                      <Divider type="vertical" />
                    </Popconfirm>
          }
              {/*style={{display:this.state.currentTabsKey=='2'?'none':'inline-block'}}*/}
          <span
          ><a className='operation' disabled={!hasEditPower} onClick={()=>this.editArticle(record)}>编辑</a>
            {/*<Divider type="vertical"  style={{display:record.type==4?'none':'inline-block'}}/>*/}
            <Divider type="vertical"/>
          </span>

      {
        record.type==10|| record.type==5?
            (<span><a className='operation' disabled={!hasSearchPower} onClick={()=>this.articleDetail(record)}>详情</a>
              {/*<Divider type="vertical" />*/}
            </span>):
          record.type==1|| record.type==2?
              (
                  <span>
                            <a className='operation' disabled={!hasSearchPower} onClick={()=>this.articleDetail(record)}>详情</a><Divider type="vertical" />
                    {record.typedesp == "文字"?<span><a className='operation' onClick={()=>this.previewArticle(record)}>预览</a>
                      {/*<Divider type="vertical" />*/}
                            </span>:null}
                          </span>
              ):
              <a className='operation' disabled={!hasSearchPower} onClick={() => location.hash =`${pageJummps.newsSpecial}?newsId=${record.id}`}>专题栏目</a>
        }
        </div>
     )
      }
    ];
    const isOrNotOptions = [{ key: '', value: '全部' },{ key: true, value: '是' }, { key: false, value: '否' }];
    const isRequiredOption = [{ key: '', value: '全部' },{ key: 2, value: '是' }, { key: 1, value: '否' }];
    const search = [
      { key: 'categoryId',label : '所属栏目', qFilter: 'Q=categoryid_S_LK',type:'cascader',option: this.state.categoryData},
      { key: 'ispush', label: '是否推送', qFilter: 'Q=ispush_Z_EQ', type: 'select', option: isOrNotOptions },
      { key: 'title', label: '专题名称',qFilter:'Q=title_LK',type:'input'},
      { key: 'createdate', label: '创建时间', type: 'rangePicker' },
    ];
    //用于给子组件传入相关操作的url   新增：addUrl    导出：exportUrl   删除：delUrl
    const operUrl= {
         addUrl: pageJummps.newArticle,
       exportUrl:{
           url:'services/news/artical/export',
           type:'文章',
       },
    delUrl:{
        url:'services/news/artical/deleteNewsByIdList/delete',
       field:'idList',
     }
       };
   //设置按钮的权限
   const hasPower={
     add:hasAddPower,
     export:hasExportPower,
     delete:hasDelPower,
   }
    return (
    
      <div>
         <Modal
          title="文章预览"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className="modal"
        >
          <QRCode value={pic} />
        </Modal>  
       <List
           hasPower={hasPower}
           type='article'
           url='services/news/artical/newsList/get'
           onChange={this.handleChangeTabs}
           operUrl={operUrl}
           onSelect={(value)=>this.getSelectedCategory(value)}
           columns={columns}
           anotherColumns={anotherColumns}
           search={search}
       ></List>
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
    //页面相关的数据处理            //201811071130  不必要的代码注释处理
     // this.dealData();
  }
  dealData=()=>{

  }
  //递归处理数据
  dealCategory(values){
    values&&values.map((item,index)=>{
      item.value=item.id+'';//将int型转换为字符串
      item.label=item.name;
      item.children=item.subCategoryList;
      if(item.subCategoryList){
        this.dealCategory(item.subCategoryList);
      }
    });
  }
  render(){
    const propsData=this.props;
    console.log('hasPower',propsData.hasPower);
    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 12},
        sm: { span: 2},
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };
    return( 
      
        <div>
            <TableAndSearch
              url={this.props.url}
              urlfilter={this.props.urlfilter}
              columns={this.props.columns}
              search={this.props.search}
              addBtn={this.props.hasPower.add?{order:1,url:propsData.operUrl.addUrl }:null }
              exportBtn={this.props.hasPower.export?{order:2,url:propsData.operUrl.exportUrl.url,type:propsData.operUrl.exportUrl.type}:null}
              deleteBtn={this.props.hasPower.delete?{order:3,url:propsData.operUrl.delUrl.url,field:propsData.operUrl.delUrl.field}:null}
              scroll={{width:1600}}>
            </TableAndSearch>
        </div>
    );
  }
}

export class List extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const props=this.props;
    console.log("operUrl:",props.operUrl);
    return (
          <div>
            <Tabs type="card" onChange={props.onChange} defaultActiveKey="1">
              <TabPane
                  tab="未发布"
                  key="1"
              >
                <CategoryAndList
                    hasPower={props.hasPower}
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
                    hasPower={props.hasPower}
                    url={props.url}
                    operUrl={props.operUrl}
                    onSelect={props.onSelect}
                    columns={props.anotherColumns}
                    search={props.search}
                    urlfilter={props.type==="article"?'Q=onlineState_S_EQ=1&Q=type_S_NE=6':'Q=onlineState_S_EQ=1&Q=type_S_EQ=6'}
                />
              </TabPane>
              <TabPane
                  tab="已下线"
                  key="3"
              >
                <CategoryAndList
                    hasPower={props.hasPower}
                    url={props.url}
                    operUrl={props.operUrl}
                    onSelect={props.onSelect}
                    columns={props.anotherColumns}
                    search={props.search}
                    urlfilter={props.type==="article"?'Q=onlineState_S_EQ=0&Q=type_S_NE=6':'Q=onlineState_S_EQ=0&Q=type_S_EQ=6'}
                />
              </TabPane>
            </Tabs>
          </div>   
    );
  }
}
export default Article;