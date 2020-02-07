import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Select,Modal, message  } from 'antd';
import './LiveTelecast.less'
import {GetQueryString, postService, getService, getExcelService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';

const FormItem = Form.Item;

export default class SendSystemMessage extends Component{
  constructor(props){
    super(props);
    const param = this.props.location.search.replace('?','').split('&');
    const chatRoomId = decodeURIComponent(param[0].split('=')[1]);
    this.state = {
      name:'',
      visible:false,
      pointData:[],
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      totalNumModal:0,
      pageSizeModal: 10,
      currentPageModal: 1,
      dataInfo:{},
      chatRoomId,
      dateData:{},
      selectedRowKeys:[],
      selectedRowKeysModal:[],
      selectedRowsModal:[],
      urlRequest:``,
      pointDataModal:[],
      chooseUserText:'',//选择用户 输入框
      urlRequestKey:`${API_PREFIX}services/live/live/roleList/get/`,
    }
  }
  componentWillMount(){
 
  }
  componentDidMount(){
    //获取列表初始数据
    getService(`${this.state.urlRequestKey}${this.state.chatRoomId}/${this.state.currentPage}/${this.state.pageSize}`,data=>{
      if(data.retCode === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
        });
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }
    });
  }
  //选择用户
  chooseUser = ()=>{
    this.setState({
      visible:true,
      pointDataModal:[],
      totalNumModal:0,
    },()=>{
      getService(`${API_PREFIX}services/live/live/userList/get/${this.state.currentPageModal}/${this.state.pageSizeModal}?Q=lastname_LK=${this.state.chooseUserText}`,data=>{
        if(data.retCode === 1){
          this.setState({
            totalNumModal: data.root.totalNum,
            pointDataModal: data.root.list,
          });
        }else if(data.retCode === 0){
          message.error(data.retMsg);
        }
      });
    })
  }
  //用户名输入框change事件
  userNameChange = (e) => {
    this.setState({chooseUserText:e.target.value,},()=>{
      getService(`${API_PREFIX}services/live/live/userList/get/${this.state.currentPage}/${this.state.pageSize}?Q=lastname_LK=${this.state.chooseUserText}`,data=>{
        if(data.retCode === 1){
          this.setState({
            totalNumModal: data.root.totalNum,
            pointDataModal: data.root.list,
          });
        }else if(data.retCode === 0){
          message.error(data.retMsg);
        }
      });
    })
  }
  //新增角色 表单赋值
  changeDataInfo = (data) => {
    if(!this.state.dataInfo.name){
      message.warning('请选择用户')
    }else{
      this.setState({
        dataInfo:{
          roleId:data.roleId==='管理员'?1:data.roleId,
          chatRoomId:this.state.chatRoomId,
          userName:this.state.selectedRowsModal[0].lastname,
          userId:this.state.selectedRowsModal[0].userId
        },
        pageSize: 10,
        currentPage: 1,
      },()=>{
        let IsExistData={
          userId:this.state.selectedRowsModal[0].userId,
          chatRoomId:this.state.chatRoomId,
        }
        postService(`${API_PREFIX}services/live/live/roleVal`,IsExistData,data=>{
          if(data.retCode === 1){
            postService(`${API_PREFIX}services/live/live/add/insertRole`,this.state.dataInfo,data=>{
              if(data.retCode === 1){
                message.success(data.retMsg);
                getService(`${this.state.urlRequestKey}${this.state.chatRoomId}/${this.state.currentPage}/${this.state.pageSize}`,data=>{
                  if(data.retCode === 1){
                    this.setState({
                      totalNum: data.root.totalNum,
                      pointData: data.root.list,
                      selectedRowsModal:[],
                    });
                    this.state.selectedRowKeysModal.length=0
                  }else if(data.retCode === 0){
                    message.error(data.retMsg);
                  }
                });
              }else if(data.retCode === 0){
                message.error(data.retMsg);
              }
            });
          }else if(data.retCode === 0){
            message.error(data.retMsg);
          }
        })
      })
    }
  }
  //页码改变触发
  onPageChange = (current, pageSize) =>{
    //获取列表初始数据
    getService(`${this.state.urlRequestKey}${this.state.chatRoomId}/${current}/${pageSize}`,data=>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage:current,
          pageSize:pageSize,
        });
      }else if(data.status === 0){
        message.error(data.retMsg);
      }
    });
  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    //获取列表初始数据
    getService(`${this.state.urlRequestKey}${this.state.chatRoomId}/${current}/${pageSize}`,data=>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage:current,
          pageSize:pageSize,
        });
      }else if(data.status === 0){
        message.error(data.retMsg);
      }
    });
  }
  //table选中项发生变化时的回调
  onSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
  }

  //页码改变触发
  onPageChangeModal = (current, pageSize) =>{
    getService(`${API_PREFIX}services/live/live/userList/get/${current}/${pageSize}?Q=lastname_LK=${this.state.chooseUserText}`,data=>{
      if(data.status === 1){
        this.setState({
          totalNumModal: data.root.totalNum,
          pointDataModal: data.root.list,
          currentPageModal: current,
          pageSizeModal: pageSize,
        });
      }else if(data.status === 0){
        message.error(data.retMsg);
      }
    });
  }
  //页面大小改变触发
  onPageSizeChangeModal = (current, pageSize) => {
    getService(`${API_PREFIX}services/live/live/userList/get/${current}/${pageSize}?Q=lastname_LK=${this.state.chooseUserText}`,data=>{
      if(data.status === 1){
        this.setState({
          totalNumModal: data.root.totalNum,
          pointDataModal: data.root.list,
          currentPageModal: current,
          pageSizeModal: pageSize,
        });
      }else if(data.status === 0){
        message.error(data.retMsg);
      }
    });
  }
  //modal table选中项发生变化时的回调
  onSelectChangeModal = (selectedRowKeysModal,selectedRowsModal) => {
    this.setState({selectedRowKeysModal,selectedRowsModal});
  }
  //点击modal 确定
  handleOk = () => {
    if(this.state.selectedRowKeysModal.length == 0){
      message.error('请选择用户');
    }else{
      this.setState({
        dataInfo:{
          ...this.state.dataInfo,
          name:this.state.selectedRowsModal[0].lastname,
          userId:this.state.selectedRowsModal[0].userId
        },
        visible:false,
      })
    }
  }
  //点击modal 取消
  handleCancel = () => {
    this.setState({
      visible:false,
    })
  }
  //删除角色
  deleteUser = (id) => {
    let ids = {
      ids:[id]
    }
    postService(`${API_PREFIX}services/live/live/delete/deleteLiveRole`,ids,data=>{
      if(data.retCode === 1){
        message.success(data.retMsg);
        getService(`${this.state.urlRequestKey}${this.state.chatRoomId}/${this.state.currentPage}/${this.state.pageSize}`,data=>{
          if(data.retCode === 1){
            this.setState({
              totalNum: data.root.totalNum,
              pointData: data.root.list,
            });
          }else if(data.retCode === 0){
            message.error(data.retMsg);
          }
        });
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }
    });
  }
  render(){
    const { selectedRowKeys, selectedRowKeysModal } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key:'index',
        render: (text, record,index) => {
          return <div>
            <span>{(this.state.currentPage-1)*(this.state.pageSize) + index + 1}</span>
          </div>
        },
      },{
        title: '用户ID',
        dataIndex: 'userId',
        key:'userId',
      },{
        title: '用户名',
        dataIndex: 'userName',
        key:'userName',
      },{
        title: '角色',
        dataIndex: 'topicName',
        key:'topicName',
        render: (text, record) => {
          return record.roleId === 0 ?'其他':'管理员'
        },
      },{
        title: '创建时间',
        dataIndex: 'createDate',
        key:'createDate',
      },{
        title: '操作',
        dataIndex: 'operation',
        key:'operation', 
        render: (text, record) => {
          return <div>
            <a href='javascript:;' onClick={()=>{this.deleteUser(record.id)}}
              style={{ display: 'inline-block',color:'red' }}>删除</a>
          </div>
        },
      },]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    let pagination = {
      total: this.state.totalNum,
      pageSize: this.state.pageSize,
      current: this.state.currentPage,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
    };

    const columnsModal = [
      {
        title: '用户ID',
        dataIndex: 'userId',
        key:'userId',
      },{
        title: '姓名',
        dataIndex: 'lastname',
        key:'lastname',
      },{
        title: '手机号',
        dataIndex: 'mobile',
        key:'mobile',
    },]
    const rowSelectionModal = {
      type:'radio',
      selectedRowKeysModal,
      onChange: this.onSelectChangeModal,
    };
    let paginationModal = {
      total: this.state.totalNumModal,
      pageSize: this.state.pageSizeModal,
      current: this.state.currentPageModal,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onPageChangeModal,
      onShowSizeChange: this.onPageSizeChangeModal,
    };
    
    return (<div className='liveRoleList' style={{padding:'22px 26px 50px',}}>
        <span style={{marginBottom:40,fontSize:'2.2rem',display:'block'}}>添加角色</span>

        <RoleContent selectContent={this.state.selectContent} changeDataInfo={this.changeDataInfo} name={this.state.name}
        category={this.state.category} taskType={this.state.taskType} taskState={this.state.taskState}  dataInfo={this.state.dataInfo} chooseUser={this.chooseUser}/>
      
        <span style={{marginBottom:10,fontSize:'1.5rem',display:'block',padding:'20px 60px 0 0',borderTop:'1px solid #ccc'}}>角色列表</span>
        <Table  className="tabCommon" dataSource={this.state.pointData}  columns={columns} 
          rowKey="index" pagination={pagination} rowSelection={rowSelection}  bordered/>
        <Row type='flex' justify='center' style={{marginTop:10,marginRight:60}}>
          <Button style={{ width:90,height:24,borderRadius:8,}}  type="primary" 
            onClick={()=>{window.location.href='#/SystemSettings/LiveTelecast'}}
          >返回
          </Button>
        </Row>
        <Modal className='addLiveModal' title="添加用户" okText='添加' width='50%'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        > 
          <Input style={{width:200,marginBottom:10}} onChange={this.userNameChange} size='small' placeholder='请输入姓名'/>
          <Table  className="tabCommon" dataSource={this.state.pointDataModal} columns={columnsModal} 
          rowKey="userId" pagination={paginationModal} rowSelection={rowSelectionModal} bordered/>
        </Modal>
    </div>)
  }
}

