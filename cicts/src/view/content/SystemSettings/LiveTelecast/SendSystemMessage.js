import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Select,message,Modal  } from 'antd';
import './LiveTelecast.less'
import {GetQueryString, postService, getService, getExcelService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';

const FormItem = Form.Item;

export default class SendSystemMessage extends Component{
  constructor(props){
    super(props);
    const param = this.props.location.search.replace('?','').split('&');
    const liveId = decodeURIComponent(param[0].split('=')[1]);
    const userId = sessionStorage.getItem('id')
    this.state = {
      time:'',
      pointData:[],
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      dataInfo:{},
      liveId,
      userId,
      dateData:{},
      selectedRowKeys:[],
      urlRequest:``,
      urlRequestKey:`${API_PREFIX}services/live/live/sysmsgList/get/`
    }
  }
  componentWillMount(){
 
  }
  componentDidMount(){
    //获取列表初始数据
    getService(`${this.state.urlRequestKey}${this.state.liveId}/${this.state.currentPage}/${this.state.pageSize}`,data=>{
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
  //表单赋值
  changeDataInfo = (data) => {
    this.setState({
      dataInfo:data,
      pageSize: 10,
      currentPage: 1,
    },()=>{
      if(this.state.dataInfo.message){
        let param = {
          liveId:this.state.liveId,
          userId:this.state.userId,
          sysmsg:data.message,
        }
        postService(`${API_PREFIX}services/live/live/add/addSysmsg`,param,data=>{
          if(data.retCode === 1){
            message.success(data.retMsg);
            this.setState({
              dataInfo:{},
            },()=>{
              setTimeout(()=>{
                getService(`${this.state.urlRequestKey}${this.state.liveId}/${this.state.currentPage}/${this.state.pageSize}`,data=>{
                  if(data.retCode === 1){
                    this.setState({
                      totalNum: data.root.totalNum,
                      pointData: data.root.list,
                    });
                  }else if(data.retCode === 0){
                    message.error(data.retMsg);
                  }
                });
              },100)
            })
          }else if(data.retCode === 0){
            message.error(data.retMsg);
            return
          }
        });
        // getService(`${this.state.urlRequestKey}${this.state.liveId}/${this.state.currentPage}/${this.state.pageSize}`,data=>{
        //   if(data.retCode === 1){
        //     this.setState({
        //       totalNum: data.root.totalNum,
        //       pointData: data.root.list,
        //     });
        //   }else if(data.retCode === 0){
        //     message.error(data.retMsg);
        //   }
        // });
      }else{
        message.error('请输入消息内容')
      }
    })
  }
  //页码改变触发
  onPageChange = (current, pageSize) =>{
    //获取列表初始数据
    getService(`${this.state.urlRequestKey}${this.state.liveId}/${current}/${pageSize}`,data=>{
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
    getService(`${this.state.urlRequestKey}${this.state.liveId}/${current}/${pageSize}`,data=>{
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
  //显示确认推送模态框
  showConfirm=(id)=> {
    Modal.confirm({
      title: '推送消息',
      content: '确定推送这条系统消息吗？',
      onOk:()=> {
        let param = {id};
        postService(`${API_PREFIX}services/live/live/update/pushSysmsg`,param,data=>{
          if(data.retCode === 1){
            message.success(data.retMsg);
            setTimeout(()=>{
              getService(`${this.state.urlRequestKey}${this.state.liveId}/${this.state.currentPage}/${this.state.pageSize}`,data=>{
                if(data.retCode === 1){
                  this.setState({
                    totalNum: data.root.totalNum,
                    pointData: data.root.list,
                  });
                }else if(data.retCode === 0){
                  message.error(data.retMsg);
                }
              });
            },100)
          }else if(data.retCode === 0){
            message.error(data.retMsg);
            return 
          }
        });
      },
      onCancel() {},
    });
  }
  render(){
    const { selectedRowKeys } = this.state;
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
      title: '系统消息',
      dataIndex: 'sysmsg',
      key:'sysmsg',
    },{
      title: '是否发送',
      dataIndex: 'isSend',
      key:'isSend',
      render: (text, record,index) => {
        return record.isSend == 0 ?'未发送':'已发送'
      },
    },{
      title: '创建时间',
      dataIndex: 'createDate',
      key:'createDate',
    },{
      title: '操作',
      dataIndex: 'operation',
      key:'operation',
      render: (text, record,index) => {
        if(record.isSend == 0){
          return <div>
            <a href='javascript:;' onClick={()=>{this.showConfirm(record.id)}}
              style={{ display: 'inline-block',color:'red' }}>推送</a>
          </div>
        }else{
          return <span>已推送</span>
        }
      }
    },]
    const confirm = Modal.confirm;
    return (<div className='partyBranchesDetailFromMeet' style={{padding:'22px 26px 50px',}}>
        <span style={{marginBottom:40,fontSize:'2.2rem',display:'block'}}>{this.state.time}</span>

        <SendContent selectContent={this.state.selectContent} changeDataInfo={this.changeDataInfo}
        category={this.state.category} taskType={this.state.taskType} taskState={this.state.taskState}  dataInfo={this.state.dataInfo} />

        <Table  className="tabCommon" dataSource={this.state.pointData} style={{padding:0,paddingRight:60}} columns={columns} 
          rowKey="index" pagination={pagination} rowSelection={rowSelection}  bordered/>
        <Row type='flex' justify='center' style={{marginTop:10,marginRight:60}}>
          <Button style={{ width:90,height:24,borderRadius:8,}}  type="primary" 
            onClick={()=>{window.location.href='#/SystemSettings/LiveTelecast'}}
          >返回
          </Button>
        </Row>
        
    </div>)
  }
}

class SendFrom extends Component{
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
    this.props.form.resetFields();
  }
  render(){
    //获取表单数据
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 7}, 
      wrapperCol: { span: 17 }
    };
    return <div style={{paddingBottom:25,borderBottom:'1px solid rgba(229,229,229,1)'}}>
    <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="horizontal" >
      <Row>
        <Col span={6}>
          <FormItem {...formItemLayout}  colon={false} label='创建系统消息'>
            {getFieldDecorator('message', {
              initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
            })(
              <Input style={{width:200}} size='small' placeholder="请输入" />
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem >
            <Button style={{ width:80,height:24,borderRadius:12, }}  type="primary" htmlType="submit">提交</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
  }
}
const SendContent = Form.create()(SendFrom);
