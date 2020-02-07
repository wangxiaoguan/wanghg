import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Cascader, Spin,message  } from 'antd';
import './PartyBuildExamination.less';
import {RuleConfig} from  '../../../ruleConfig';
import {GetQueryString, postService, getService, getExcelService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix'
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
export default class FirstOrganization extends Component{
  constructor(props){
    super(props);
    const param = this.props.location.search.replace('?','').split('&');
    const partyid = decodeURIComponent(param[0].split('=')[1]);
    this.state = {
      time:'',
      pointData:[],
      totalNum: 0,
      currentPage:1,
      pageSize: 10,
      dataInfo:{},
      partyid,
      dateDate : { //日期选择器内容
        startValue: null,
        endValue: null,
        endOpen: false,
      },
      organizations:[],
      isMiniPartyCount:1,
      exportBtnBool:false,
      urlRequest:`${API_PREFIX}services/web/party/partyExamReport/getPartyExamPartyOrgStatistics/`,
    }
  }
  getStrByForm = () => {
    let str = `?Q=parentId=${this.state.partyid}&`;
    if(this.state.dataInfo.name){
      str += `Q=partyId=${this.state.dataInfo.name}&`
    }
    if(this.state.dateDate.startValue){
      str += `Q=startTime=${this.state.dateDate.startValue}%2000:00:00&`
    }
    if(this.state.dateDate.endValue){
      str += `Q=endTime=${this.state.dateDate.endValue}%2023:59:59&`
    }
    str = str.substr(0,str.length-1)
    return str
  }
  componentWillMount(){
    var dateDate = sessionStorage.getItem('ExamDateData');
    dateDate = JSON.parse(dateDate);
    let fullTime = '';
    const sTime = dateDate.startValue.split('-');
    fullTime = `${sTime[0]}年${sTime[1]}月${sTime[2]}日`;
    const eTime = dateDate.endValue.split('-');
    fullTime = `${sTime[0]}年${sTime[1]}月${sTime[2]}日 —— ${eTime[0]}年${eTime[1]}月${eTime[2]}日`;
    this.setState({
      dateDate,
      time: fullTime
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
            loading: false,
          });
        }
      }else{
        message.error('数据请求失败')
      }
    });
    let str = this.getStrByForm();
     //获取列表初始数据
     getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
        });
      }else{
        message.error('数据请求失败')
      }
    });
  }
  componentWillReceiveProps(nextProps){
    const param = nextProps.location.search.replace('?','').split('&');
    const partyid = decodeURIComponent(param[0].split('=')[1]);
    this.setState({
      pointData:[],
      partyid,
      currentPage:1,
      pageSize:10,
    },()=>{
      let str = this.getStrByForm();
      //获取列表初始数据
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        }else{
          message.error('数据请求失败')
        }
      });
    });
  }
  //递归取出接口返回的部门的数据
  getDepartmentData(dpData){
    dpData.map((item,index)=>{
      // item.value=item.id;
      item.value=item.id;
      item.label=item.partyName;
      item.children=item.partyOrgList;
      if(item.partyOrgList){//不为空，递归
        this.getDepartmentData(item.partyOrgList)
      }
    });
  }
  //级联事件
  cascaderChange = (value) => {
    this.setState({
      dataInfo:{
        ...this.state.dataInfo,
        name:value[value.length-1]
      }
    })
  }
  //表单赋值
  changeDataInfo = (data) => {
    this.setState({
      dataInfo:{...data,name:data.name[data.name.length-1]},
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
    },()=>{
      let str = this.getStrByForm();
      //获取列表初始数据
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
            currentPage: 1,
            pageSize: 10,
          });
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
      }else{
        message.error('数据请求失败')
      }
    });
  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    let str = this.getStrByForm();
      getService(`${this.state.urlRequest}${1}/${pageSize}${str}`,data =>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: 1,
          pageSize: pageSize,
        });
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
      let str = this.getStrByForm();
      //获取列表初始数据
      getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
          });
        }else{
          message.error('数据请求失败')
        }
      });
    })
  }
  //查询是否是最小组织
  isMiniParty(record){
    getService(`${API_PREFIX}services/web/party/palmPartyClass/checkMinOrg/${record.id}`,data =>{
      if(data.status === 1){
        this.setState({
          isMiniPartyCount: data.root.object.count,
        },()=>{
          if(this.state.isMiniPartyCount == 0 ){
            // <a href={`#/PartyBuildReport/StudyExamination/FirstOrganization?id=${record.id}`}>详情</a>
            window.location.href = `#/PartyBuildReport/StudyExamination/FirstOrganization?id=${record.id}`;
            // location.reload()
          }else {
            // <a href={`#/PartyBuildReport/StudyExamination/PartyBranchesDetail?id=${record.id}`}>详情</a>
            window.location.href = `#/PartyBuildReport/StudyExamination/PartyBranchesDetail?id=${record.id}`;
          }
        });
      }else{
        message.error('数据请求失败')
      }
    })
  }
  //导出Excel
  exportExcel =() =>{
    this.setState({
      exportBtnBool:true
    },()=>{
      const str = `${API_PREFIX}services/web/party/partyExamReport/exportPartyExamPartyOrgStatistics`;
      const query = {
        'Q=parentId': this.state.partyid,
        'Q=partyId':this.state.dataInfo.name || '',
        'Q=startTime':`${this.state.dateDate.startValue}%2000:00:00` || '',
        'Q=endTime':`${this.state.dateDate.endValue}%2023:59:59` || '',
      }
      getExcelService(str,query,'党建考试按组织统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      });
    })
  }
  render(){
    let powers = this.props.powers;
    let exportPowers = powers && powers['20011.25004.202'];
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
    const columns = [{
      title: '序号',
      dataIndex: 'index',
      key:'index',
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
    },]
    let exportBtn  = !exportPowers || this.state.exportBtnBool;
    
    return (<div className='firstOrganization' style={{padding:'22px 26px 50px',}}>
        <span style={{marginBottom:40,fontSize:'2.2rem',display:'block'}}>{this.state.time}</span>

        <FirstOrganizationFrom cascaderChange={this.cascaderChange}  organizations={this.state.organizations} resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} dataInfo={this.state.dataInfo} />
        
        <Button style={{ width:80,borderRadius:30,margin:'40px 0 20px' }} onClick={this.exportExcel} disabled={exportBtn}>导出Excel</Button>
        <Table  className="tabCommon" dataSource={this.state.pointData} style={{padding:0,paddingRight:60}} columns={columns} 
          rowKey="id" pagination={pagination}  bordered/>
        <Row type='flex' justify='center' style={{marginTop:10,marginRight:60}}>
          <Button style={{ width:90,borderRadius:8,}}  type="primary" 
            onClick={()=>{history.back()}}
          >返回
          </Button>
        </Row>
    </div>)
  }
 }

class FirstLevelOrganization extends Component{
  constructor(props){
    super(props)
  }

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
  //级联事件
  handleChange=(value)=>{
    this.props.cascaderChange(value)
  }
  render(){
    //获取数据
    const { getFieldDecorator } = this.props.form;

    return <div style={{paddingBottom:40,borderBottom:'1px solid rgba(229,229,229,1)'}}>
      <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="inline" >
          <FormItem  colon={false} label='党组织名称'>
            {getFieldDecorator('name', {
              initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
            })(
              // <Input style={{width:200}} size='small' placeholder="请输入" />
                // <Spin spinning={this.props.loading}>
                <Cascader options={this.props.organizations} placeholder='请输入' changeOnSelect  onChange={this.handleChange}/>
                // </Spin>
            )}
          </FormItem>
          <FormItem style={{marginLeft:60}} >
            <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
            <Button style={{ width:80,borderRadius:12,marginLeft: 15 }}  onClick={this.handleReset}>重置</Button>
          </FormItem>
      </Form>
  </div>
  }
}
const FirstOrganizationFrom = Form.create()(FirstLevelOrganization);
