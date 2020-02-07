import React, { Component } from 'react';
import { Tabs,Select,Button,message,Cascader,Form,Popconfirm,Modal,Divider,Spin,Table,Message } from 'antd';
import {postService,getService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {url} from './url';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
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
      loading: false,
      currentPage:1,
      pageSize:10,
      selectedRowKeys:[],
      selectedRows: [],
      visible:false
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
    getService(API_PREFIX+ `services/servicemanager/event/EventShow/${currentPage}/${pageSize}`,data=>{
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

  onPageChange = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize });
    this.dealData(currentPage,pageSize);
  };
  onPageSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize });
    this.dealData(currentPage,pageSize);
  };

  add=()=>{
    location.hash='#/Service/RemindList/add'
  }

  deleteData = (url) => {
    let {currentPage,pageSize, selectedRows}=this.state;
    let idList = []
    selectedRows.forEach(item => {
      idList.push(item.id)
    })
    let body =  {['idList']: idList}
    postService(API_PREFIX + `${url}`,body,data => {
        if (data.retCode === 1) {
          Message.success('删除成功!');
          this.dealData(currentPage,pageSize);
          this.setState({
            selectedRows:[],
            selectedRowKeys: [],
            visible:false
          });
        } else {
          Message.error(data.retMsg);
        }
      }
    );
  }

  handleVisibleChange = () => {
    let {selectedRowKeys}=this.state

    // Determining condition before show the popconfirm.
    console.log(selectedRowKeys);
    if (selectedRowKeys.length===0) {
      this.setState({
        visible:false
      })
    }else{
      this.setState({
        visible:true
      })
    }
  }

  Popcancel=()=>{
    this.setState({ visible: false });
  }

  render() {
    let powers = this.props.powers;
      console.log('权限码', powers);
      let hasAddPower = powers && powers['20888.22002.001'];
      let hasDelPower = powers && powers['20888.22002.004'];
      let hasEditPower = powers && powers['20888.22002.002'];
      let hasSearchPower = powers && powers['20888.22002.003'];
      let hasImportPower=powers&&powers['20888.22005.201'];
    const {totalNum,dataSource,pageSize, currentPage,selectedRowKeys,selectedRows} = this.state;
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: pageSize,
      current: currentPage,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      pageSizeOptions: ['10', '20', '30','40'],
      showTotal: total => `共 ${total} 条`
    };

    const rowSelection = {
      selectedRowKeys,
      type:this.props.type=='radio'?'radio':'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRows)
        this.setState({selectedRowKeys,selectedRows})
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
        title:'提醒内容',
        dataIndex:'content',
        key:'content',
        width:200,
      },
      {
        title:'提醒时间',
        dataIndex:'remindTime',
        key:'remindTime',
        width:150,
      },
      {
        title:'提醒方式',
        dataIndex:'remindType',
        key:'remindType',
        width:80,
        render: (text, record) => {
          return <span>
            {record.remindType===1?'消息推送':'短信'}
          </span>;
        },
      },
      {
        title:'状态',
        dataIndex:'status',
        key:'status',
        width:80,
        render:(data,record)=>(
          <div>
            {record.status===0 ? 
              new Date(record.remindTime)>new Date()?<span>未启用</span>:<span>已失效</span> 
            : null}

            {record.status===1?<span>启用</span>:null}
            {record.status===2?<span>已完成</span>:null}
          </div>
        )
      }
      ,{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:150,
        render:(data,record)=>{
            if(record.status===2){
                return (<div>
                    <span style={{color:'#ccc',cursor:'pointer'}}>编辑</span>
                        {/* <Divider type="vertical"/>
                        <a href={`#/InformationManagement/project/topic?newsId=${record.id}`} className='operation'>专题栏目</a> */}
                    </div>) 
                    
            }else if(record.status===0&&new Date(record.remindTime)<new Date()){
                return (<div>
                  <span style={{color:'#ccc',cursor:'pointer'}}>编辑</span>
                      {/* <Divider type="vertical"/>
                      <a href={`#/InformationManagement/project/topic?newsId=${record.id}`} className='operation'>专题栏目</a> */}
                  </div>)
            } else{
                return (<div>
                    <a className='operation' onClick={()=>location.hash=`#/Service/RemindList/editor?newsId=${record.id}`}>编辑</a>
                        {/* <Divider type="vertical"/>
                        <a href={`#/InformationManagement/project/topic?newsId=${record.id}`} className='operation'>专题栏目</a> */}
                    </div>)
            }
        }
      }
    ];
   //设置按钮的权限
  //  const hasPower={
  //    add:hasAddPower,
  //    export:hasExportPower,
  //    delete:hasDelPower,
  //  }
    return (
      <Spin spinning={this.state.loading}>
        <div style={{marginTop:'40px'}}>
            <Button className="queryBtn" type="primary" style={{ order: 1,marginLeft:'35px' }} onClick={this.add}>新建</Button>
            <Popconfirm title="确定删除所选项吗？" okText="确定" cancelText="取消" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}  onCancel={this.Popcancel} onConfirm={()=>this.deleteData("services/servicemanager/event/deleteEvent")}>
                <Button type="primary" className="deleteBtn"  style={{ order: 1 }} disabled={selectedRowKeys.length <= 0}>
                    删除
                </Button>
            </Popconfirm>
          <Table style={{marginTop:'20px'}} rowKey={'eventId'} bordered columns={columns} dataSource={dataSource} pagination={pagination} rowSelection={rowSelection} ></Table>
        </div>
      </Spin>
    );
  }
}

export default DepartmentL;