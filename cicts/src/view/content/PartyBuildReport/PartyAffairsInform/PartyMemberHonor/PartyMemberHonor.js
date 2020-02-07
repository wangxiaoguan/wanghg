
import  React,{ Component } from 'react';
import { Tabs,Form, Row, Col, Input, Button, Icon, DatePicker,Table,message, Cascader, Spin   } from 'antd';
import moment from 'moment';
import './PartyMemberHonor.less'
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
)

export default class PartyMemberHonor extends Component{
  constructor(props){
    super(props);
    var partyid = sessionStorage.getItem('partyid') || this.props.partyId;
    this.state = {
      organizations:[],
      loading:true,
      cascaderValue:[],
      pointData:[],   //表格数据
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
      exportBtnBool:false,
      partyid:partyid || -1,
      urlRequest:`${API_PREFIX}services/web/party/honor/getOrgSpecialPointList`,
    }
  }
  getStrByForm = (current, pageSize) => {
    let str = '?';
    if(this.state.partyid){
      str += `Q=id=${this.state.partyid}&`
    }
    // if(current || this.state.currentPage){
    //   str += `page=${current || this.state.currentPage}&`
    // }
    // if(pageSize || this.state.pageSize){
    //   str += `pageSize=${pageSize || this.state.pageSize}&`
    // }
    if(this.state.dataInfo.name&&this.state.dataInfo.name.length>0){
      str += `Q=name=${this.state.dataInfo.name}&`
    }
    if(this.state.dateData.startValue){
      str += `Q=startTime=${moment(this.state.dateData.startValue).format('YYYY-MM-DD 00:00:00')}&`     
    }
    if(this.state.dateData.endValue){
      str += `Q=endTime=${moment(this.state.dateData.endValue).format('YYYY-MM-DD 23:59:59')}&`  
    }
    str = str.substr(0,str.length-1)
    return str
  }
  //表单赋值
  changeDataInfo = (data) => {
    sessionStorage.setItem('honorDateData',JSON.stringify(this.state.dateData))
    // let arr = this.state.cascaderValue[this.state.cascaderValue.length-1];
    let arr = this.state.cascaderValue;
    this.setState({
      dataInfo:{
        ...data,
        name:arr,
        totalNum: 0,
        pageSize: 10,
        currentPage: 1,
      }
    },()=>{
      if(this.state.dataInfo.name.length==0){
        getService(`${API_PREFIX}services/web/party/honor/initialize?Q=id=${this.state.partyid}&Q=startTime=${moment(this.state.dateData.startValue).format('YYYY-MM-DD 00:00:00')}&Q=endTime=${moment(this.state.dateData.endValue).format('YYYY-MM-DD 23:59:59')}`,data=>{
          if(data.status === 1){
            this.setState({
              totalNum: 1,
              pointData: data.root.object,
            });
          }else{
            message.error(data.errorMsg);
          }
        })
      }else if(this.state.dataInfo.name&&this.state.dataInfo.name.length==1&&this.state.dataInfo.name[0]==this.state.partyid){
        getService(`${API_PREFIX}services/web/party/honor/initialize?Q=id=${this.state.partyid}&Q=startTime=${moment(this.state.dateData.startValue).format('YYYY-MM-DD 00:00:00')}&Q=endTime=${moment(this.state.dateData.endValue).format('YYYY-MM-DD 23:59:59')}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: 1,
            pointData: data.root.object,
          });
        }else{
          message.error(data.errorMsg);
        }
      })
      }else{
        let str = this.getStrByForm()
        //获取按任务查询列表初始数据
        getService(`${this.state.urlRequest}/1/10${str}`,data=>{
          if(data.status === 1){
            this.setState({
              totalNum: data.root.totalNum,
              pointData: data.root.list,
            });
          }else{
            message.error(data.errorMsg);
          }
        });
      }
      
    })
  }
  componentWillMount(){
    var dateData = sessionStorage.getItem('honorDateData');
    // debugger;
    // if(dateData){
    //   dateData = JSON.parse(dateData);
      // let fullTime = '';
      // const sTime = dateDate.startValue.split('-');
      // fullTime = `${sTime[0]}年${sTime[1]}月${sTime[2]}日`;
      // const eTime = dateDate.endValue.split('-');
      // fullTime = `${sTime[0]}年${sTime[1]}月${sTime[2]}日 —— ${eTime[0]}年${eTime[1]}月${eTime[2]}日`;
      // this.setState({
        // dateData,
        // time: fullTime
      // })
    // }else{
      let startValue = moment().subtract( 30, 'days').format('YYYY-MM-DD')
      let endValue = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
      this.setState({
        dateData:{
          ...this.state.dateData,
          startValue,
          endValue
        }
      },()=>{
        sessionStorage.setItem('honorDateData',JSON.stringify(this.state.dateData))
      })
    // }
    
    // let str = this.getStrByForm()
    // services/partybuildingreport/SpecialPointUI/initialize?id=1&startTime=2018-10-01&endTime=2018-11-30
    getService(`${API_PREFIX}services/web/party/honor/initialize?Q=id=${this.state.partyid}&Q=startTime=${startValue}%2000:00:00&Q=endTime=${endValue}%2023:59:59`,data=>{
      if(data.status === 1){
        this.setState({
          totalNum: 1,
          pointData: data.root.object,
        });
      }else{
        message.error(data.errorMsg);
      }
    })
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
            loading: false,
          });
        }
      }else{
        message.error(data.errorMsg);
      }
    });
  }
  componentWillReceiveProps(nextProps){
    var partyid =  sessionStorage.getItem('partyid') || nextProps.partyId;
    this.setState({
      partyid:partyid
    },()=>{
      let str = this.getStrByForm();
       console.log(str);
      // debugger;
      getService(`${API_PREFIX}services/web/party/honor/initialize${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.object,
          });
        }else{
          message.error(data.errorMsg);
        }
      })
    })
  }
  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  
  //重置按钮父组件
  resetBtn =() =>{
    this.setState({
      dataInfo:{},
      currentPage:1,
      pageSize:10,
      cascaderValue:[],
    },()=>{
      // let str = this.getStrByForm()
      // //获取按任务查询列表初始数据
      // getService(`${this.state.urlRequest}${str}`,data=>{
      //   if(data.retCode === 1){
      //     this.setState({
      //       totalNum: data.root.totalNum,
      //       pointData: data.root.list,
      //     });
      //   }else if(data.retCode === 0){
      //     message.error(data.retMsg);
      //   }
      // });
      // getService(`${API_PREFIX}services/partybuildingreport/SpecialPointUI/initialize?id=${this.state.partyid}&startTime=${this.state.dateData.startValue}%2000:00:00&endTime=${this.state.dateData.endValue}%2023:59:59`,data=>{
      //   if(data.retCode === 1){
      //     this.setState({
      //       totalNum: data.root.totalNum,
      //       pointData: data.root.list,
      //     });
      //   }else if(data.retCode === 0){
      //     message.error(data.retMsg);
      //   }else{
      //     message.error('数据请求失败')
      //   }
      // })
    })
  }
   //页码改变触发
  onPageChange = (current, pageSize) =>{
    if(!this.state.dataInfo.name){
      getService(`${API_PREFIX}services/web/party/honor/initialize?Q=id=${this.state.partyid}&Q=startTime=${moment(this.state.dateData.startValue).format('YYYY-MM-DD 00:00:00')}&Q=endTime=${moment(this.state.dateData.endValue).format('YYYY-MM-DD 23:59:59')}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: 1,
            pointData: data.root.object,
            currentPage: current,
            pageSize: pageSize,
          });
        }else{
          message.error(data.errorMsg);
        }
      })
    }else{
      let str = this.getStrByForm(current, pageSize)
      //获取按任务查询列表初始数据
      getService(`${this.state.urlRequest}/${current}/${pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
            currentPage: current,
            pageSize: pageSize,
          });
        }else{
          message.error(data.errorMsg);
        }
      });
    }
  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    if(!this.state.dataInfo.name){
      getService(`${API_PREFIX}services/web/party/honor/initialize?Q=id=${this.state.partyid}&Q=startTime=${moment(this.state.dateData.startValue).format('YYYY-MM-DD 00:00:00')}&Q=endTime=${moment(this.state.dateData.endValue).format('YYYY-MM-DD 23:59:59')}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: 1,
            pointData: data.root.object,
            currentPage: 1,
            pageSize: pageSize,
          });
        }else{
          message.error(data.errorMsg);
        }
      })
    }else{
      let str = this.getStrByForm(1, pageSize)
      //获取按任务查询列表初始数据
      getService(`${this.state.urlRequest}/1/${pageSize}${str}`,data=>{
        if(data.status === 1){
          this.setState({
            totalNum: data.root.totalNum,
            pointData: data.root.list,
            currentPage: 1,
            pageSize: pageSize,
          });
        }else{
          message.error(data.errorMsg);
        }
      });
    }
  }
  //导出Excel
  exportExcel =() =>{
    let str=''
    this.setState({
      exportBtnBool:true
    },()=>{
      if(this.state.dataInfo.name&&this.state.dataInfo.name.length==1&&this.state.dataInfo.name[0]==this.state.partyid||this.state.dataInfo.name==undefined||this.state.dataInfo.name.length==0){
        str = `${API_PREFIX}services/web/party/honor/specialPointInitializeExcel`
      }else{
        str = `${API_PREFIX}services/web/party/honor/specialPointExcel`
      }
       let  query= {
        'Q=id':this.state.partyid,
        // 'Q=name':this.state.dataInfo.name || '',
        'Q=startTime':`${moment(this.state.dateData.startValue).format('YYYY-MM-DD 00:00:00')}` || '',
        'Q=endTime':`${moment(this.state.dateData.endValue).format('YYYY-MM-DD 23:59:59')}` || '',
      }
     
       if(this.state.dataInfo.name&&this.state.dataInfo.name.length>0){
         query=[...query,{'Q=name':this.state.dataInfo.name}]
       }

      getExcelService(str,query,'党组织荣誉值统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      });
    })
  }
  //日期修改
  onDateChange = (field, value) => {
    this.setState(()=>{
      this.state.dateData[field] = moment(value).format('YYYY-MM-DD');
    })
  }
  //级联事件
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
    let exportPowers = powers && powers['20011.25007.202']
    const columns =[{
      title: '序号',
      dataIndex: 'index',
      key:'index',
      render: (text, record,index) => {
        return <div>
          <span>{(this.state.currentPage-1)*this.state.pageSize + index + 1}</span>
        </div>
      },
    },{
      title: '党组织名称',
      dataIndex: 'name',
      key:'name',
    },{
      title: '党员人数',
      dataIndex: 'feeNum',
      key:'feeNum',
    },{
      title: '党建任务增长值',
      dataIndex: 'partyTask',
      key:'partyTask',
    },{
      title: '党建资讯增长值',
      dataIndex: 'partyMessage',
      key:'partyMessage',
    },{
      title: '党建活动增长值',
      dataIndex: 'partyActivity',
      key:'partyActivity',
    },{
      title: '掌上党校增长值',
      dataIndex: 'partySchool',
      key:'partySchool',
    },{
      title: '党建考试增长值',
      dataIndex: 'partyExam',
      key:'partyExam',
    },{
      title: '人均增长值',
      dataIndex: 'growth',
      key:'growth',
    },{
      title: '操作',
      dataIndex: 'operation',
      key:'operation',
      render: (text, record) => {
        const id = encodeURIComponent(record.feeid);
        if(record.servlet === 0){
          return <div>
            <a href={`#/PartyBuildReport/PartyAffairsInform/FirstOrganization?id=${record.feeId}`} 
            style={{ display: 'inline-block' }}>详情</a>
          </div>;
        }else {
          return <div>
            <a href={`#/PartyBuildReport/PartyAffairsInform/PartyBranchesDetail?id=${record.feeId}`} 
            style={{ display: 'inline-block' }}>详情</a>
          </div>;
        }
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
    return <div className='PartyMemberHonor' style={{padding:'0 47px 0 27px',marginTop:30}}>
      <HonorContent onRef={this.onRef} resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} exportExcel={this.exportExcel} dateData={this.state.dateData} 
      organizations={this.state.organizations} loading={this.state.loading} cascaderChange={this.cascaderChange} cascaderValue={this.state.cascaderValue} exportBtnBool={this.state.exportBtnBool}
      onDateChange={this.onDateChange} dataInfo={this.state.dataInfo} pointData={this.state.pointData} columns={columns} pagination={pagination} exportPowers={exportPowers}/>
    </div>
  }
}

