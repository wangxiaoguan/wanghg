import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Select,message  } from 'antd';
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
export default class PartyBranchesDetailFromMeet extends Component{
  constructor(props){
    super(props);
    const param = this.props.location.search.replace('?','').split('&');
    const partyid = decodeURIComponent(param[0].split('=')[1]);
    this.state = {
      time:'',
      pointData:[],
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      dataInfo:{},
      category:[],//类别下拉框
      taskType:[],//任务类型下拉框
      taskState:[],//任务状态下拉框
      partyid,
      dateData:{},
      exportBtnBool:false,
      urlRequest:`${API_PREFIX}services/web/party/threeLesson/getPartyBranchDetails/`,
    }
  }
  getStrByForm = () => {
    let str = `?Q=upPartyId=${this.state.partyid}&`;
      if(this.state.dataInfo.name){
        str += `Q=taskName=${this.state.dataInfo.name}&`
      }
      if(this.state.dataInfo.about){
        str += `Q=topTaskName=${this.state.dataInfo.about}&`
      }
      if(this.state.dataInfo.topicid && this.state.dataInfo.topicid !== '全部'){
        str += `Q=topicId=${this.state.dataInfo.topicid}&`
      }
      if(this.state.dataInfo.taskType && this.state.dataInfo.taskType !== '全部'){
        str += `Q=typeId=${this.state.dataInfo.taskType}&`
      }
      if(this.state.dataInfo.taskState && this.state.dataInfo.taskState !== '全部'){
        str += `Q=status=${this.state.dataInfo.taskState}&`
      }
      if(this.state.dateData.createdate_D_GE){
        str += `Q=startTime=${this.state.dateData.createdate_D_GE}%2000:00:00&`
      }
      if(this.state.dateData.createdate_D_LE){
        str += `Q=endTime=${this.state.dateData.createdate_D_LE}%2023:59:59&`
      }
    str = str.substr(0,str.length-1)
    return str
  }
  componentWillMount(){
    var dateData = sessionStorage.getItem('MeetingDateData');
    dateData = JSON.parse(dateData);
    let fullTime = '';
    const sTime = dateData.createdate_D_GE.split('-');
    fullTime = `${sTime[0]}年${sTime[1]}月${sTime[2]}日`;
    const eTime = dateData.createdate_D_LE.split('-');
    fullTime = `${sTime[0]}年${sTime[1]}月${sTime[2]}日 —— ${eTime[0]}年${eTime[1]}月${eTime[2]}日`;
    this.setState({
      dateData,
      time: fullTime
    })
  }
  componentDidMount(){
    //获取按组织查询列表初始数据
    // getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}/${this.state.partyid}`,data=>{
    let str = this.getStrByForm();
    getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data =>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
        });
      }else if(data.status === 0){
        message.error(data.errorMsg);
      }else{
        message.error('数据请求失败')
      }
    });
    //类别（任务主题过滤掉重要工作部署）
    let category=this.state.category;
    getService(`${API_PREFIX}services/web/party/taskTopic/getList/1/1000?Q=topicType=2`,(data)=>{
      if(data.status===1){
        category.push({ key: '', value: '全部'});
        data.root.list&&data.root.list.map(item=>{
          category.push({key: item.id, value: item.topicName});
        });
        this.setState({category});
      }
    });
    //任务类型和任务状态下拉框数据
    let taskType =this.state.taskType;
    let taskState=this.state.taskState;
    getService(`${API_PREFIX}services/web/party/taskType/getList/1/1000`, data => { //获取任务类型数据
      if(data.status === 1) {
        taskType.push( { key: '', value: '全部'});
        data.root.list&&data.root.list.map(item=>{
          taskType.push({key: item.id, value: item.typeName});
        });
        this.setState({
          taskType,
          taskState: [
            {key: '', value: '全部',},
            {key: '2', value: '进行中',},
            {key: '3', value: '已截至',}
          ]
        })
      }
    })
    // //任务类型
    // let taskType =this.state.taskType;
    // getService(`${API_PREFIX}services/partybuildingreport/threelessons/taskTypeList`,(data)=>{
    //   if(data.retCode===1){
    //     taskType.push( { key: '', value: '全部'});
    //     data.root.list&&data.root.list.map(item=>{
    //       taskType.push({key: item.typeId, value: item.typeName});
    //     });
    //     this.setState({taskType});
    //   }
    // });
    // //任务状态
    // let taskState=this.state.taskState;
    // getService(`${API_PREFIX}services/partybuildingreport/lookUp/getTaskStatusList`,(data)=>{
    //   taskState.push( { key: '', value: '全部'});
    //   data&&data.map(item=>{
    //     taskState.push({key: item.code, value: item.desp});
    //   });
    //   this.setState({taskState});
    // });
  }
  //重置按钮父组件
  resetBtn =() =>{
    this.setState({dataInfo:{}},
    //   ()=>{
    //   //获取按组织查询列表初始数据
    //   getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}/${this.state.partyid}`,data=>{
    //     if(data.retCode === 1){
    //       this.setState({
    //         totalNum: data.root.totalNum,
    //         pointData: data.root.list,
    //         time: data.root.upPartyName,
    //       });
    //     }else if(data.retCode === 0){
    //       message.error(data.retMsg);
    //     }else{
    //       message.error('数据请求失败')
    //     }
    //   });
    // }
    )
  }
  //表单赋值
  changeDataInfo = (data) => {
    this.setState({
      dataInfo:data,
      pageSize: 10,
      currentPage: 1,
    },()=>{
      let str = this.getStrByForm();
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data =>{
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
  //导出Excel
  exportExcel =() =>{
    this.setState({
      exportBtnBool:true
    },()=>{
      const query = {
        'Q=upPartyId':this.state.partyid,
        'Q=taskName':this.state.dataInfo.name || '',
        'Q=topTaskName':this.state.dataInfo.about || '',
        'Q=topicId':this.state.dataInfo.topicid && this.state.dataInfo.topicid !=='全部' ? this.state.dataInfo.topicid : '',
        'Q=typeId':this.state.dataInfo.taskType && this.state.dataInfo.taskType !=='全部'  ? this.state.dataInfo.taskType : '',
        'Q=status':this.state.dataInfo.taskState && this.state.dataInfo.taskState !=='全部' ? this.state.dataInfo.taskState : '',
        'Q=startTime':`${this.state.dateData.createdate_D_GE}%2000:00:00`,
        'Q=endTime':`${this.state.dateData.createdate_D_LE}%2023:59:59`
      }
      const str = `${API_PREFIX}services/web/party/threeLesson/exportPartyBranchDetails`
      getExcelService(str,query,'党支部详情统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      });
    })
  }
  render(){
    let powers = this.props.powers;
    let exportPowers = powers && powers['20011.25002.202'];
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
      title: '任务名称',
      dataIndex: 'taskName',
      key:'taskName',
    },{
      title: '关联上级工作部署',
      dataIndex: 'topTaskName',
      key:'topTaskName',
    },{
      title: '类别',
      dataIndex: 'topicName',
      key:'topicName',
    },{
      title: '任务类型',
      dataIndex: 'typeName',
      key:'typeName',
    },{
      title: '任务截止时间',
      dataIndex: 'endDate',
      key:'endDate',
    },{
      title: '创建时间',
      dataIndex: 'createTime',
      key:'createTime',
    },{
      title: '任务状态',
      dataIndex: 'statusDesp',
      key:'statusDesp',
    },{
      title: '党员参与率',
      dataIndex: 'participationRate',
      key:'participationRate',
    }]
    let exportBtn  = !exportPowers || this.state.exportBtnBool;
    return (<div className='partyBranchesDetailFromMeet' style={{padding:'22px 26px 50px',}}>
        <span style={{marginBottom:40,fontSize:'2.2rem',display:'block'}}>{this.state.time}</span>

        <PartyBranchesFrom selectContent={this.state.selectContent} resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo}
        category={this.state.category} taskType={this.state.taskType} taskState={this.state.taskState}  dataInfo={this.state.dataInfo} />

        <Button style={{ width:80,borderRadius:12,margin:'40px 0 20px' }} onClick={this.exportExcel} disabled={exportBtn}>导出Excel</Button>
        <Table  className="tabCommon" dataSource={this.state.pointData} style={{padding:0,paddingRight:60}} columns={columns} 
          rowKey="indexNo" pagination={pagination}  bordered/>
        <Row type='flex' justify='center' style={{marginTop:10,marginRight:60}}>
          <Button style={{ width:90,borderRadius:8,}}  type="primary" 
            onClick={()=>{history.back()}}
          >返回
          </Button>
        </Row>
    </div>)
  }
}

class PartyBranches extends Component{
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
  //重置按钮
  handleReset = () => {
    // this.setState({dataInfo:{}},() =>{console.log(this.state)})
    this.props.form.resetFields();
    this.props.resetBtn()
  }
  render(){
    //获取表单数据
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 7}, 
      wrapperCol: { span: 17 }
    };
    const selectContent = this.props;
    //类别下拉列表
    let categorySelectList = [];
    const categorySelect = selectContent.category;
    for (let i = 0; i < categorySelect.length; i++) {
      categorySelectList.push(<Select.Option key={categorySelect[i].key} value={categorySelect[i].key}>{categorySelect[i].value}</Select.Option>);
    }
    //任务类型下拉列表
    let taskTypeSelectList = [];
    const taskTypeSelect = selectContent.taskType;
    for (let i = 0; i < taskTypeSelect.length; i++) {
      taskTypeSelectList.push(<Select.Option key={taskTypeSelect[i].key} value={taskTypeSelect[i].key}>{taskTypeSelect[i].value}</Select.Option>);
    }
    //任务状态下拉列表
    let taskStateSelectList = [];
    const taskStateSelect = selectContent.taskState;
    for (let i = 0; i < taskStateSelect.length; i++) {
      taskStateSelectList.push(<Select.Option key={taskStateSelect[i].key} value={taskStateSelect[i].key}>{taskStateSelect[i].value}</Select.Option>);
    }
    return <div style={{paddingBottom:25,borderBottom:'1px solid rgba(229,229,229,1)'}}>
    <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="horizontal" >
      <Row>
        <Col span={6}>
          <FormItem {...formItemLayout}  colon={false} label='任务名称'>
            {getFieldDecorator('name', {
              initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
            })(
              <Input style={{width:200}} placeholder="请输入" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formItemLayout}  colon={false} label='关联上级工作部署'>
            {getFieldDecorator('about', {
              initialValue: this.props.dataInfo.about ? this.props.dataInfo.about : '',
            })(
              <Input style={{width:200}} placeholder="请输入" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formItemLayout}  colon={false} label='类别'>
            {getFieldDecorator('topicid', {
              initialValue: this.props.dataInfo.topicid ? this.props.dataInfo.topicid : '',
            })(
              <Select
                style={{width:200}}
                // size='small'
              >
              {categorySelectList}
                </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem  {...formItemLayout} colon={false} label='任务类型'>
            {getFieldDecorator('taskType', {
              initialValue: this.props.dataInfo.typeid ? this.props.dataInfo.typeid : '全部',
            })(
              <Select
                style={{width:200}}
                // size='small'
              >
                {taskTypeSelectList}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem  {...formItemLayout} colon={false} label='任务状态'>
            {getFieldDecorator('taskState', {
              initialValue: this.props.dataInfo.status ? this.props.dataInfo.status : '全部',
            })(
              <Select
                style={{width:200}}
                // size='small'
              >
                {taskStateSelectList}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem >
            <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
            <Button style={{ width:80,borderRadius:12,marginLeft: 15 }} onClick={this.handleReset}>重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
  }
}
const PartyBranchesFrom = Form.create()(PartyBranches);
