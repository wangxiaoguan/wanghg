
import  React,{ Component } from 'react';
import { Tabs,Form, Row, Col, Input, Button, Icon, DatePicker,Table, message, Cascader, Spin  } from 'antd';
import moment from 'moment';
import './PartyBuildExamination.less'
import {RuleConfig} from  '../../../ruleConfig';
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
export default class PartyBuildExamination extends Component{
  constructor(props){
    super(props);
    let param = this.props.location.search.replace('?','').split('&');
    // let activeKey = Number(decodeURIComponent(param[0].split('=')[1])) || '1';
    let activeKey = GetQueryString(location.hash, ['id']).id || '1';
    let partyid = sessionStorage.getItem('partyid') || this.props.partyId;
    this.state = {
      organizations:[],
      loading:false,
      cascaderValue:[],//以上 级联数据
      activeKey: String(activeKey),//tab栏key值
      pointData1:[],   //tab1表格数据
      pointData2:[],   //tab2表格数据
      selectedRowKeys:[],//表格选中的数据
      totalNum: 0,
      currentPage:1,
      pageSize: 10,
      columns:[],
      dataInfo:{},//表单内容
      dateData : { //日期选择器内容
        startValue: null,
        endValue: null,
        endOpen: false,
      },
      partyid:partyid || -1,
      isMiniPartyCount:1,
      exportBtnBool:false,
      urlRequestKey1:`${API_PREFIX}services/web/party/partyExamReport/getPartyExamStatistics/`,
      urlRequestKey2:`${API_PREFIX}services/web/party/partyExamReport/getPartyExamPartyOrgStatistics/`,
    }
  }
  //判断参数str
  getStrByForm = (current,pageSize) => {
    let str = `?Q=parentId=${this.state.partyid}&`;
    if(this.state.dataInfo.name){
      str += this.state.activeKey === '1' ? `Q=name=${this.state.dataInfo.name}&`: `Q=partyId=${this.state.dataInfo.name}&`
    }
    if(this.state.dateData.startValue){
      str += `Q=startTime=${this.state.dateData.startValue}%2000:00:00&`
    }
    if(this.state.dateData.endValue){
      str += `Q=endTime=${this.state.dateData.endValue}%2023:59:59&`
    }
    if(this.state.activeKey === '2'){
      str += `Q=type=${this.state.partyid}&`
    }
    str = str.substr(0, str.length - 1)
    this.setState({loading: true})
    if(this.state.activeKey === '1'){
      //获取按考试查询列表初始数据
      getService(`${this.state.urlRequestKey1}${current || this.state.currentPage}/${pageSize || this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData1: data.root.list,
            currentPage:current || this.state.currentPage,
            pageSize: pageSize || this.state.pageSize,
            loading: false,
          });
        }else{
          this.setState({loading: false})
          message.error('数据请求失败')
        }
      });
    }else if(this.state.activeKey === '2'){
      //获取按组织查询列表初始数据
      getService(`${this.state.urlRequestKey2}${current || this.state.currentPage}/${pageSize || this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData2: data.root.list,
            currentPage:current || this.state.currentPage,
            pageSize: pageSize || this.state.pageSize,
            loading: false,
          });
        }else{
          this.setState({loading: false})
          message.error('数据请求失败')
        }
      });
    }
  }
  //表单赋值
  changeDataInfo = (data) => {
    sessionStorage.setItem('ExamDateData',JSON.stringify(this.state.dateData))
    this.setState({
      dataInfo:data,
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
    },()=>{
      if(this.state.activeKey === '1'){
        this.getStrByForm()
      }else if(this.state.activeKey === '2'){
        let arr = this.state.cascaderValue[this.state.cascaderValue.length-1];
        this.setState({
          dataInfo:{
            ...this.state.dataInfo,
            name:arr
          }
        },()=>{
          this.getStrByForm()
        })
      }
    })
  }
  componentWillMount(){
    let partyid = sessionStorage.getItem('partyid') || this.props.partyId;
    this.setState({
      partyid
    })
      let startValue = moment().subtract( 30, 'days').format('YYYY-MM-DD')
      let endValue = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
      this.setState({
        dateData:{
          ...this.state.dateData,
          startValue,
          endValue
        }
      },()=>{
        sessionStorage.setItem('ExamDateData',JSON.stringify(this.state.dateData))
      })
    
  }
  componentDidMount(){
    //通过接口获取部门的信息
    // getService(API_PREFIX+'services/system/partyOrganization/partyOrganizationList/get',data=>{
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
        message.error('数据请求失败')
      }
    });
    this.getStrByForm()
  }  
  componentWillReceiveProps(nextProps){
    let param = nextProps.location.search.replace('?','').split('&');
    let activeKey = Number(decodeURIComponent(param[0].split('=')[1])) || '1';
    activeKey = String(activeKey);
    if(this.state.activeKey !== activeKey){
      this.setState({
        activeKey
      },()=>{
        this.son.handleReset();
      })
    }
    var partyid =  sessionStorage.getItem('partyid') || nextProps.partyId;
    if(this.state.partyid !== partyid){
      this.setState({
        partyid:partyid
      },()=>{
        this.son.handleReset();
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
    let startValue = moment().subtract( 30, 'days').format('YYYY-MM-DD')
    let endValue = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    this.setState({
      dateData:{
        ...this.state.dateData,
        startValue,
        endValue
      },
      dataInfo:{},
      currentPage:1,
      pageSize:10,
      cascaderValue:[],
      pointData1:[],
      pointData2:[],
    },()=>{
      this.getStrByForm()
      sessionStorage.setItem('ExamDateData',JSON.stringify(this.state.dateData))
    })
  }
  //tab栏切换
  tabsChange= (activeKey) =>{
    let startValue = moment().subtract( 30, 'days').format('YYYY-MM-DD')
    let endValue = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    this.setState({
      dataInfo:{},
      pointData1:[],
      pointData2:[],
      totalNum:0,
      cascaderValue:[],
      exportBtnBool:false,
      dateData:{
        ...this.state.dateData,
        startValue,
        endValue
      },
    },()=>{
      window.location.hash = `/PartyBuildReport/StudyExamination/PartyBuildExamination?id=${activeKey}`
      return
    });
  }
  //table选中项发生变化时的回调
  onSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
  }
  //页码改变触发
  onPageChange = (current, pageSize) =>{
    this.getStrByForm(current, pageSize)
  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    this.getStrByForm(current, pageSize)
  }
  //导出Excel
  exportExcel =() =>{
   this.setState({
    exportBtnBool:true
   },()=>{
    if(this.state.activeKey === '1'){
      const str = `${API_PREFIX}services/web/party/partyExamReport/exportPartyExamStatistics`;
      const query = {
        'Q=parentId': this.state.partyid,
        'Q=name':this.state.dataInfo.name || '',
        'Q=startTime':`${this.state.dateData.startValue}%2000:00:00` || '',
        'Q=endTime':`${this.state.dateData.endValue}%2023:59:59` || '',
      }
      getExcelService(str,query,'党建考试按考试统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      })
    }else{
      const str = `${API_PREFIX}services/web/party/partyExamReport/exportPartyExamPartyOrgStatistics`;
      const query = {
        'Q=parentId': this.state.partyid,
        'Q=partyId':this.state.dataInfo.name || '',
        'Q=startTime':`${this.state.dateData.startValue}%2000:00:00` || '',
        'Q=endTime':`${this.state.dateData.endValue}%2023:59:59` || '',
        'Q=type':`${this.state.partyid}`
      }
      getExcelService(str,query,'党建考试按组织统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      })
    }
   })  
  }
  //日期修改
  onDateChange = (field, value) => {
    this.setState(()=>{
      this.state.dateData[field] = moment(value).format('YYYY-MM-DD');
    })
  }
  //查询是否是最小组织
  isMiniParty(record){
    getService(`${API_PREFIX}services/web/party/palmPartyClass/checkMinOrg/${record.id}`,data =>{
      if(data.status === 1){
        this.setState({
          isMiniPartyCount: data.root.object.count,
        },()=>{
         this.state.isMiniPartyCount == 0 ?
          window.location.href = `#/PartyBuildReport/StudyExamination/FirstOrganization?id=${record.id}`
        :
          window.location.href = `#/PartyBuildReport/StudyExamination/PartyBranchesDetail?id=${record.id}`;
        });
      }else{
        message.error('数据请求失败')
      }
    })
  }
  //级联事件
  cascaderChange = (value) => {
    this.setState({
      cascaderValue:value
    })
  }
  
  onSon = (ref) => {
    this.son = ref
  }
  render(){
    let powers = this.props.powers;
    let exportPowers = powers && powers['20011.25004.202'];
    const columns1 =[{
      title: '序号',
      dataIndex: 'key',
      key:'key',
      render: (text, record,index) => {
        return <div>
          <span>{(this.state.currentPage-1)*(this.state.pageSize) + index + 1}</span>
        </div>
      },
    },{
      title: '考试名称',
      dataIndex: 'name',
      key:'name',
    },{
      title: '接收人数',
      dataIndex: 'participant',
      key:'participant',
    },{
      title: '考试完成率',
      dataIndex: 'completeRate',
      key:'completeRate',
    },{
      title: '发布时间',
      dataIndex: 'publishDate',
      key:'publishDate',
    },{
      title: '操作',
      dataIndex: 'operation',
      key:'operation',
      render: (text, record) => {
        const id = encodeURIComponent(record.id);
        const completeNumber = encodeURIComponent(record.completeNum);
        const examRate = encodeURIComponent(record.completeRate);
        const participant = encodeURIComponent(record.participant);
        return <div>
          <a href={`#/PartyBuildReport/StudyExamination/ViewCompletionRate?id=${id}&completeNumber=${completeNumber}&examRate=${examRate}&allPeople=${participant}&parentId=${this.state.partyid}`} 
           style={{ display: 'inline-block' }} >查看完成率</a>
        </div>;
      },
    },];
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
      title: '党员人数',
      dataIndex: 'partyNumber',
      key:'partyNumber',
    },{
      title: '考试完成人数',
      dataIndex: 'partyCompNumber',
      key:'partyCompNumber',
    },{
      title: '考试完成率',
      dataIndex: 'completion',
      key:'completion',
    },{
      title: '平均成绩',
      dataIndex: 'score',
      key:'score',
    },{
      title: '操作',
      dataIndex: 'operation',
      key:'operation',
      render: (text, record) => {
        return <div >
          <a onClick={()=>{this.isMiniParty(record)}}>详情</a>
        </div>;
      },
    }];
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
    return <div className='PartyBuildExamination'>
      <Tabs type="card" defaultActiveKey={this.state.activeKey}   onChange={this.tabsChange}>
        <TabPane tab="按考试" key="1" style={{padding:'0 47px 0 27px',}}>
          <Spin spinning={this.state.loading}>
          <ExaminationContent onSon={this.onSon} resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} dateData={this.state.dateData} onDateChange={this.onDateChange} 
          dataInfo={this.state.dataInfo} exportExcel={this.exportExcel} activeKey={this.state.activeKey} pointData={this.state.pointData1} loading={this.state.loading}
          columns={columns1} rowSelection={rowSelection} pagination={pagination} exportPowers={exportPowers} exportBtnBool={this.state.exportBtnBool} />
        </Spin>
        </TabPane>
        <TabPane tab="按组织" key="2" style={{padding:'0 47px 0 27px',}}>
          <Spin spinning={this.state.loading}>
          <ExaminationContent onSon={this.onSon} resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} dateData={this.state.dateData} onDateChange={this.onDateChange}  exportBtnBool={this.state.exportBtnBool}
          dataInfo={this.state.dataInfo} activeKey={this.state.activeKey} pointData={this.state.pointData2} exportExcel={this.exportExcel} exportPowers={exportPowers}
          columns={columns2} pagination={pagination} organizations={this.state.organizations} cascaderChange={this.cascaderChange} loading={this.state.loading} cascaderValue={this.state.cascaderValue}/>
        </Spin>
        </TabPane>
      </Tabs>
    </div>
  }
}

