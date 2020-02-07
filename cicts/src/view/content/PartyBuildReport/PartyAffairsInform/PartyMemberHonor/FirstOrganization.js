import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form,Cascader, Spin,message    } from 'antd';
import './PartyMemberHonor.less'
import {RuleConfig} from  '../../../ruleConfig';
import {GetQueryString, postService, getService, getExcelService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import {connect} from 'react-redux';

const FormItem = Form.Item;

@connect(
  state => ({
    dataSource: state.table.tableData,
    partyId:state.head.headPartyIdData,
    pageData:state.table.pageData,
    powers: state.powers,
  })
)
export default class FirstOrganizationFromHonor extends Component{
  constructor(props){
    super(props);
    const param = this.props.location.search.replace('?','').split('&');
    const partyid = decodeURIComponent(param[0].split('=')[1]);
    // let oldPartyId =  sessionStorage.getItem('partyid') || nextProps.partyId;
    let oldPartyId =  sessionStorage.getItem('partyid');
    this.state = {
      time:'',
      pointData:[],
      totalNum: 0,
      pageSize: 10,
      currentPage:1,
      dataInfo:{},//表单数据
      partyid,
      oldPartyId, //判断是否切换用户
      dateData : { //日期选择器内容
        startValue: null,
        endValue: null,
        endOpen: false,
      },
      organizations:[],
      exportBtnBool:false,
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
    if(this.state.dataInfo.name){
      str += `Q=name=${this.state.dataInfo.name}&`
    }
    if(this.state.dateData.startValue){
      str += `Q=startTime=${this.state.dateData.startValue}%2000:00:00&`
    }
    if(this.state.dateData.endValue){
      str += `Q=endTime=${this.state.dateData.endValue}%2023:59:59&`
    }
    str = str.substr(0,str.length-1)
    return str
  }
  componentWillMount(){
    var dateData = sessionStorage.getItem('honorDateData');
    dateData = JSON.parse(dateData);
    let fullTime = '';
    const sTime = dateData.startValue.split('-');
    fullTime = `${sTime[0]}年${sTime[1]}月${sTime[2]}日`;
    const eTime = dateData.endValue.split('-');
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
      }else if(data.status === 0){
        message.error(data.errorMsg);
        // this.setState({ loading: false });
      }else{
        message.error('数据请求失败')
      }
    });
    let str = this.getStrByForm()
    //获取按任务查询列表初始数据
    getService(`${this.state.urlRequest}/1/10${str}`,data=>{
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
    let partyId =  sessionStorage.getItem('partyid') || nextProps.partyId;
    if(partyId !== this.state.oldPartyId){
      window.location.href = '#/PartyBuildReport/PartyAffairsInform/PartyMemberHonor'
      return
    }else if(this.props.location.search != nextProps.location.search){
      const param = nextProps.location.search.replace('?','').split('&');
      const partyid = decodeURIComponent(param[0].split('=')[1]);
      this.setState({
        pointData:[],
        partyid,
        currentPage:1,
        pageSize:10,
      },()=>{
        let str = this.getStrByForm()
        //获取按任务查询列表初始数据
        getService(`${this.state.urlRequest}/1/10${str}`,data=>{
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
      });
    }
  }
  //重置按钮父组件
  resetBtn =() =>{
    this.setState({
      dataInfo:{},
      pageSize: 10,
      currentPage:1,
    },()=>{
      let str = this.getStrByForm()
      //获取按任务查询列表初始数据
      getService(`${this.state.urlRequest}/1/10${str}`,data=>{
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
   //页码改变触发
  onPageChange = (current, pageSize) =>{
    let str = this.getStrByForm(current, pageSize)
    getService(`${this.state.urlRequest}/${current}/${pageSize}${str}`,data =>{
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
    let str = this.getStrByForm(current, pageSize)
    getService(`${this.state.urlRequest}/1/${pageSize}${str}`,data =>{
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
      const str = `${API_PREFIX}services/web/party/honor/specialPointExcel`
      const query = {
        'Q=id':this.state.partyid,
        'Q=name':this.state.dataInfo.name || '',
        'Q=startTime':`${this.state.dateData.startValue}%2000:00:00` || '',
        'Q=endTime':`${this.state.dateData.endValue}%2023:59:59` || '',
      }
      getExcelService(str,query,'党组织荣誉值统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      });
    })
  }
  //表单赋值
  changeDataInfo = (data) => {
    this.setState({
      // dataInfo:{...data,name:data.name[data.name.length-1]},
      dataInfo:{...data,name:data.name},
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
    },()=>{
      let str = this.getStrByForm()
      getService(`${this.state.urlRequest}/1/10${str}`,data=>{
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
  //级联事件
  cascaderChange = (value) => {
    console.log(value)
    this.setState({
      dataInfo:{
        ...this.state.dataInfo,
        name:value[value.length-1]
      }
    })
  }
  render(){
    let powers = this.props.powers;
    let exportPowers = powers && powers['20011.25007.202']
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
    },]
    
    let exportBtn  = !exportPowers || this.state.exportBtnBool;
    return (<div className='firstOrganizationFromHonor' style={{padding:'22px 26px 50px',}}>
        <span style={{marginBottom:40,fontSize:'2.2rem',display:'block'}}>{this.state.time}</span>

        <FirstOrganizationForm cascaderChange={this.cascaderChange}  organizations={this.state.organizations} resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} dataInfo={this.state.dataInfo} />
        
        <Button style={{ width:80,height:24,borderRadius:12,margin:'20px 0' }} onClick={this.exportExcel} disabled={exportBtn}>导出Excel</Button>
        <Table  className="tabCommon" dataSource={this.state.pointData} style={{padding:0,paddingRight:60}} columns={columns} 
          rowKey="xuhao" pagination={pagination}  bordered/>
        <Row type='flex' justify='center' style={{marginTop:10,marginRight:60}}>
          <Button style={{ width:90,height:24,borderRadius:8,}}  type="primary" 
          // href={'#/PartyBuildReport/PartyAffairsInform/PartyMemberHonor'}
          onClick={()=>{history.back()}} >返回
          </Button>
        </Row>
    </div>)
  }
 }

class FirstLevelOrganizationInMeet extends Component{
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
const FirstOrganizationForm = Form.create()(FirstLevelOrganizationInMeet);
