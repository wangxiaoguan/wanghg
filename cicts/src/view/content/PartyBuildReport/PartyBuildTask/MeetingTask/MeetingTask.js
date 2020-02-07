
import  React,{ Component } from 'react';
import { Tabs,Form, Row, Col, Input, Button, Icon, DatePicker,Table,Select, message, Cascader, Spin    } from 'antd';
import moment from 'moment';
import {RuleConfig} from  '../../../ruleConfig';
import './MeetingTask.less'
import {GetQueryString, postService, getService, getExcelService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import {connect} from 'react-redux';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
@connect(
  state => ({
    dataSource: state.table.tableData,
    partyId:state.head.headPartyIdData,
    pageData:state.table.pageData,
    powers: state.powers,
  })
  // dispatch => ({
  //   getData: n => dispatch(BEGIN(n)),
  // })
)
export default class MeetingTask extends Component{
  constructor(props){
    super(props);
    let param = this.props.location.search.replace('?','').split('&');
    // let activeKey = decodeURIComponent(param[0].split('=')[1]) || '1';
    let activeKey = GetQueryString(location.hash, ['id']).id || '1';
    console.log('0000000000000000000000000', activeKey)
    var partyid =  sessionStorage.getItem('partyid')|| this.props.partyId;
    this.state = {
      organizations:[],
      loading:false,
      cascaderValue:[],
      activeKey: String(activeKey),//tab栏key值
      pointData: [],   //按任务表格数据
      pointPartyData: [], //按组织表格数据
      selectedRowKeys:[],//表格选中的数据
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      columns:[],
      dataInfo:{},//表单内容
      dateData : { //日期选择器内容
        createdate_D_GE: null,
        createdate_D_LE: null,
        endOpen: false,
      },
      category:[],//类别下拉框
      taskType:[],//任务类型下拉框
      taskState:[],//任务状态下拉框
      exportBtnBool:false,
      userId:window.sessionStorage.getItem('id'),
      partyid:partyid || -1,
      urlRequestKey1:`${API_PREFIX}services/web/party/threeLesson/listOnTask/`,
      urlRequestKey2:`${API_PREFIX}services/web/party/threeLesson/getIndexListByPartyInfo/`,
    }
  }
  getData = () => {
    let str = `?Q=upPartyId=${this.state.partyid}&`;
    if(this.state.activeKey == '1'){
      if(this.state.dataInfo.name){
        str += `Q=taskName=${this.state.dataInfo.name}&`
      }
      if(this.state.dataInfo.topicid && this.state.dataInfo.topicid !== '全部'){
        str += `Q=topicId=${this.state.dataInfo.topicid}&`
      }
      if(this.state.dataInfo.typeid && this.state.dataInfo.typeid !== '全部'){
        str += `Q=typeId=${this.state.dataInfo.typeid}&`
      }
      if(this.state.dataInfo.status && this.state.dataInfo.status !== '全部'){
        str += `Q=status=${this.state.dataInfo.status}&`
      }
      if(this.state.dataInfo.uppartyname){
        str += `Q=partyId=${this.state.dataInfo.uppartyname}&`
      }
      if(this.state.dateData.createdate_D_GE){
        str += `Q=startTime=${this.state.dateData.createdate_D_GE}%2000:00:00&`
      }
      if(this.state.dateData.createdate_D_LE){
        str += `Q=endTime=${this.state.dateData.createdate_D_LE}%2023:59:59&`
      }
    }else{
      if(this.state.dataInfo.uppartyname){
        // str += `Q=partyname_LK=${this.state.dataInfo.name}&`
        str += `Q=partyId=${this.state.dataInfo.uppartyname}&`
      }
      if(this.state.dateData.createdate_D_GE){
        str += `Q=startTime=${this.state.dateData.createdate_D_GE}%2000:00:00&`
      }
      if(this.state.dateData.createdate_D_LE){
        str += `Q=endTime=${this.state.dateData.createdate_D_LE}%2023:59:59&`
      }
    }
    
    str = str.substr(0,str.length-1)
    this.setState({loading: true})
    if(this.state.activeKey == '1'){
      //获取按任务查询列表初始数据
      getService(`${this.state.urlRequestKey1}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
            loading: false
          });
        }else{
          message.error(data.errorMsg)
          this.setState({loading: false})
        }
      });
    }else{
      //获取按组织查询列表初始数据
      getService(`${this.state.urlRequestKey2}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointPartyData: data.root.list,
            loading: false
          });
        }else{
          message.error(data.errorMsg)
          this.setState({loading: false})
        }
      });
    }
  }
  componentWillMount(){
    let partyid = sessionStorage.getItem('partyid') || this.props.partyId;
    this.setState({
      partyid
    })
    // var dateData = sessionStorage.getItem('MeetingDateData');
    // if(dateData){
    //   dateData = JSON.parse(dateData);
      // let fullTime = '';
      // const sTime = dateData.createdate_D_GE.split('-');
      // fullTime = `${sTime[0]}年${sTime[1]}月${sTime[2]}日`;
      // const eTime = dateData.createdate_D_LE.split('-');
      // fullTime = `${sTime[0]}年${sTime[1]}月${sTime[2]}日 —— ${eTime[0]}年${eTime[1]}月${eTime[2]}日`;
      // this.setState({
        // dateData,
        // time: fullTime
      // })
    // }else{
      let createdate_D_GE = moment().subtract( 30, 'days').format('YYYY-MM-DD')
      let createdate_D_LE = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
      this.setState({
        dateData:{
          ...this.state.dateData,
          createdate_D_GE,
          createdate_D_LE
        }
      },()=>{
        sessionStorage.setItem('MeetingDateData',JSON.stringify(this.state.dateData))
      })
    // }
    if(this.state.activeKey === '1'){
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
      
      //任务类型
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
  }
  componentDidMount(){
    //通过接口获取部门的信息
      getService(API_PREFIX+'services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1',data=>{
      if(data.status === 1){
        let orgs=data.root.object;
        if(orgs){
          //直接调用处理部门数据的方法===》处理数据
          this.getDepartmentData(orgs);
          this.setState({
            organizations:orgs,
          });
        }
      }else{
        message.error(data.retMsg);
      }
    });
    
    this.getData();
  }
  componentWillReceiveProps(nextProps) {
    // this.child.handleReset()
    let param = nextProps.location.search.replace('?','').split('&');
    let activeKey = Number(decodeURIComponent(param[0].split('=')[1])) || '1';
    activeKey = String(activeKey);
    if(this.state.activeKey != activeKey){
      this.child && this.child.handleReset()
      this.setState({
        activeKey
      })
    }
    let partyid = sessionStorage.getItem('partyid') || nextProps.partyId;
    if(this.state.partyid !== partyid){
      this.child && this.child.handleReset()
      this.setState({
        partyid:partyid,
      })
    }
  }
    
  //递归取出接口返回的部门的数据
  getDepartmentData(dpData){
    dpData.map((item,index)=>{
      item.value=item.id;
      item.label=item.partyName;
      item.children=item.partyOrgList;
      if(item.partyOrgList){//不为空，递归
        this.getDepartmentData(item.partyOrgList)
      }
    });
  }
  //重置按钮父组件
  resetBtn =() =>{
    let createdate_D_GE = moment().subtract( 30, 'days').format('YYYY-MM-DD')
    let createdate_D_LE = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    this.setState({
      dateData:{
        ...this.state.dateData,
        createdate_D_GE,
        createdate_D_LE
      },
      dataInfo:{},
      currentPage:1,
      pageSize:10,
      cascaderValue:[],
    },()=>{
      this.getData();
      sessionStorage.setItem('MeetingDateData',JSON.stringify(this.state.dateData))
    })
  }
  //表单赋值
  changeDataInfo = (data) => {
    sessionStorage.setItem('MeetingDateData',JSON.stringify(this.state.dateData))
    let arr = this.state.cascaderValue[this.state.cascaderValue.length-1];
    this.setState({
      dataInfo:{
        ...data,
        uppartyname:arr,
        totalNum: 0,
        pageSize: 10,
        currentPage: 1,
      }
    },()=>{
      this.getData(); 
    })
    
  }
  //tab栏切换
  tabsChange = (activeKey) =>{
    // window.location.href = `#/PartyBuildReport/PartyBuildTask/MeetingTask?key=${activeKey}`
    let createdate_D_GE = moment().subtract( 30, 'days').format('YYYY-MM-DD')
    let createdate_D_LE = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    this.setState({
      dataInfo:{},
      pointData: [],
      pointPartyData: [],
      totalNum:0,
      cascaderValue:[],
      exportBtnBool:false,
      dateData:{
        ...this.state.dateData,
        createdate_D_LE,
        createdate_D_GE
      }
    },()=>{
      window.location.hash = `/PartyBuildReport/PartyBuildTask/MeetingTask?id=${activeKey}`
      return 
    });
  }
  //table选中项发生变化时的回调
  onSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
  }
  
  //页码改变触发
  onPageChange = (current, pageSize) =>{
    this.setState({
      currentPage: current,
      pageSize: pageSize,
    },()=>{
      this.getData();
    });
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    this.setState({
      currentPage: current,
      pageSize: pageSize,
    },()=>{
      this.getData();
    });
  }
  //导出Excel
  exportExcel =() =>{
    this.setState({
      exportBtnBool:true
    },()=>{
      if(this.state.activeKey == '1'){
        const query = {
          'Q=upPartyId':this.state.partyid,
          'Q=taskName':this.state.dataInfo.name || '',
          'Q=topicId':this.state.dataInfo.topicid !== '全部' && this.state.dataInfo.topicid || '',
          'Q=typeId':this.state.dataInfo.typeid!== '全部' && this.state.dataInfo.typeid  || '',
          'Q=status':this.state.dataInfo.status!== '全部' && this.state.dataInfo.status  || '',
          'Q=partyId':this.state.dataInfo.uppartyname || '',
          'Q=startTime':`${this.state.dateData.createdate_D_GE}%2000:00:00` || '',
          'Q=endTime':`${this.state.dateData.createdate_D_LE}%2023:59:59` || '',
        }
        const str = `${API_PREFIX}services/web/party/threeLesson/export`
        getExcelService(str,query,'三会一课按任务统计').then(data=>{
          this.setState({
            exportBtnBool:data
          })
        })
      }else{
        const query = {
          'Q=upPartyId':this.state.partyid,
          'Q=partyId':this.state.dataInfo.name || '',
          'Q=startTime':`${this.state.dateData.createdate_D_GE}%2000:00:00` || '',
          'Q=endTime':`${this.state.dateData.createdate_D_LE}%2023:59:59` || '',
        }
        const str = `${API_PREFIX}services/web/party/threeLesson/exportIndexListByPartyInfo`
        getExcelService(str,query,'三会一课按组织统计').then(data=>{
          this.setState({
            exportBtnBool:data
          })
        })
        ;
      }
    })
  }
  //日期修改
  onDateChange = (field, value) => {
    this.setState(()=>{
      this.state.dateData[field] = moment(value).format('YYYY-MM-DD');
    })
  }
  cascaderChange = (value) => {
    this.setState({
      cascaderValue:value
    })
  }
  onRef = (ref) => {
    this.child = ref
  }
  render(){
    let powers = this.props.powers;
    let exportPowers = powers && powers['20011.25002.202'];
    const columns1 =[
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
        title: '任务名称',
        dataIndex: 'taskName',
        key:'taskName',
      },{
        title: '类别',
        dataIndex: 'topicName',
        key:'topicName',
      },{
        title: '任务类型',
        dataIndex: 'typeName',
        key:'typeName',
      },{
        title: '发起人',
        dataIndex: 'userName',
        key:'userName',
      },{
        title: '发起人党组织',
        dataIndex: 'upPartyName',
        key:'upPartyName',
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
      },{
        title: '操作',
        dataIndex: 'operation',
        key:'operation',
        render: (text, record) => {
          const taskId = encodeURIComponent(record.taskId);
          // const upPartyName = encodeURIComponent(record.upPartyName);
          return <div>
            <a href={`#/PartyBuildReport/PartyBuildTask/ViewCompletionRate?id=${taskId}`} 
              style={{ display: 'inline-block' }}>查看完成率</a>
          </div>;
        },
      },
    ];
    const columns2 =[
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
        title: '党组织名称',
        dataIndex: 'partyName',
        key:'partyName',
      },{
        title: '支部数量',
        dataIndex: 'allPartyNum',
        key:'allPartyNum',
      },{
        title: '三会一课任务',
        dataIndex: 'threeLessonsNum',
        key:'threeLessonsNum',
      },{
        title: '支部党员大会',
        dataIndex: 'branchNum',
        key:'branchNum',
      },{
        title: '党支部委员会',
        dataIndex: 'committeeNum',
        key:'committeeNum',
      },{
        title: '党小组会',
        dataIndex: 'partyGroupNum',
        key:'partyGroupNum',
      },{
        title: '党课',
        dataIndex: 'partyLectureNum',
        key:'partyLectureNum',
      },{
        title: '组织完成率',
        dataIndex: 'partyPercentage',
        key:'partyPercentage',
      },{
        title: '党员参与率',
        dataIndex: 'participationRate',
        key:'participationRate',
      },{
        title: '党员人数',
        dataIndex: 'allMemCount',
        key:'allMemCount',
      },{
        title: '操作',
        dataIndex: 'operation',
        key:'operation',
        render: (text, record) => {
          if(record.servlet === 0){
            return <div>
              <a href={`#/PartyBuildReport/PartyBuildTask/FirstOrganization?id=${record.partyId}`} 
              style={{ display: 'inline-block' }} >详情</a>
            </div>;
          }else{
            return <div>
              <a href={`#/PartyBuildReport/PartyBuildTask/PartyBranchesDetail?id=${record.partyId}`} 
              style={{ display: 'inline-block' }} >详情</a>
            </div>;
          }
        },
      }
    ];
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
      showTotal: total => `共 ${total} 条`
    };
    return <div className='MeetingTask'>
      <Tabs defaultActiveKey={this.state.activeKey} type="card"  onChange={this.tabsChange}>
        <TabPane tab="按任务" key="1" style={{ padding: '0 47px 0 27px', }}>
          <Spin spinning={this.state.loading}>
          <MeetingTaskContent onRef={this.onRef} changeDataInfo={this.changeDataInfo} handleSubmit={this.handleSubmit} cascaderChange={this.cascaderChange}
            category={this.state.category} taskType={this.state.taskType} taskState={this.state.taskState} organizations={this.state.organizations} loading={this.state.loading} cascaderValue={this.state.cascaderValue}
            dateData={this.state.dateData} onDateChange={this.onDateChange} dataInfo={this.state.dataInfo} 
            resetBtn={this.resetBtn} exportExcel={this.exportExcel} activeKey={this.state.activeKey} pointData={this.state.pointData}
              columns={columns1} rowSelection={rowSelection} pagination={pagination} exportPowers={exportPowers} exportBtnBool={this.state.exportBtnBool} />
          </Spin>
        </TabPane>
        <TabPane tab="按组织" key="2" style={{padding:'0 47px 0 27px',}}>
          <Spin spinning={this.state.loading}>
          <MeetingTaskContent onRef={this.onRef} changeDataInfo={this.changeDataInfo} handleSubmit={this.handleSubmit} exportExcel={this.exportExcel} cascaderChange={this.cascaderChange} cascaderValue={this.state.cascaderValue}
            category={this.state.category} taskType={this.state.taskType} taskState={this.state.taskState} organizations={this.state.organizations} loading={this.state.loading}
            dateData={this.state.dateData} onDateChange={this.onDateChange}  dataInfo={this.state.dataInfo} 
            resetBtn={this.resetBtn} activeKey={this.state.activeKey} pointData={this.state.pointPartyData} exportPowers={exportPowers} exportBtnBool={this.state.exportBtnBool}
            columns={columns2} pagination={pagination}/>
            </Spin>
        </TabPane>
      </Tabs>
    </div>
  }
}

