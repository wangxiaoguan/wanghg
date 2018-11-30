import React, { Component } from 'react';
import { Tabs,Select,Button,message,Cascader,Form,Popconfirm,Modal,Divider,Spin,Table } from 'antd';
import {postService,getService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import {url} from '../url';
class DepartmentL extends Component {
  constructor(props){
    super(props);
    this.state={
      loading: false,
    }
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData(1,10);
  }
  dealData=(currentPage,pageSize)=>{
    //文章类型   lookup字典中的数据
    this.setState({ loading: true });
    //所属栏目：获取全部的栏目信息
    let categoryList=[];
    getService(API_PREFIX+ url.DHdatalist + '/'+ currentPage + "/"+ pageSize +'?Q=ispulish_Z_EQ=false&Q=type_S_NE=6',data=>{
      if(data.retCode===1){
        //将值赋给state中
        const dataSource = data.root&&data.root.list;
        this.setState({dataSource,totalNum:data.root.totalNum,loading:false});
      }else{
        message.error(data.retMsg);
        this.setState({ loading: false });
      }      
    });
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
    getService(API_PREFIX+`services/news/artical/newsInfo/publish/${record.id}`,data=>{
      if(data.retCode==1){
        message.success('发布成功');
        this.props.getData(API_PREFIX+`services/news/artical/newsList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=ispulish_Z_EQ=false&Q=type_S_NE=6`);
      }
    });
  }

  // //操作--编辑：点击事件
  // editArticle=(record)=>{
  //   location.hash=pageJummps.editArticle+`?newsId=${record.id}`;
  //   console.log("编辑----",record);
  // }
//操作-专题栏目：点击事件
  subjectColumn=(record)=>{
    console.log("专题栏目",record);
  }

  onPageChange = (currentPage, pageSize) => {
    console.log(currentPage,pageSize)
    this.setState({ currentPage, pageSize });
    this.dealData(currentPage,pageSize);
  };
  onPageSizeChange = (currentPage, pageSize) => {
    console.log(currentPage,pageSize)
    this.setState({ currentPage, pageSize });
    this.dealData(currentPage,pageSize);
  };

  render() {
    // let powers=this.props.powers;
    // console.log("权限码：",powers);
    const {totalNum,dataSource,pageSize, currentPage} = this.state;
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: pageSize,
      current: currentPage,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      pageSizeOptions: ['10', '15', '20'],
    };

    const rowSelection = {
      type:this.props.type=='radio'?'radio':'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys)
      },
      getCheckboxProps: this.props.getCheckboxProps ? this.props.getCheckboxProps : '',
    };


    // let hasAddPower=powers && powers['20003.23001.001'];
    // let hasDelPower=powers && powers['20003.23001.004'];
    // let hasEditPower=powers && powers['20003.23001.002'];
    // let hasSearchPower=powers && powers['20003.23001.003'];
    // let hasExportPower=powers && powers['20003.23001.202'];

    const columns=[
      {
        title:'专题名称（部门名称）',
        dataIndex:'publishName',
        key:'publishName',
        width:150,
      },
      {
        title:'浏览数（实际点击量）',
        dataIndex:'title',
        key:'title',
        width:150,
      },
      {
        title:'评论数',
        dataIndex:'typedesp',
        key:'typedesp',
        width:80,
      },
      {
        title:'是否启用',
        dataIndex:'isrequireddesp',
        key:'isrequireddesp',
        width:80,
      }
      ,{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:200,
        render:(data,record)=>(
          <div>
             <a className='operation' onClick={()=>this.editArticle(record)}>禁用</a>
              <Divider type="vertical" />
            <a className='operation' onClick={()=>this.editArticle(record)}>设置部门封面</a>
              <Divider type="vertical"/>
              <a className='operation'>专题栏目</a>
          </div>
        )
      }
    ];
   //设置按钮的权限
  //  const hasPower={
  //    add:hasAddPower,
  //    export:hasExportPower,
  //    delete:hasDelPower,
  //  }
    return (
     
        <div style={{marginTop:'40px'}}>
          <Table rowKey={'id'} bordered columns={columns} dataSource={dataSource} pagination={pagination} rowSelection={rowSelection} ></Table>
        </div>
     
    );
  }
}

export default DepartmentL;