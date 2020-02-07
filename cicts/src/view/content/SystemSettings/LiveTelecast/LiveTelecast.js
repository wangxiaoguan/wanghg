
import  React,{ Component } from 'react';
import { Tabs,Form, Row, Col, Input, Button, Icon, DatePicker,Table, message, Select, Modal  } from 'antd';
import moment from 'moment';
import {GetQueryString, postService, getService, getExcelService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
// import RichText from '../../../component/richTexteditor/editor';
import RichText from '../../../component/richTexteditor/braftEditor';
import './LiveTelecast.less'
import { connect } from 'react-redux';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

@connect(//增加权限限制xwx2018/12/21
  state => ({
    powers: state.powers
  })
)

export default class LiveTelecast extends Component{
  constructor(props){
    super(props);
    this.state = {
      disableStatus:true,
      pointData:[],   //表格数据
      totalNum: 0,
      currentPage:1,
      pageSize: 10,
      selectedRowKeys:[],//表格选中的数据 id
      selectedRows:{},//表格选中的数据
      columns:[],
      dataInfo:{},//表单内容
      liveStatus:['全部','空闲', '直播', '禁用', '直播录制'],
      //更新公告 模态框
      isUpdateNewsVisible:false,
      UpdateNewsText:'',
      UpdateNewsLiveId:0,
      //查看网址 模态框
      isViewURLs:false,
      viewURLsContent:{},
      viewURLsLiveId:0,
      urlRequest:`${API_PREFIX}services/live/live/liveList/get/`,
    }
  }
  componentDidMount(){
    //获取列表初始数据
    getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}`,data=>{
      if(data.retCode === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
        });
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    });
  }
  
  componentWillReceiveProps(nextProps){
   
  }
  getUrlStr = () => {
    
    let str = '?';
    if(this.state.dataInfo.username){
      str += `Q=userName_LK=${this.state.dataInfo.username}&`
    }
    if(this.state.dataInfo.livename){
      str += `Q=liveName_LK=${this.state.dataInfo.livename}&`
    }
    if(this.state.dataInfo.liveStatus && this.state.dataInfo.liveStatus !== '全部' && this.state.dataInfo.liveStatus !== '-1'){
      str += `Q=status_EQ=${this.state.dataInfo.liveStatus}&`
    }
    str = str.substr(0,str.length-1)
    return str;
  }
  //表单赋值
  changeDataInfo = (data) => {
    this.setState({
      dataInfo:data,
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
    },()=>{
      let str = this.getUrlStr()
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.retCode === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        }else if(data.retCode === 0){
          message.error(data.retMsg);
        }else{
          message.error('数据请求失败')
        }
      });
    })
  }
  //table选中项发生变化时的回调
  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({selectedRowKeys,selectedRows});
  }
  
   //页码改变触发
  onPageChange = (current, pageSize) =>{
    let str = this.getUrlStr()
    getService(`${this.state.urlRequest}${current}/${pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
            currentPage: current,
            pageSize: pageSize,
          });
        }else if(data.status === 0){
          message.error(data.retMsg);
        }else{
          message.error('数据请求失败')
        }
      });
  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    let str = this.getUrlStr()
    getService(`${this.state.urlRequest}${current}/${pageSize}${str}`,data=>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      }else if(data.status === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    });
  }
  //重置按钮父组件
  resetBtn =() =>{
    this.setState({
      dataInfo:{},
      currentPage:1,
      pageSize:10,
    },()=>{
      let str = this.getUrlStr()
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.retCode === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        }else if(data.retCode === 0){
          message.error(data.retMsg);
        }else{
          message.error('数据请求失败')
        }
      });
    })
  }
  //删除按钮事件
  deleteBtn =() => {
    let obj = {ids:this.state.selectedRowKeys}
    postService(`${API_PREFIX}services/live/live/delete/deleteLive`,obj,data=>{
      if(data.retCode === 1){
        message.success(data.retMsg);
        this.setState({
          selectedRowKeys:[]
        },()=>{
          let str = this.getUrlStr()
          getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
            if(data.retCode === 1){
              this.setState({
                totalNum: data.root.totalNum,
                pointData: data.root.list,
              });
            }else if(data.retCode === 0){
              message.error(data.retMsg);
            }else{
              message.error('数据请求失败')
            }
          });
        })
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    })
  }
  //禁用按钮事件
  disableBtn =() => {
    let obj = {ids:this.state.selectedRowKeys}
    postService(`${API_PREFIX}services/live/live/pauseLive`,obj,data=>{
      if(data.retCode === 1){
        message.success(data.retMsg);
        this.setState({
          selectedRowKeys:[],
          disableStatus:false
        },()=>{
          let str = this.getUrlStr()
          getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
            if(data.retCode === 1){
              this.setState({
                totalNum: data.root.totalNum,
                pointData: data.root.list,
              });
            }else if(data.retCode === 0){
              message.error(data.retMsg);
            }else{
              message.error('数据请求失败')
            }
          });
        })
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    })
  }
  //禁用中恢复按钮事件
  disableRecoveryBtn =() => {
    let obj = {ids:this.state.selectedRowKeys}
    postService(`${API_PREFIX}services/live/live/resumeLive`,obj,data=>{
      if(data.retCode === 1){
        message.success(data.retMsg);
        this.setState({
          selectedRowKeys:[],
          disableStatus:true
        },()=>{
          let str = this.getUrlStr()
          getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
            if(data.retCode === 1){
              this.setState({
                totalNum: data.root.totalNum,
                pointData: data.root.list,
              });
            }else if(data.retCode === 0){
              message.error(data.retMsg);
            }else{
              message.error('数据请求失败')
            }
          });
        })
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    })
  }
  //禁用按钮 点击事件
  disableBtnClick = () => {
    if(this.state.selectedRows[0].status === 2){
      this.disableRecoveryBtn();
    }else{
      this.disableBtn();
    }
  }
  //禁言状态修改按钮事件
  noWordStatusBtn =() => {
    let obj = {ids:this.state.selectedRowKeys}
    postService(`${API_PREFIX}services/live/live/muteLive`,obj,data=>{
      if(data.retCode === 1){
        message.success(data.retMsg);
        this.setState({
          selectedRowKeys:[]
        },()=>{
          let str = this.getUrlStr()
          getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
            if(data.retCode === 1){
              this.setState({
                totalNum: data.root.totalNum,
                pointData: data.root.list,
              });
            }else if(data.retCode === 0){
              message.error(data.retMsg);
            }else{
              message.error('数据请求失败')
            }
          });
        })
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    })
  }
  //是否拉流状态修改按钮事件
  isPullStatusBtn =() => {
    let obj = {ids:this.state.selectedRowKeys}
    postService(`${API_PREFIX}services/live/live/pullLive`,obj,data=>{
      if(data.retCode === 1){
        message.success(data.retMsg);
        this.setState({
          selectedRowKeys:[]
        },()=>{
          let str = this.getUrlStr()
          getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
            if(data.retCode === 1){
              this.setState({
                totalNum: data.root.totalNum,
                pointData: data.root.list,
              });
            }else if(data.retCode === 0){
              message.error(data.retMsg);
            }else{
              message.error('数据请求失败')
            }
          });
        })
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    })
  }
  //是否发红包状态修改按钮事件
  isRedPushStatusBtn =() => {
    let obj = {ids:this.state.selectedRowKeys}
    postService(`${API_PREFIX}services/live/live/redPush`,obj,data=>{
      if(data.retCode === 1){
        message.success(data.retMsg);
        this.setState({
          selectedRowKeys:[]
        },()=>{
          let str = this.getUrlStr()
          getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
            if(data.retCode === 1){
              this.setState({
                totalNum: data.root.totalNum,
                pointData: data.root.list,
              });
            }else if(data.retCode === 0){
              message.error(data.retMsg);
            }else{
              message.error('数据请求失败')
            }
          });
        })
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    })
  }
  //更新公告 模态框
  UpdateNewsSubmit = (data) => {
    let obj = {
      id:this.state.UpdateNewsLiveId,
      notice:this.state.UpdateNewsContent
    }
    postService(`${API_PREFIX}services/live/live/update/updateNotice`,obj,data=>{
      if(data.retCode === 1){
        message.success(data.retMsg);
        this.setState({
          isUpdateNewsVisible:false,
        })
        let str = this.getUrlStr()
        getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
          if(data.retCode === 1){
            this.setState({
              totalNum: data.root.totalNum,
              pointData: data.root.list,
            });
          }else if(data.retCode === 0){
            message.error(data.retMsg);
          }else{
            message.error('数据请求失败')
          }
        })
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    })
  }
  UpdateNewsContent = (value) => {
    value = value.substring(3,value.length-4);
    this.setState({
      UpdateNewsContent:value
    })
  }
  //查看网址 模态框
  ViewURLsSubmit = () => {
    let obj = {id:this.state.viewURLsLiveId}
    postService(`${API_PREFIX}services/live/live/update/resetLive`,obj,data=>{
      if(data.retCode === 1){
        message.success(data.retMsg);
        this.setState({
          viewURLsContent:data.root.object
        })
      }else if(data.retCode === 0){
        message.error(data.retMsg);
      }else{
        message.error('数据请求失败')
      }
    })
  }
  render(){
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      type:'radio',
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const columns =[
    {
      title: '序号',
      dataIndex: 'index',
      key:'index',
      render: (text, record,index) => {
        return <div>
          <span>{(this.state.currentPage-1)*this.state.pageSize + index + 1}</span>
        </div>
      },
    },{
      title: '创建人',
      dataIndex: 'userName',
      key:'userName',
    },{
      title: '直播间名',
      dataIndex: 'liveName',
      key:'liveName',
    },{
      title: '直播间编号',
      dataIndex: 'cid',
      key:'cid',
    },{
      title: '聊天室编号',
      dataIndex: 'chatRoomId',
      key:'chatRoomId',
    },{
      title: '聊天室名',
      dataIndex: 'chatRoomName',
      key:'chatRoomName',
    },{
      title: '直播间状态',
      dataIndex: 'status',
      key:'status',
      render:(text, record)=>{
        return record.status === 0 ?'空闲':record.status === 1?'直播':record.status == 2?'禁用':'直播录制'
      }
    },{
      title: '是否发红包',
      dataIndex: 'isRedPush',
      key:'isRedPush',
      render:(text, record)=>{
        return record.isRedPush === 1 ?'可以':'不可以'
      }
    },{
      title: '是否拉流',
      dataIndex: 'isPullLive',
      key:'isPullLive',
      render:(text, record)=>{
        return record.isPullLive === 1 ?'拉流':'不拉流'
      }
    },{
      title: '聊天室状态',
      dataIndex: 'isMute',
      key:'isMute',
      render:(text, record)=>{
        return record.isMute === 1 ?'禁言':'未禁言'
      }
    },{
      title: '频道类型',
      dataIndex: 'type',
      key:'type',
      render:(text, record)=>{
        return record.type === 0 ?'rtmp':record.type === 1?'hls':'http'
      }
    },{
      title: '创建时间',
      dataIndex: 'createDate',
      key:'createDate',
    },{
      title: '操作',
      dataIndex: 'operation',
      key:'operation',
      render: (text, record,index) => {
        return <div>
          <a href={`#/SystemSettings/LiveTelecast/SendSystemMessage?id=${record.id}`} 
          style={{ display: 'inline-block' }}>发送系统消息<span style={{color:'#000'}}>&nbsp;&nbsp; </span></a>
          <a href='javascript:;' onClick={()=>{this.setState({isUpdateNewsVisible:true,UpdateNewsLiveId:record.id,UpdateNewsText:record.notice})}}
          style={{ display: 'inline-block' }}>更新通告消息<span style={{color:'#000'}}>&nbsp;&nbsp;</span></a>
          {/* <br /> */}
          <a href='javascript:;' onClick={()=>{this.setState({isViewURLs:true,viewURLsContent:record,viewURLsLiveId:record.id})}}
          style={{ display: 'inline-block' }}>查看网址<span style={{color:'#000'}}>&nbsp;&nbsp;</span></a>
          <a href={`#/SystemSettings/LiveTelecast/RoleList?id=${record.chatRoomId}`} 
          style={{ display: 'inline-block' }}>直播间角色列表</a>
        </div>;
      },
    },];
    let pagination = {
      total: this.state.totalNum,
      pageSize: this.state.pageSize,
      current: this.state.currentPage,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      showTotal: total => `共 ${total} 条`
    };
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    let powers = this.props.powers;
    let addPower=powers && powers['20012.21001.001']
    let deletePower=powers && powers['20012.21001.004']
    let updatePower=powers && powers['20012.21001.002']
    // let seePower=powers && powers['20012.21001.003']
    return <div className='LiveTelecast' style={{padding:'0 47px 0 27px',marginTop:30}}>
      <LiveContent resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} exportExcel={this.exportExcel} liveStatus={this.state.liveStatus}
      onDateChange={this.onDateChange} dataInfo={this.state.dataInfo}/>
      
      <div>
        {addPower?
        <Button style={{ width:80,height:24,borderRadius:12,margin: '40px 0 20px 0'}} type="primary"
        onClick={()=>{window.location.href="#/SystemSettings/LiveTelecast/AddLiveTelecast"}}>添加</Button>:null}
        {deletePower?
        <Button type="danger" style={{ width:80,height:24,borderRadius:12,margin: '40px 0 20px 20px'}}
        disabled={this.state.selectedRowKeys.length > 0 ? false : true} onClick={this.deleteBtn}>
          删除
        </Button>:null}
        {updatePower?
        <Button style={{ width:120,height:24,borderRadius:12,margin: '40px 0 20px 20px'}} type="primary"
          disabled={this.state.selectedRowKeys.length > 0 ? false : true} onClick={this.disableBtnClick}>
          直播中禁用/恢复
        </Button>:null}
        {updatePower?
        <Button style={{ width:110,height:24,borderRadius:12,margin: '40px 0 20px 20px'}} type="primary"
          disabled={this.state.selectedRowKeys.length > 0 ? false : true} onClick={this.noWordStatusBtn}>
          全体禁言/恢复
        </Button>:null}
        {updatePower?
        <Button style={{ width:85,height:24,borderRadius:12,margin: '40px 0 20px 20px'}} type="primary"
          disabled={this.state.selectedRowKeys.length > 0 ? false : true} onClick={this.isPullStatusBtn}>
          是/否拉流
        </Button>:null}
        {updatePower?
        <Button style={{ width:95,height:24,borderRadius:12,margin: '40px 0 20px 20px'}} type="primary"
          disabled={this.state.selectedRowKeys.length > 0 ? false : true} onClick={this.isRedPushStatusBtn}>
          是/否发红包
        </Button>:null}
        <Table  className="tabCommon" dataSource={this.state.pointData} columns={columns} 
        rowKey="id" pagination={pagination} rowSelection={rowSelection} bordered/>
      </div>
      <Modal title="更新公告"  width='60%'
        visible={this.state.isUpdateNewsVisible}
        footer={null}
        onCancel={()=>{this.setState({isUpdateNewsVisible:false})}}
      >
        <Row>
          <Col span={24}>
            <Form layout='horizontal' onSubmit={this.UpdateNewsSubmit} hideRequiredMark={true}>
              <FormItem {...formItemLayout} label='直播间公告'>
                <RichText wordCount={this.UpdateNewsContent} disabled={false} initialValue={this.state.UpdateNewsText}/>
              </FormItem>
              <FormItem {...formItemLayout}  label=' ' colon={false} style={{marginTop:10,paddingBottom:40}}>
                <Button style={{ width:80,height:24,borderRadius:12, }}  type="primary" htmlType="submit">更新</Button>
                <Button style={{ width:80,height:24,borderRadius:12,marginLeft: 15 }} onClick={()=>{this.setState({isUpdateNewsVisible:false})}}>返回</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Modal>
      <Modal title="查看网址"  width='50%'
        visible={this.state.isViewURLs}
        footer={null}
        onCancel={()=>{this.setState({isViewURLs:false})}}
      >
        <Row>
          <Col span={24}>
            <Form layout='horizontal' onSubmit={this.ViewURLsSubmit} hideRequiredMark={true}>
              <FormItem {...formItemLayout} label='推流地址：'>
                <span style={{width:'80%',border:'1px solid #ccc',display:'inline-block',border:'1px solid #eee',paddingLeft:10,lineHeight:'24px'}}>
                  {this.state.viewURLsContent.pushUrl}
                </span>
              </FormItem>
              <FormItem {...formItemLayout} label='http拉流地址：'>
                <span style={{width:'80%',border:'1px solid #ccc',display:'inline-block',border:'1px solid #eee',paddingLeft:10,lineHeight:'24px'}}>
                  {this.state.viewURLsContent.httpPullUrl}
                </span>
              </FormItem>
              <FormItem {...formItemLayout} label='hls拉流地址：'>
                <span style={{width:'80%',border:'1px solid #ccc',display:'inline-block',border:'1px solid #eee',paddingLeft:10,lineHeight:'24px'}} >
                  {this.state.viewURLsContent.hlsPullUrl}
                </span>
              </FormItem>
              <FormItem {...formItemLayout} label='rtmp拉流地址：'>
                <span style={{width:'80%',border:'1px solid #ccc',display:'inline-block',border:'1px solid #eee',paddingLeft:10,lineHeight:'24px'}}>
                  {this.state.viewURLsContent.rtmpPullUrl}
                </span>
              </FormItem>
              <FormItem {...formItemLayout}  label=' ' colon={false} style={{marginTop:10,paddingBottom:40}}>
                <Button style={{ width:120,height:24,borderRadius:12, }}  type="primary" htmlType="submit">重新获取地址</Button>
                <Button style={{ width:80,height:24,borderRadius:12,marginLeft: 15 }} onClick={()=>{this.setState({isViewURLs:false})}}>返回</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Modal>
      
    </div>
  }
}

