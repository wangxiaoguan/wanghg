import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Select,message  } from 'antd';
import './PartyBuildExamination.less'
import {RuleConfig} from  '../../../ruleConfig';
import {GetQueryString, postService, getService, exportExcelService,getExcelService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix'
import {connect} from 'react-redux';


const FormItem = Form.Item;
const Option = Select.Option;

@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    partyId:state.head.headPartyIdData,
    powers: state.powers,
  })
  // dispatch => ({
  //   getData: n => dispatch(BEGIN(n)),
  // })
)
export default class ViewCompletionRate extends Component{
  constructor(props){
    super(props);
    const param = this.props.location.search.replace('?','').split('&');
    const activityId = decodeURIComponent(param[0].split('=')[1]);
    const comPeople = decodeURIComponent(param[1].split('=')[1]);
    const comRate = decodeURIComponent(param[2].split('=')[1]);
    const participant = decodeURIComponent(param[3].split('=')[1]);
    const partyId = decodeURIComponent(param[4].split('=')[1]);
    const rate = `${comPeople}/${participant}`
    var parentId = sessionStorage.getItem('partyid') || this.props.partyId;
    this.state = {
      title:'',
      dataSource:[{rate,comRate}],
      totalNum: 0,
      pageSize: 10,
      currentPage:1,
      pointData:[],
      optionList:['全部','未完成','已完成'],
      dataInfo:{},
      activityId,
      parentId,
      partyId,
      exportBtnBool:false,
      urlRequest:`${API_PREFIX}services/web/party/partyExamReport/getPartyMemExamStatistics/`,
    };
  }
  //判断参数str
  getStrByForm = () => {
    let str = `?Q=parentId=${this.state.partyId}&Q=activityId=${this.state.activityId}&`;
    
    if(this.state.dataInfo.name){
      str += `Q=userName=${this.state.dataInfo.name}&`
    }
    if(this.state.dataInfo.employeeNumber){
      str += `Q=userNo=${this.state.dataInfo.employeeNumber}&`
    }
    // if(this.state.dataInfo.idCard){
    //   str += `Q=idCard_S_LK=${this.state.dataInfo.idCard}&`
    // }
    if(this.state.dataInfo.completionStatus === 0 && this.state.dataInfo.completionStatus !== '全部'){
      str += `Q=completionStatus=${this.state.dataInfo.completionStatus}&`
    }else if(this.state.dataInfo.completionStatus  && this.state.dataInfo.completionStatus !== '全部'){
      str += `Q=completionStatus=${this.state.dataInfo.completionStatus}&`
    }
    str = str.substr(0,str.length-1)
    return str
  }
  componentDidMount(){
    let str = this.getStrByForm();
    //获取按任务查询列表初始数据
    getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          title: data.root.fullName,
        });
      }else{
        message.error(data.errorMsg)
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
      let str = this.getStrByForm()
      //获取按任务查询列表初始数据
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        }else{
          message.error(data.errorMsg)
        }
      });
    })
  }
  //表单赋值
  changeDataInfo = (data) => {
    this.setState({
      dataInfo:data,
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
    },()=>{
      let str = this.getStrByForm()
      //获取按任务查询列表初始数据
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        }else{
          message.error(data.errorMsg)
        }
      });
    })
  }
  
  //下拉菜单事件
  handleChange = (value) => {

  }
  //页码改变触发
  onPageChange = (current, pageSize) =>{
    let str = this.getStrByForm()
    getService(`${this.state.urlRequest}${current}/${pageSize}${str}`,data =>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      }else{
        message.error(data.errorMsg)
      }
    });
  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    let str = this.getStrByForm()
    getService(`${this.state.urlRequest}${1}/${pageSize}${str}`,data =>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: 1,
          pageSize: pageSize,
        });
      } else{
        message.error(data.errorMsg)
      }
    });
  }
  //导出Excel
  exportExcel =() =>{
    this.setState({
      exportBtnBool:true
    },()=>{
      const str = `${API_PREFIX}services/web/party/partyExamReport/exportPartyMemExamStatistics`
      const query = {
        'Q=parentId': this.state.partyId,
        'Q=activityId': this.state.activityId,
        'Q=userName':this.state.dataInfo.name || '',
        'Q=userNo':this.state.dataInfo.employeeNumber || '',
        // 'Q=idCard_S_LK':this.state.dataInfo.idCard || '',
        'Q=completionStatus':this.state.dataInfo.completionStatus && this.state.dataInfo.completionStatus !== '全部' ? this.state.dataInfo.completionStatus : '',
      }
      getExcelService(str,query,'查看完成率统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      });
    })
  }
  render (){
    console.log(this.state)
    let powers = this.props.powers;
    let exportPowers = powers && powers['20011.25004.202'];
    const columnsTop = [
      {
        title: '考试完成人数',
        dataIndex: 'rate',
        key:'rate',
      },{
        title: '考试完成率',
        dataIndex: 'comRate',
        key:'comRate',
      },];
    const paginationTop = {
        hideOnSinglePage:true
      }
    const columnsBottom = [
      {
        title: '序号',
        dataIndex: 'key',
        key:'key',
        render: (text, record,index) => {
          return <div>
            <span>{(this.state.currentPage-1)*(this.state.pageSize) + index + 1}</span>
          </div>
        },
      },{
        title: '姓名',
        dataIndex: 'userName',
        key:'userName',
      },{
        title: '员工号',
        dataIndex: 'userNo',
        key:'userNo',
      },
      // {
      //   title: '身份证',
      //   dataIndex: 'idCard',
      //   key:'idCard',
      // },
      {
        title: '完成状态',
        dataIndex: 'completionStatus',
        key:'completionStatus',
        render:(_,record)=>{
        return <span>{record.completionStatus?'已完成':'未完成'}</span>
        }
      },
      {
        title: '考试成绩',
        dataIndex: 'score',
        key:'score',
      },
    ]
    let paginationBottom = {
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
    let exportBtn  = !exportPowers || this.state.exportBtnBool;

    return (<div className='viewCompletion' >
      <div style={{padding:'22px 26px 50px ',borderBottom:'4px solid rgba(229,229,229,1)'}}>
        <span style={{marginBottom:30,fontSize:'2.2rem',display:'block'}}>{this.state.title}</span>
        <span style={{marginBottom:20,fontSize:'1.55rem',display:'block',}}>总体概况</span>
        <Row>
          <Col span={8}>
            <Table  dataSource={this.state.dataSource} columns={columnsTop} pagination={paginationTop} bordered />
          </Col>
        </Row>
      </div>
      <div style={{padding:'40px 26px 0'}}>
        <span style={{fontSize:'1.55rem',display:'block',marginBottom:20}}>详细情况</span>
        <ViewFormContent resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} dataInfo={this.state.dataInfo} optionList={this.state.optionList} />
        <Button style={{ width:80,borderRadius:30,marginBottom: 20 }} onClick={this.exportExcel} disabled={exportBtn}>导出Excel</Button>
        <Table  className="tabCommon" dataSource={this.state.pointData} style={{padding:0,paddingRight:60}} columns={columnsBottom} 
          rowKey="id" pagination={paginationBottom}  bordered/>
        <Row type='flex' justify='center' style={{margin:'10px 60px 0 0'}}>
          {/* <Col span={2}> */}
            <Button style={{ width:90,borderRadius:8,}}  type="primary" 
            href={'#/PartyBuildReport/StudyExamination/PartyBuildExamination'}
            >返回
            </Button>
          {/* </Col> */}
        </Row>
      </div>
    </div>)
  }
}
class ViewForm extends Component{
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
    const formItemLayout = {
      labelCol: { span: 4 }, 
      wrapperCol: { span: 14 }
    };
    const formItemLayout1 = {
      labelCol: { span: 2 }, 
      wrapperCol: { span: 14 }
    };
    return <Row>
    <Form  onSubmit={this.handleSubmit}  hideRequiredMark={true} layout="horizontal" >
      <Col span={6}>
        <FormItem  {...formItemLayout1} colon={false} label='姓名'>
          {getFieldDecorator('name', {
            initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
          })(
            <Input style={{width:200}} placeholder="请输入" />
          )}
        </FormItem>
      </Col>
      <Col span={6}>
        <FormItem {...formItemLayout} colon={false} label='员工号'>
          {getFieldDecorator('employeeNumber', {
              initialValue: this.props.dataInfo.employeeNumber ? this.props.dataInfo.employeeNumber : '',
            })(
            <Input style={{width:200}} placeholder="请输入" />
          )}
        </FormItem>
      </Col>
      {/* <Col span={6}>
        <FormItem {...formItemLayout} colon={false} label='身份证号'>
          {getFieldDecorator('idCard', {
            initialValue: this.props.dataInfo.idCard ? this.props.dataInfo.idCard : '',
          })(
            <Input style={{width:200}} placeholder="请输入" />
          )}
        </FormItem>
      </Col> */}
      <Col span={6}>
        <FormItem {...formItemLayout} colon={false} label='完成状态'>
          {getFieldDecorator('completionStatus', {
            initialValue: this.props.dataInfo.completionStatus ? this.props.dataInfo.completionStatus : '全部',
          })(
            <Select
              style={{width:200}}
            
              onChange={this.handleChange}
            >
              <Select.Option key='0' value='全部'>{this.props.optionList[0]}</Select.Option>
              <Select.Option key='1' value='0'>{this.props.optionList[1]}</Select.Option>
              <Select.Option key='2' value='1'>{this.props.optionList[2]}</Select.Option>
            </Select>
          )}
        </FormItem>
      </Col>
      <Col span={24}>
      <FormItem style={{paddingBottom:25}}>
        <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
        <Button style={{ width:80,borderRadius:12,marginLeft: 15 }} onClick={this.handleReset}>重置</Button>
      </FormItem>
      </Col>
    </Form>
  </Row>
  }
}
const ViewFormContent = Form.create()(ViewForm);