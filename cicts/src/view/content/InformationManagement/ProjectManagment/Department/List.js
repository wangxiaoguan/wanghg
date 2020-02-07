import React, { Component } from 'react';
import {Button,message,Message,Popconfirm,Divider,Spin,Table} from 'antd';
import {postService,getService,GetQueryString} from '../../../myFetch';
import {pageJummps} from '../../PageJumps';
import API_PREFIX from '../../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../../redux-root/action/table/table';

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
class DepartmentL extends Component {
  constructor(props){
    super(props);
    this.state={  
      back:GetQueryString(location.hash,['back']).back||0,
      loading: false,
      currentPage:1,
      pageSize:10,
      modal_visible:false,
      isCheck:false,
      previewVisible:false,
      fileList:[],
      previewImage: '',
      selectedRowKeys:[],
      visible:false,
    };
  }
  componentDidMount(){
    this.dealData(1,10);
  }
  dealData=(page,pageSize)=>{
    this.setState({ loading: true });
    getService(API_PREFIX+ `${pageJummps.DepartmentList}/${page}/${pageSize}?Q=type=7`,data=>{
      if(data.status===1){
        const dataSource = data.root&&data.root.list;
        this.setState({dataSource,totalNum:data.root.totalNum,loading:false});
      }else{
        message.error(data.errorMsg);
        this.setState({ loading: false });
      }      
    });
  }

  //选中栏目
  getSelectedCategory=(value)=>{
    this.setState({selectedCategory:value?value[value.length-1].toString():''});
  }

  //禁用
  forbidden=(record)=>{
    let {currentPage,pageSize} = this.state;
    let onlineState=record.onlineState === 0?1:0;
    postService(API_PREFIX+`${pageJummps.DepartmentUse}/${record.id}/${onlineState}`,{},data=>{
      if(data.status===1){
        message.success('操作成功');
        this.dealData(currentPage,pageSize);
      }else{
        message.error(data.errorMsg);
      }   
    });
  }
  //专题栏目
  subjectColumn=(record)=>{
    location.hash=pageJummps.editArticle+`?newsId=${record.id}`;
  }

  onPageChange = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize });
    this.dealData(currentPage,pageSize);
  };
  onPageSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize });
    this.dealData(currentPage,pageSize);
  };

  deleteData = (url) => {
    let { currentPage, pageSize } = this.state;
    let body =this.state.selectedRowKeys;
    postService(API_PREFIX + pageJummps.DepartmentDelete,body,data => {
        if (data.status === 1) {
            Message.success('删除成功!');
          this.setState({
            selectedRowKeys:[],visible:false,
          });

          this.dealData(currentPage,pageSize);
        } else {
          Message.error(data.errorMsg);
          this.setState({
            visible:false,
          });
        }
      }
    ); 
  }
  handleVisibleChange = () => {
    let {selectedRowKeys}=this.state;
    if (selectedRowKeys.length===0) {
      this.setState({
        visible:false,
      });
    }else{
      this.setState({
        visible:true,
      });
    }
  }
  Popcancel=()=>{
    this.setState({ visible: false });
  }
  render() {
    let powers=this.props.powers;
    let hasAddPower=powers && powers['20001.21607.001'];//新建
    let hasDelPower=powers && powers['20001.21607.004'];//删除
    let hasEditPower=powers && powers['20001.21607.002'];//编辑
    let hasSearchPower=powers && powers['20001.21607.003'];//查询
    let hasDisableEnablation=powers && powers['20001.21607.006'];//禁用、启用

    const {totalNum,dataSource,pageSize, currentPage,isCheck,fileList,pictureUrl,selectedRowKeys} = this.state;
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: pageSize,
      current: currentPage,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      pageSizeOptions: ['10', '20', '30','40'],
    };

    const rowSelection = {
      selectedRowKeys,
      type:this.props.type=='radio'?'radio':'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        });
      },
      getCheckboxProps: this.props.getCheckboxProps ? this.props.getCheckboxProps : '',
    };


    const columns=[
      {
        title:'专题名称（部门名称）',
        dataIndex:'title',
        key:'title',
        width:150,
      },
      {
        title:'浏览数',
        dataIndex:'pviews',
        key:'pviews',
        width:150,
        render: (text, record) => {
          return <a className='operation' href={`#/InformationManagement/Project/PageView?id=${record.id}&type=5`}>{record.viewCount}</a>;
        },
      },
      {
        title:'评论数',
        dataIndex:'commentCount',
        key:'commentCount',
        width:80,
        render: (text, record) => {
          return <a className='operation' href={`#/InformationManagement/Project/PageComment?id=${record.id}&type=5`}>
            {record.commentCount}
          </a>;
        },
      },
      {
        title:'是否启用',
        dataIndex:'onlineState',
        key:'onlineState',
        width:80,
        render:(data,record)=>{
          return <span>{record.onlineState?'是':'否'}</span>;
        },
      }
      ,{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:200,
        render:(data,record)=>(
            <div>
              {
                hasDisableEnablation?(
                  <a className='operation' onClick={()=>this.forbidden(record)}>{record.onlineState?'禁用':'启用'}</a>
                ):null
              }
                {
                  hasEditPower?(
                    <span>
                        <Divider type="vertical" />
                        <a className='operation' onClick={()=>location.hash=`#/InformationManagement/project/editor?newsId=${record.id}&isEdit=true`}>编辑</a>
                    </span>
                  ):null
                }
                {
                  hasSearchPower?(
                    <span>
                      <Divider type="vertical"/>
                      <a href={`#/InformationManagement/project/topic?newsId=${record.id}&type=department`} className='operation'>专题栏目</a>
                    </span>
                  ):null
                }
            </div>
        ),
      },
    ];

    return (
      <Spin spinning={this.state.loading}>
        <div style={{marginTop:'40px'}}>
          {
            hasAddPower?(
              <Button className="queryBtn" type="primary" style={{ order: 1,marginLeft:'35px' }} onClick={()=>location.hash='#/InformationManagement/project/addG?isEdit=false'}>新建</Button>
            ):null
          }
          {
            hasDelPower?(
              <Popconfirm title="确定删除所选项吗？" okText="确定"  visible={this.state.visible} onVisibleChange={this.handleVisibleChange} onCancel={this.Popcancel} onConfirm={()=>this.deleteData("services/web/news/special/delete")} cancelText="取消">
                <Button type="primary" className="deleteBtn"  style={{ order: 1 }} disabled={selectedRowKeys.length <= 0}>
                    删除
                </Button>
              </Popconfirm>
            ):null
          }
          <Table style={{marginTop:'20px'}} rowKey={'id'} bordered columns={columns} dataSource={dataSource} pagination={pagination} rowSelection={rowSelection}  />
          {
            this.state.back?<center><Button onClick={()=>{history.back()}}>返回</Button></center>:null
          }
        </div>
      </Spin>
    );
  }
}

export default DepartmentL;