class LiveForm extends Component{
  constructor(props){
    super(props);
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
  //重置按钮
  handleReset = () => {
    // this.setState({dataInfo:{}},() =>{console.log(this.state)})
    this.props.form.resetFields();
    this.props.resetBtn();
  }
  render(){
    //获取数据
    const { getFieldDecorator } = this.props.form;
    //任务状态下拉列表
    let liveStatusSelectList = [];
    const taskStateSelect = this.props.liveStatus;
    for (let i = 0; i < taskStateSelect.length; i++) {
      liveStatusSelectList.push(<Select.Option key={i.toString()} value={(i-1).toString()}>{taskStateSelect[i]}</Select.Option>);
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="inline" style={{borderBottom:'1px solid rgba(215,218,230,1)'}}>
          <Row>
            <Col span={6}>
              <FormItem  colon={false} label='创建人'>
                {getFieldDecorator('username', {
                  initialValue: this.props.dataInfo.username ? this.props.dataInfo.username : '',
                })(
                  <Input style={{width:200}} size='small' placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem  colon={false} label='直播间名'>
                {getFieldDecorator('livename', {
                  initialValue: this.props.dataInfo.livename ? this.props.dataInfo.livename : '',
                })(
                  <Input style={{width:200}} size='small' placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem  colon={false} label='直播间状态'>
                {getFieldDecorator('liveStatus', {
                  initialValue: this.props.dataInfo.liveStatus ? this.props.dataInfo.liveStatus : '全部',
                })(
                  <Select
                    style={{width:200}}
                    size='small'
                  >
                    {
                      liveStatusSelectList
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem style={{marginTop:10,paddingBottom:40}}>
                <Button style={{ width:80,height:24,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
                <Button style={{ width:80,height:24,borderRadius:12,marginLeft: 15 }} onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

}
const LiveContent = Form.create()(LiveForm);