class RoleForm extends Component{
  constructor(props){
    super(props)
  }
  handleSubmit= e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) =>{
      if(err){
        return;
      }
      this.props.changeDataInfo(fieldsValue)
    })
  }
  render(){
    //获取表单数据
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 4}, 
      wrapperCol: { span: 20 }
    };
    return <div style={{paddingBottom:25,borderBottom:'1px solid rgba(229,229,229,1)'}}>
    <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="inline" >
      <Row>
        <Col span={9}>
          <FormItem {...formItemLayout} className='roleUser'  colon={false} label='用户：'>
            <div>
              {getFieldDecorator('name', {
                initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
              })(
                <Input disabled style={{width:200}} size='small'/>
              
              )} 
              <Button style={{ width:80,height:24,marginLeft:20 }}  type="primary" onClick={this.props.chooseUser}>选择用户</Button>
            </div>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formItemLayout}  colon={false} label='角色：'>
            { getFieldDecorator('roleId', {
              initialValue: this.props.dataInfo.typeid ? this.props.dataInfo.typeid : '管理员',
            })(
              <Select
                style={{width:200}}
                size='small'
              >
                <Select.Option key='1' value='1'>管理员</Select.Option>
                <Select.Option key='0' value='0'>其他</Select.Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem >
            <Button style={{ width:80,height:24,borderRadius:12, }}  type="primary" htmlType="submit" disabled={!Boolean(this.props.dataInfo.name)}>添加</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
  }
}
const RoleContent = Form.create()(RoleForm);
