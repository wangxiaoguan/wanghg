import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Select, message  } from 'antd';
import './MeetingTask.less'
import {RuleConfig} from  '../../../ruleConfig';
import {GetQueryString, postService, getService, getExcelService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import {connect} from 'react-redux';


const FormItem = Form.Item;
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  })
  // dispatch => ({
  //   getData: n => dispatch(BEGIN(n)),
  // })
)
export default class ViewCompletionRateFromMeet extends Component{
  constructor(props){
    super(props);
    const param = this.props.location.search.replace('?','').split('&');
    const taskId = decodeURIComponent(param[0].split('=')[1]);
    this.state = {
      upPartyName:'',
      dataSource:[],
      totalNum: 0,
      pageSize: 10,
      currentPage:1,
      pointData:[],//表格数据
      optionList:['未完成','已完成'],
      dataInfo:{}, //表单数据
      taskId,
      exportBtnBool:false,
      urlRequest:`${API_PREFIX}services/web/party/threeLesson/getListDetail/`
    };
  }
  getStrByForm = () => {
    let str = `?Q=taskId=${this.state.taskId}&`;
    if(this.state.dataInfo.username){
      str += `Q=userName=${this.state.dataInfo.username}&`
    }
    if(this.state.dataInfo.userno){
      str += `Q=userNo=${this.state.dataInfo.userno}&`
    }
    // if(this.state.dataInfo.idcard){
    //   str += `Q=idcard_LK=${this.state.dataInfo.idcard}&`
    // }
    if(this.state.dataInfo.iscomplete === 0 && this.state.dataInfo.iscomplete !== '全部'){
      str += `Q=isComplete=${this.state.dataInfo.iscomplete}&`
    }else if(this.state.dataInfo.iscomplete !== 0 && this.state.dataInfo.iscomplete !== '全部' && this.state.dataInfo.iscomplete){
      str += `Q=isComplete=${this.state.dataInfo.iscomplete}&`
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
          upPartyName:data.root.upPartyName,
        });
      }else if(data.status === 0){
        message.error(data.errorMsg);
      }else{
        message.error('数据请求失败')
      }
    });
    //获取考试完成率
    getService(`${API_PREFIX}services/web/party/threeLesson/getPartyNum/${this.state.taskId}`,data=>{
      if(data.status === 1){
        let res = []
        res.push(data.root.object)
        this.setState({
          dataSource:res,
        });
      } else if(data.status === 0){
        message.error(data.errorMsg);
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
      pageSize:10
    },()=>{
      let str = this.getStrByForm();
      //获取按任务查询列表初始数据
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        } else if(data.status === 0){
          message.error(data.errorMsg);
        }else{
          message.error('数据请求失败')
        }
      });
    })
  } 
  //表单赋值
  changeDataInfo = (data) => {
    this.setState({
      dataInfo:data,
      currentPage:1,
      pageSize:10
    },()=>{
      let str = this.getStrByForm();
      //获取按任务查询列表初始数据
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        } else if(data.status === 0){
          message.error(data.errorMsg);
        }else{
          message.error('数据请求失败')
        }
      });
    })
  }
  //导出Excel
  exportExcel = () =>{
    let query = this.getStrByForm();
    this.setState({
      exportBtnBool:true
    },()=>{
        console.log('1111111111111111', query)
      let str = `${API_PREFIX}services/web/party/threeLesson/exportDetail${query}`
    //   const query = {
    //     'Q=iscomplete_EQ':this.state.iscomplete && this.state.dataInfo.iscomplete !== '全部' || '',
    //     'Q=username_LK':this.state.dataInfo.username || '',
    //     'Q=userno_LK':this.state.dataInfo.userno || '',
    //     'Q=idcard_LK':this.state.dataInfo.idcard || '',
    //   }
      getExcelService(str,'','党建任务按任务统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      });
    })
  }
  
  //下拉菜单事件
  handleChange = (value) => {

  }
  //页码改变触发
  onPageChange = (current, pageSize) =>{
    let str = this.getStrByForm();
    getService(`${this.state.urlRequest}${current}/${pageSize}${str}`,data =>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      } else if(data.status === 0){
        message.error(data.errorMsg);
      }else{
        message.error('数据请求失败')
      }
    });
  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    let str = this.getStrByForm();
    getService(`${this.state.urlRequest}${current}/${pageSize}${str}`, data=>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          currentPage: current,
          pageSize: pageSize,
          pointData: data.root.list,
        });
      } else if(data.status === 0){
        message.error(data.errorMsg);
      }else{
        message.error('数据请求失败')
      }
    });
  }
  
  render (){
    let powers = this.props.powers;
    let exportPowers = powers && powers['20011.25002.202'];
    const columnsTop = [
      {
        title: '参与党员数',
        dataIndex: 'participationNum',
        key:'participationNum',
      },{
        title: '党员参与率',
        dataIndex: 'participationRate',
        key:'participationRate',
      },];
    const paginationTop = {
        hideOnSinglePage:true
      }
    const columnsBottom = [
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
        title: '姓名',
        dataIndex: 'userName',
        key:'userName',
      },{
        title: '员工号',
        dataIndex: 'userNo',
        key:'userNo',
      }
      // ,{
      //   title: '身份证',
      //   dataIndex: 'idCard',
      //   key:'idCard',
      // }
      ,{
        title: '完成状态',
        dataIndex: 'isCompleteDesp',
        key:'isCompleteDesp',
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
        <span style={{marginBottom:30,fontSize:'2.2rem',display:'block'}}>{this.state.upPartyName}</span>
        <span style={{marginBottom:20,fontSize:'1.55rem',display:'block',}}>总体概况</span>
        <Row>
          <Col span={8}>
            <Table dataSource={this.state.dataSource} columns={columnsTop} pagination={paginationTop} bordered />
          </Col>
        </Row>
      </div>
      <div style={{padding:'40px 26px 0'}}>
        <span style={{fontSize:'1.55rem',display:'block',marginBottom:20}}>详细情况</span>
        <ViewFormContent resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} dataInfo={this.state.dataInfo} optionList={this.state.optionList} />
        <Button style={{ width:80,borderRadius:12,marginBottom: 20}} onClick={this.exportExcel} disabled={exportBtn}>导出Excel</Button>
        <Table  className="tabCommon" dataSource={this.state.pointData} style={{padding:0,paddingRight:60}} columns={columnsBottom} 
          rowKey="indexNo" pagination={paginationBottom}  bordered/>
        <Row type='flex' justify='center' style={{marginTop:10,marginRight:60}}>
          {/* <Col span={2}> */}
            <Button style={{ width:90,borderRadius:8,}}  type="primary" 
            href={'#/PartyBuildReport/PartyBuildTask/MeetingTask'}
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
  //查询 提交表单
  handleSubmit= e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) =>{
      if(err){
        return;
      }
      console.log(fieldsValue)
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
      labelCol: { span: 6 }, 
      wrapperCol: { span: 14 }
    };
    const formItemLayout1 = {
      labelCol: { span: 4 }, 
      wrapperCol: { span: 14 }
    };
    // let children = [];
    // const optionList = this.props.optionList;
    // for (let i = 0; i < optionList.length; i++) {
    //   children.push(<Option key={optionList[i]}>{optionList[i]}</Option>);
    // }
    return <Row>
    <Form  onSubmit={this.handleSubmit}  hideRequiredMark={true} layout="horizontal" >
      <Col span={6}>
        <FormItem  {...formItemLayout1} colon={false} label='姓名'>
          {getFieldDecorator('username', {
            initialValue: this.props.dataInfo.username ? this.props.dataInfo.username: '',
            // ...RuleConfig.nameConfig,
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </Col>
      <Col span={6}>
        <FormItem {...formItemLayout} colon={false} label='员工号'>
          {getFieldDecorator('userno', {
              initialValue: this.props.dataInfo.userno ? this.props.dataInfo.userno : '',
              // ...RuleConfig.nameConfig,
            })(
              <Input placeholder="请输入" />
            )}
        </FormItem>
      </Col>
      {/* <Col span={6}>
        <FormItem {...formItemLayout} colon={false} label='身份证号'>
          {getFieldDecorator('idcard', {
            initialValue: this.props.dataInfo.idcard ? this.props.dataInfo.idcard : '',
            // ...RuleConfig.nameConfig,
          })(
            <Input style={{width:200}} size='small' placeholder="请输入" />
          )}
        </FormItem>
      </Col> */}
      <Col span={6}>
        <FormItem {...formItemLayout} colon={false} label='完成状态'>
          {getFieldDecorator('iscomplete', {
            initialValue: this.props.dataInfo.iscomplete ? this.props.dataInfo.iscomplete : '全部',
            // ...RuleConfig.nameConfig,
          })(
            <Select
              // size='small'
              onChange={this.handleChange}
            >
              <Select.Option key={2} value=''>全部</Select.Option>
              <Select.Option key={1} value={1}>已完成</Select.Option>
              <Select.Option key={0} value={0}>未完成</Select.Option>
            </Select>
          )}
        </FormItem>
      </Col>
      <Col span={24}>
      <FormItem style={{paddingBottom:25}}>
        <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
        <Button style={{ width:80,borderRadius:12,marginLeft: 15 }}  onClick={this.handleReset}>重置</Button>
      </FormItem>
      </Col>
    </Form>
  </Row>
  }
}
const ViewFormContent = Form.create()(ViewForm);