class TaskContent extends Component{
  constructor(props){
    super(props);
    this.props.onRef(this)
  }
  handleSubmit= e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) =>{
      if(err){
        return;
      }
      if(this.props.activeKey !='1' && this.props.dateData.createdate_D_GE === 'Invalid date') {
          message.error('请选择查询开始时间')
          return
      }
      if(this.props.activeKey !='1' && this.props.dateData.createdate_D_LE === 'Invalid date') {
          message.error('请选择查询结束时间')
          return
      }
      this.props.changeDataInfo(fieldsValue)
    })
  }
  //重置按钮
  handleReset = () => {
    // this.setState({dataInfo:{}},() =>{console.log(this.state)})
    this.props.form.resetFields();
    this.sun.props.form.resetFields()
    this.props.resetBtn()
    this.sun.props.dateData.createdate_D_GE = moment().subtract( 30, 'days').format('YYYY-MM-DD')
    this.sun.props.dateData.createdate_D_LE = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
  }
  onSunRef = (ref) => {
    this.sun = ref
  }
  //级联事件
  handleChange=(value)=>{
    this.props.cascaderChange(value)
  }
  render(){
    //获取数据
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 }, 
      wrapperCol: { span: 18 }
    };
    const formItemLayout1 = {
      labelCol: { span: 6 }, 
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
    let exportBtn  = !this.props.exportPowers || this.props.exportBtnBool;
    return (
      <div>
        {
          this.props.activeKey ==='1'?
            <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="horizontal" style={{borderBottom:'1px solid rgba(215,218,230,1)'}}>
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} colon={false} label='任务名称'>
                    {getFieldDecorator('name', {
                      initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
                    })(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout}  colon={false} label='类别'>
                    {getFieldDecorator('topicid', {
                      initialValue: this.props.dataInfo.topicid ? this.props.dataInfo.topicid : '',
                    })(
                      <Select
                        // size='small'
                      >
                      {categorySelectList}
                       </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem  {...formItemLayout} colon={false} label='任务类型'>
                    {getFieldDecorator('typeid', {
                      initialValue: this.props.dataInfo.typeid ? this.props.dataInfo.typeid : '全部',
                    })(
                      <Select
                        // size='small'
                      >
                        {taskTypeSelectList}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem  {...formItemLayout} colon={false} label='任务状态'>
                    {getFieldDecorator('status', {
                      initialValue: this.props.dataInfo.status ? this.props.dataInfo.status : '全部',
                    })(
                      <Select
                        // size='small'
                      >
                        {taskStateSelectList}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem  {...formItemLayout1} colon={false} label='发起人党组织'>
                    {getFieldDecorator('uppartyname', {
                      initialValue: this.props.cascaderValue ? this.props.cascaderValue : '',
                    })(
                      // <Input style={{width:200}} size='small' placeholder="请输入" />
                      // <Spin spinning={this.props.loading}>
                        <Cascader options={this.props.organizations} placeholder='请输入' changeOnSelect  onChange={this.handleChange}/>
                      // </Spin>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem  {...formItemLayout1} colon={false} label='选择日期'>
                    <DateRangeContent onSunRef={this.onSunRef} dateData={this.props.dateData} onDateChange={this.props.onDateChange}></DateRangeContent>
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem {...formItemLayout} style={{marginTop:10,paddingBottom:25}}>
                    <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
                    <Button style={{ width:80,borderRadius:12,marginLeft: 15 }} onClick={this.handleReset}>重置</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          :
            <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="horizontal" style={{borderBottom:'1px solid rgba(215,218,230,1)'}}>
              <Row>
                <Col span={8}>
                  <FormItem  {...formItemLayout1} colon={false} label='党组织名称'>
                    {getFieldDecorator('uppartyname', {
                      initialValue: this.props.cascaderValue ? this.props.cascaderValue : '',
                    })(
                      // <Input style={{width:200}} size='small' placeholder="请输入" />
                      // <Spin spinning={this.props.loading}>
                        <Cascader options={this.props.organizations} placeholder='请输入' changeOnSelect  onChange={this.handleChange} />
                      // </Spin>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem  {...formItemLayout1} colon={false} label='选择日期'>
                    <DateRangeContent onSunRef={this.onSunRef} dateData={this.props.dateData} onDateChange={this.props.onDateChange}></DateRangeContent>
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem  {...formItemLayout} style={{marginTop:10,paddingBottom:25}}>
                    <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
                    <Button style={{ width:80,borderRadius:12,marginLeft: 15 }} onClick={this.handleReset}>重置</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
        }
        <div>
          <Button style={{ width:80,borderRadius:12,margin: '40px 0 20px'}} onClick={this.props.exportExcel} disabled={exportBtn}>
            导出Excel
          </Button>
          {
            this.props.activeKey ==='1'?
            <Table  className="tabCommon" dataSource={this.props.pointData} style={{padding:0}} columns={this.props.columns} 
              rowKey="indexNo" rowSelection={this.props.rowSelection} pagination={this.props.pagination}  bordered/>
            :
            <Table  className="tabCommon" dataSource={this.props.pointData} style={{padding:0}} columns={this.props.columns} 
              rowKey="indexNo" pagination={this.props.pagination}  bordered/>
          }
        </div>
      </div>
    )
  }

}
//日期选择器
class DateRangeChange extends React.Component {
  constructor(props){
    super(props);
    this.props.onSunRef(this)
    this.state = {
      ...this.props.dateData
    };
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      ...nextProps.dateData
    });
  }
  disabledStartDate = (createdate_D_GE) => {
    const createdate_D_LE = this.state.createdate_D_LE;
    if (!createdate_D_GE || !createdate_D_LE) {
      return false;
    }
    return createdate_D_GE.valueOf() > createdate_D_LE.valueOf()
  }
  disabledEndDate = (createdate_D_LE) => {
    const createdate_D_GE = this.state.createdate_D_GE;
    if (!createdate_D_LE || !createdate_D_GE) {
      return false;
    }
    return createdate_D_LE.valueOf() <= createdate_D_GE.valueOf();
  }
  onStartChange = (value) => {
    this.props.onDateChange('createdate_D_GE', value);
    this.setState({'createdate_D_GE':value})
  }
  onEndChange = (value) => {
    this.props.onDateChange('createdate_D_LE', value);
    this.setState({'createdate_D_LE':value});
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form>
          <Row>
            <Col span={8}>
              <FormItem label="" style={{marginBottom:0,marginRight:0}}>
              {getFieldDecorator('createdate_D_GE', {
                  initialValue: moment(this.state.createdate_D_GE, 'YYYY-MM-DD')
                })(
                <DatePicker 
                  allowClear={true}
                  // style={{height:24}}
                  // disabledDate={this.disabledStartDate}
                  format="YYYY-MM-DD"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
              )}
              </FormItem>
              </Col>
            <Col span={2} style={{textAlign:'center',marginTop:8}}>
              <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
              </Col>
            <Col span={8}>
              <FormItem label="" style={{marginBottom:0,marginRight:0}}>
                {getFieldDecorator('createdate_D_LE', {
                  initialValue: moment(this.state.createdate_D_LE, 'YYYY-MM-DD')
                })(
                  <DatePicker
                    allowClear={true}
                    // style={{height:24}}
                    // disabledDate={this.disabledEndDate}
                    format="YYYY-MM-DD"
                    onChange={this.onEndChange}
                    open={this.state.endOpen}
                    onOpenChange={this.handleEndOpenChange}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
const MeetingTaskContent = Form.create()(TaskContent);
const DateRangeContent = Form.create()(DateRangeChange);