class Examination extends Component{
  constructor(props){
    super(props);
    this.props.onSon(this)
  }
  handleSubmit= e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) =>{
      if(err){
        return;
      }
      if(this.props.activeKey !='1' && this.props.dateData.startValue === 'Invalid date') {
          message.error('请选择查询开始时间')
          return
      }
      if(this.props.activeKey !='1' && this.props.dateData.endValue === 'Invalid date') {
          message.error('请选择查询结束时间')
          return
      }
      this.props.changeDataInfo(fieldsValue)
    })
  }
  //重置按钮
  handleReset = () => {
    this.props.form.resetFields();
    this.child.props.form.resetFields()
    this.props.resetBtn()
    this.child.props.dateData.startValue = moment().subtract( 30, 'days').format('YYYY-MM-DD')
    this.child.props.dateData.endValue = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
  }
  onRef = (ref) => {
    this.child = ref
  }
  //级联事件
  handleChange=(value)=>{
    this.props.cascaderChange(value)
  }
  render(){
    //获取数据
    const { getFieldDecorator } = this.props.form;
    let exportBtn  = !this.props.exportPowers || this.props.exportBtnBool;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="inline" style={{borderBottom:'1px solid rgba(215,218,230,1)'}}>
        <Row>
          <Col span={8}>
            <FormItem  colon={false} label={this.props.activeKey ==='1'?'考试名称':'党组织名称'}>
            {
              this.props.activeKey ==='1' ?
              getFieldDecorator('name', {
                initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
              })(
                  <Input style={{width:200}} placeholder="请输入" />
              )
            :
              getFieldDecorator('name', {
                initialValue: this.props.cascaderValue ? this.props.cascaderValue : '',
              })(
                  // <Spin spinning={this.props.loading}>
                  <Cascader style={{width:200}} options={this.props.organizations} changeOnSelect  placeholder='请输入' onChange={this.handleChange}/>
                  // </Spin>
              )
            }
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem  colon={false} label='选择日期'>
              <DateRangeContent onRef={this.onRef} dateData={this.props.dateData} onDateChange={this.props.onDateChange}></DateRangeContent>
            </FormItem>
          </Col>
          <br />
          <FormItem style={{marginTop:10,paddingBottom:30}}>
            <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
            <Button style={{ width:80,borderRadius:12,marginLeft: 15 }} onClick={this.handleReset}>重置</Button>
          </FormItem>
          </Row>
        </Form>
        <div>
          <Button style={{ width: 80, borderRadius: 30, margin: '30px 0 20px 0' }} onClick={this.props.exportExcel} disabled={exportBtn} >导出Excel</Button>
          {
            this.props.activeKey ==='1'?
            <Table  className="tabCommon" dataSource={this.props.pointData} style={{padding:0}} columns={this.props.columns} 
            rowKey="id" rowSelection={this.props.rowSelection} pagination={this.props.pagination}  bordered/>
            :
            <Table  className="tabCommon" dataSource={this.props.pointData} style={{padding:0}} columns={this.props.columns} 
            rowKey="id" pagination={this.props.pagination}  bordered/>
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
    this.props.onRef(this)
    this.state = {
      ...this.props.dateData
    };
  }
  componentWillReceiveProps(nextProps){
    // this.props.form.resetFields()
    this.setState({
      ...nextProps.dateData
    });
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  onStartChange = (value) => {
    this.props.onDateChange('startValue', value);
    this.setState({'startValue':value})
  }
  onEndChange = (value) => {
        this.props.onDateChange('endValue', value);
        this.setState({'endValue':value});
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
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div>
        <Form>
          <Row>
            <Col span={9}>
              <FormItem label="" style={{marginBottom:0,marginRight:0}}>
              {getFieldDecorator('startValue', {
                  initialValue: moment(startValue, 'YYYY-MM-DD') 
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
            <Col span={3} style={{textAlign:'center',marginTop:8}}>
              <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
              </Col>
            <Col span={9}>
              <FormItem label="" style={{marginBottom:0,marginRight:0}}>
                {getFieldDecorator('endValue', {
                  initialValue: moment(endValue, 'YYYY-MM-DD')
                })(
                  <DatePicker
                    allowClear={true}  
                    // style={{height:24}}
                    // disabledDate={this.disabledEndDate}
                    format="YYYY-MM-DD"
                    onChange={this.onEndChange}
                    open={endOpen}
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
const ExaminationContent = Form.create()(Examination);
const DateRangeContent = Form.create()(DateRangeChange);
