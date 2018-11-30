import React, { Component } from 'react';
import { Tabs,Button,message,Popconfirm,Divider,Steps ,Spin } from 'antd';
import {postService,getService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {CategoryAndList,List} from '../AriticleManagement/Article';
import {pageJummps} from '../PageJumps';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import moment from 'moment';
import PictureWall from './PictureWall'
const TabPane=Tabs.TabPane;
const Step = Steps.Step;
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
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{
    //文章类型   lookup字典中的数据
    getService(API_PREFIX+'services/lookup/init/newsType',data=>{
      //返回数据处理
      this.dealLookup(data);
      this.setState({newsTypeOptions:data,loading: false},()=>{
        console.log("newsTypeOptions",this.state.newsTypeOptions);
      });
    });
    //所属栏目：获取全部的栏目信息
    let categoryList=[];
    getService(API_PREFIX+'services/system/cateogry/news/artical/addNews/authCategoryTree/get',data=>{
      data.root.list.map((item,index)=>{
        if(item.name=='资讯'){
          categoryList=item.subCategoryList;
        }
      });
      this.dealCategory(categoryList);
      //将值赋给state中
      this.setState({categoryData:categoryList,loading: false},()=>{
        console.log("栏目中的数据：",this.state.categoryData);
      });
    });
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
  //Tabs标签切换的事件处理
  handleChangeTabs=(activeKey)=>{
    console.log("当前选中标签的key值",activeKey);
    this.setState({currentTabsKey:activeKey});
    if(activeKey=='1'){

      this.props.getData(API_PREFIX+`services/news/video/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=ispulish_Z_EQ=false&Q=type_I_EQ=6`);

    }else if(activeKey=='2'){

      this.props.getData(API_PREFIX+`services/news/video/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=1&Q=type_I_EQ=6`);

    }else if(activeKey=='3'){
      this.props.getData(API_PREFIX+`services/news/video/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=0&Q=type_I_EQ=6`);

    }
  }
  //选中所属栏目的事件处理  将当前选中的栏目以及其父辈级栏目一起返回
  getSelectedCategory=(value)=>{
    console.log("当前选中的栏目：",value);
    this.setState({selectedCategory:value?value.toString():''},()=>{
      console.log("当前选中的栏目selectedCategory：",this.state.selectedCategory);
    });
  }
  //操作--发布：点击事件
  issue=(record)=>{
    console.log("发布----",record);
    getService(API_PREFIX+`services/news/video/newsInfo/publish/${record.id}`,data=>{
      if(data.retCode==1){
        message.success('发布成功');
        this.props.getData(API_PREFIX+`services/news/video/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=ispulish_Z_EQ=false&Q=type_I_EQ=6`);
      }
    });
  }
  //操作--上线：点击事件
  onTheLine=(record)=>{
    console.log("上线----",this.props.pageData.query);
    getService(API_PREFIX+`services/news/video/newsInfo/onlineState/${record.id}/1`,data=>{
      if(data.retCode==1){
        message.success('上线成功');
        this.props.getData(API_PREFIX+`services/news/video/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=0&Q=type_I_EQ=6`);
        console.log("****",this.props.pageData.query);
      }
    });
  }
  //操作--下线：点击事件
  offLine=(record)=>{
    console.log("下线----",this.props.pageData.query);
    getService(API_PREFIX+`services/news/video/newsInfo/onlineState/${record.id}/0`,data=>{
      if(data.retCode==1){
        message.success('下线成功');
        this.props.getData(API_PREFIX+`services/news/video/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=onlineState_S_EQ=1&Q=type_I_EQ=6`);
        console.log("****",this.props.pageData.query);
      }
    });
  }
  //操作--编辑：点击事件
  editArticle=(record)=>{
    location.hash=pageJummps.editVideo+`?newsId=${record.id}`;
    console.log("编辑----",record);
  }
  //操作-详情：点击事件
  articleDetail=(record)=>{
    //携带id,进行页面跳转
    location.hash=pageJummps.detailVideo+`?newsId=${record.id}`;
    console.log("详情",record);
  }
  render(){
    let powers=this.props.powers;
    console.log("权限码：",powers);
    let hasAddPower=powers && powers['20003.23002.001'];
    let hasDelPower=powers && powers['20003.23002.004'];
    let hasEditPower=powers && powers['20003.23002.002'];
    let hasSearchPower=powers && powers['20003.23002.003'];
    let hasExportPower=powers && powers['20003.23002.202'];
    //设置按钮的权限
    const hasPower={
      add:hasAddPower,
      export:hasExportPower,
      delete:hasDelPower,
    }
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
      // {
      //   title:'发布时间',
      //   dataIndex:'pulishdate',
      //   key:'pulishdate',
      //   render:(data,record)=>{
      //     return moment(record.pulishdate).format('YYYY-MM-DD HH:mm');
      //   }
      // },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:250,
        fixed: 'right',
        render:(data,record)=>(
          <div>
            <Popconfirm title="确定发布该视频吗?" onConfirm={()=>this.issue(record)}>
              <a className='operation' disabled={!hasEditPower}>发布</a>
              <Divider type="vertical" />
            </Popconfirm>
           <span><a className='operation' disabled={!hasEditPower} onClick={()=>this.editArticle(record) }>编辑</a>
            <Divider type="vertical" />
              <a className='operation' disabled={!hasEditPower}onClick={()=>this.articleDetail(record)}>详情</a>
            {/*<Divider type="vertical" />*/}
           </span>
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
      },{
        title:<span>浏览数<br/>(实际点击量)</span>,
        dataIndex:'pviews',
        key:'pviews',
        width:120,
        render:(data,record)=>{
          return <a onClick={()=>location.hash=pageJummps.pageViev+`?newsId=${record.id}`} >
            {record.pviews+'('+record.realityprivews+')'}</a>;
        }
      },{
        title:'评论数',
        dataIndex:'commentcount',
        key:'commentcount',
        width:70,
        render:(data,record)=>{
          return <a onClick={()=>location.hash=pageJummps.commentv+`?newsId=${record.id}`} >
            {record.commentcount}</a>;
        }
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
      }, {
        title:'发布时间',
        dataIndex:'pulishdate',
        key:'pulishdate',
        width:150,
        render:(data,record)=>{
          return moment(record.pulishdate).format('YYYY-MM-DD HH:mm');
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
                  <Popconfirm title="确定下线该视频吗?" onConfirm={()=>this.offLine(record)}>
                    <a disabled={!hasEditPower} className='operation'>下线</a>
                    <Divider type="vertical" />
                  </Popconfirm>:
                  <Popconfirm title="确定上线该视频吗?" onConfirm={()=>this.onTheLine(record)}>
                    <a disabled={!hasEditPower} className='operation'>上线</a>
                    <Divider type="vertical" />
                  </Popconfirm>
            }
            <span>
              {/*<span style={{display:this.state.currentTabsKey=='2'?'none':'inline-block'}}>*/}
              <a className='operation' disabled={!hasEditPower} onClick={()=>this.editArticle(record)}>编辑</a>
              <Divider type="vertical" />
              {/*</span>*/}
              <a className='operation' disabled={!hasEditPower}onClick={()=>this.articleDetail(record)}>详情</a>
              </span>

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

    // const categoryidQf=`Q=categoryid_S_LK=${this.state.selectedCategory}`;
    return (
     
       <div>
         <List
             hasPower={hasPower}
             type='video'
             url='services/news/video/newsList/get'
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
export default Video;