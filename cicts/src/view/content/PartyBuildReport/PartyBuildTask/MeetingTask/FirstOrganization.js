import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form,Cascader, Spin,message  } from 'antd';
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

export default class FirstOrganizationFromMeet extends Component{
  constructor(props){
    super(props);
    const param = this.props.location.search.replace('?','').split('&');
    const partyid = decodeURIComponent(param[0].split('=')[1]);
    this.state = { 
      organizations:[],
      loading:true,
      cascaderValue:[],
      time:'',
      pointData:[],
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      dataInfo:{},//表单数据
      dateData : { //日期选择器内容
        createdate_D_GE: null,
        createdate_D_LE: null,
        endOpen: false,
      },
      partyid,
      exportBtnBool:false,
      urlRequest:`${API_PREFIX}services/web/party/threeLesson/getListByPartyInfo/`,
    }
  }
  getStrByForm = () => {
    let str = `?Q=upPartyId=${this.state.partyid}&`;
    if(this.state.dataInfo.name){
      str += `Q=partyId=${this.state.dataInfo.name}&`
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
        // message.error(data.retMsg+'1');
        this.setState({ loading: false });
        message.error('数据请求失败')
      }
    });
    let str = this.getStrByForm();
    //获取按组织查询列表初始数据
    getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
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
  }
  componentWillReceiveProps(nextProps){
    if(this.props.location.search != nextProps.location.search){
      const param = nextProps.location.search.replace('?','').split('&');
      const partyid = decodeURIComponent(param[0].split('=')[1]);
      this.setState({
        dataInfo:{},
        pointData:[],
        partyid,
        currentPage:1,
        pageSize:10,
      },()=>{
        let str = this.getStrByForm();
        //获取按组织查询列表初始数据
        getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}${str}`,data=>{
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
      })
    }
  }
  //重置按钮父组件
  resetBtn =() =>{
    this.setState({
      dataInfo:{},
      cascaderValue:[]
    })
    // this.setState({
    //   dataInfo:{},
    //   currentPage:1,
    //   pageSize:10,
    // }
    // ,()=>{
    //   let str = this.getStrByForm();
    //   //获取按组织查询列表初始数据
    //   getService(`${this.state.urlRequest}${this.state.currentPage}/${this.state.pageSize}/${this.state.partyid}${str}`,data=>{
    //     if(data.retCode === 1){
    //       this.setState({
    //         totalNum: data.root.totalNum,
    //         pointData: data.root.list,
    //       });
    //     }else if(data.retCode === 0){
    //       message.error(data.retMsg);
    //     }else{
    //       message.error('数据请求失败')
    //     }
    //   });
    // })
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
    getService(`${this.state.urlRequest}${1}/${pageSize}${str}`,data =>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: 1,
          pageSize: pageSize,
        });
      } else if(data.status === 0){
        message.error(data.errorMsg);
      }else{
        message.error('数据请求失败')
      }
    });
  }
  //表单赋值
  changeDataInfo = (data) => { 
    let arr = this.state.cascaderValue[this.state.cascaderValue.length-1];
    this.setState({
      dataInfo:{
        ...data,
        name:arr,
        totalNum: 0,
        pageSize: 10,
        currentPage: 1,
      },
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
  //导出Excel
  exportExcel =() =>{
    this.setState({
      exportBtnBool:true
    },()=>{
      const query = {
        'Q=upPartyId':this.state.partyid,
        'Q=partyId':this.state.dataInfo.name || '',
        'Q=startTime': `${this.state.dateData.createdate_D_GE}%2000:00:00` || '',
        'Q=endTime': `${this.state.dateData.createdate_D_LE}%2023:59:59` || '',
      }
      const str = `${API_PREFIX}services/web/party/threeLesson/exportListByPartyInfo`
      getExcelService(str,query,'三会一课按组织统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      });
    })
    
  }
  cascaderChange = (value) => {
    this.setState({
      cascaderValue:value
    })
  }
  render(){
    let powers = this.props.powers;
    let exportPowers = powers && powers['20011.25002.202'];
    let pagination = {
      total: this.state.totalNum,
      pageSize: this.state.pageSize,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      showTotal: total => `共 ${total} 条`
    };
    const columns = [{
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
    },]
    
    let exportBtn  = !exportPowers || this.state.exportBtnBool;
    return (<div className='firstOrganizationFromMeet' style={{padding:'22px 26px 50px',}}>
        <span style={{marginBottom:40,fontSize:'2.2rem',display:'block'}}>{this.state.time}</span>

        <FirstOrganizationForm resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} dataInfo={this.state.dataInfo} 
        cascaderChange={this.cascaderChange} organizations={this.state.organizations} loading={this.state.loading}/>
        
        <Button style={{ width:80,borderRadius:12,margin:'20px 0' }} onClick={this.exportExcel} disabled={exportBtn}>导出Excel</Button>
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

class FirstLevelOrganizationInMeet extends Component{
  constructor(props){
    super(props)
  }

  //级联事件
  handleChange=(value)=>{
    this.props.cascaderChange(value)
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
  render(){
    //获取数据
    const { getFieldDecorator } = this.props.form;

    return <div style={{paddingBottom:40,}}>
      <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="inline" >
          <FormItem  colon={false} label='党组织名称' >
            {getFieldDecorator('name', {
              initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
            })(
              // <Input style={{width:200}} size='small' placeholder="请输入" />
              // <Spin spinning={this.props.loading}>
                <Cascader style={{width:300}} options={this.props.organizations} placeholder='请输入' changeOnSelect  onChange={this.handleChange} />
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
const FirstOrganizationForm = Form.create()(FirstLevelOrganizationInMeet);