class Honor extends Component{
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
      if(this.props.dateData.startValue === 'Invalid date') {
          message.error('请选择查询开始时间')
          return
      }
      if(this.props.dateData.endValue === 'Invalid date') {
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
    this.sun.props.dateData.startValue = moment().subtract( 30, 'days').format('YYYY-MM-DD');
    this.sun.props.dateData.endValue = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
    sessionStorage.setItem('honorDateData',JSON.stringify(this.sun.props.dateData))
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
    let exportBtn  = !this.props.exportPowers || this.props.exportBtnBool;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="inline" style={{borderBottom:'1px solid rgba(215,218,230,1)'}}>
        <Row>
          <Col span={8}>
            <FormItem  colon={false} label='党组织名称'>
              {getFieldDecorator('name', {
                initialValue: this.props.cascaderValue ? this.props.cascaderValue : '',
              })(
                // <Input style={{width:200}} size='small' placeholder="请输入" />
                // <Spin spinning={this.props.loading}>
                  <Cascader options={this.props.organizations} placeholder='请输入' changeOnSelect  onChange={this.handleChange}/>
                // </Spin>
              )}
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem  colon={false} label='选择日期'>
              <DateRangeContent onSunRef={this.onSunRef} dateData={this.props.dateData} onDateChange={this.props.onDateChange}></DateRangeContent>
            </FormItem>
          </Col>
          <br />
          <FormItem style={{marginTop:10,paddingBottom:40}}>
            <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
            <Button style={{ width:80,borderRadius:12,marginLeft: 15 }} onClick={this.handleReset}>重置</Button>
          </FormItem>
          </Row>
        </Form>
        <div>
          <Button style={{ width:80,height:24,borderRadius:12,margin: '40px 0 20px 0'}} onClick={this.props.exportExcel} disabled={exportBtn} >
            导出Excel
          </Button>
          <Table  className="tabCommon" dataSource={this.props.pointData} style={{paddingRight:60}} columns={this.props.columns} 
          rowKey="xuhao" pagination={this.props.pagination}  bordered/>
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
    this.state = this.props.dateData;
  }
  componentWillReceiveProps(nextProps){
    this.state = nextProps.dateData;
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
    console.log("start",this.startValue)
    return (
      <div>
        <Form>
          <Row>
            <Col span={9}>
              <FormItem label="" style={{marginBottom:0,marginRight:0}}>
              {getFieldDecorator('startValue', {
                  initialValue: moment(startValue) ,})(
                <DatePicker 
                  allowClear={true}
                  style={{height:24}}
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
                  initialValue: moment(endValue) ,})(
                  <DatePicker
                    allowClear={true}
                    style={{height:24}}
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
const HonorContent = Form.create()(Honor);
const DateRangeContent = Form.create()(DateRangeChange);

