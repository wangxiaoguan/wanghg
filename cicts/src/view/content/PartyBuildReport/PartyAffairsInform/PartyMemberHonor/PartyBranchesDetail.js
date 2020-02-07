import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Select,message  } from 'antd';
import './PartyMemberHonor.less'
import {RuleConfig} from  '../../../ruleConfig';
import {GetQueryString, postService, getService, getExcelService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import {connect} from 'react-redux';

const FormItem = Form.Item;

@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    partyId:state.head.headPartyIdData,
    powers: state.powers,
  })
)
export default class PartyBranchesDetailFromHonor extends Component{
  constructor(props){
    super(props);
    const param = this.props.location.search.replace('?','').split('&');
    const partyid = decodeURIComponent(param[0].split('=')[1]);
    let oldPartyId =  sessionStorage.getItem('partyid') || nextProps.partyId;
    this.state = {
      time:'',
      pointData:[],
      totalNum: 0,
      pageSize: 10,
      currentPage:1,
      dataInfo:{},
      dateData : { //日期选择器内容
        startValue: '',
        endValue: '',
        endOpen: false,
      },
      isPost:['全部','有职务','无职务'],
      partyid,
      oldPartyId,
      exportBtnBool:false,
      urlRequest:`${API_PREFIX}services/web/party/honor/getPartyMemList`,
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
    // if(pageSize || this.state.dataInfo.pageSize){
    //   str += `pageSize=${pageSize || this.state.dataInfo.pageSize}&`
    // }
    if(this.state.dataInfo.username){
      str += `Q=username=${this.state.dataInfo.username}&`
    }
    if(this.state.dataInfo.userNo){
      str += `Q=userNo=${this.state.dataInfo.userNo}&`
    }
    if(this.state.dataInfo.HaveOrNo === 0){
      str += `Q=haveOrNo=${this.state.dataInfo.HaveOrNo}&`
    }else if(this.state.dataInfo.HaveOrNo !== '全部' && this.state.dataInfo.HaveOrNo){
      str += `Q=haveOrNo=${this.state.dataInfo.HaveOrNo}&`
    }else{
      str +=`Q=haveOrNo=2&`
    }
    if(this.state.dataInfo.PostName){
      str += `Q=postName=${this.state.dataInfo.PostName}&`
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
  componentDidMount(){
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
    }else{
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
    }
    // window.location.href=`#/PartyBuildReport/PartyAffairsInform/PartyMemberHonor/PartyBranchesDetail?id=${nextProps.partyId}`;
    // console.log(nextProps)
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
  //导出Excel
  exportExcel =() =>{
    this.setState({
      exportBtnBool:true
    },()=>{ 
      const str = `${API_PREFIX}services/web/party/honor/specialPointDetailsExcel`
      const query = {
        'Q=id':this.state.partyid,
        'Q=username':this.state.dataInfo.username || '',
        'Q=userNo':this.state.dataInfo.userNo || '',
        'Q=haveOrNo':this.state.dataInfo.HaveOrNo !== '全部' && this.state.dataInfo.HaveOrNo || 2,
        'Q=postName':this.state.dataInfo.PostName || '',
        'Q=startTime':this.state.dateData.startValue,
        'Q=endTime':this.state.dateData.endValue,
      }
      getExcelService(str,query,'党员荣誉值统计').then(data=>{
        this.setState({
          exportBtnBool:data
        })
      });
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
      dataIndex: 'xuhao',
      key:'xuhao',
      render: (text, record,index) => {
        return <div>
          <span>{(this.state.currentPage-1)*this.state.pageSize + index + 1}</span>
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
    },{
      title: '职务',
      dataIndex: 'postName',
      key:'postName',
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
      title: '总增长值',
      dataIndex: 'partySum',
      key:'partySum',
    },]
    let exportBtn  = !exportPowers || this.state.exportBtnBool;
    return (<div className='partyBranchesDetailFromMeet' style={{padding:'22px 26px 50px',}}>
        <span style={{marginBottom:40,fontSize:'2.2rem',display:'block'}}>{this.state.time}</span>
        
        <PartyBranchesFrom isPost={this.state.isPost} resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo}  dataInfo={this.state.dataInfo} />

        <Button style={{ width:80,height:24,borderRadius:12,margin:'40px 0 20px' }} onClick={this.exportExcel} disabled={exportBtn}>导出Excel</Button>
        <Table  className="tabCommon" dataSource={this.state.pointData} style={{padding:0,paddingRight:60}} columns={columns} 
          rowKey="xuhao" pagination={pagination}  bordered/>
        <Row type='flex' justify='center' style={{marginTop:10,marginRight:60}}>
          <Button style={{ width:90,height:24,borderRadius:8,}}  type="primary"  onClick={()=>{history.back()}}
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
      console.log(fieldsValue)
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
    return <div style={{paddingBottom:25,borderBottom:'1px solid rgba(229,229,229,1)'}}>
    <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="inline" >
      <Row>
        <Col span={6}>
          <FormItem {...formItemLayout}  colon={false} label='姓名'>
            {getFieldDecorator('username', {
              initialValue: this.props.dataInfo.username ? this.props.dataInfo.username : '',
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem {...formItemLayout}  colon={false} label='员工号'>
            {getFieldDecorator('userNo', {
              initialValue: this.props.dataInfo.userNo ? this.props.dataInfo.userNo : '',
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem  {...formItemLayout} colon={false} label='有无职务'>
            {getFieldDecorator('HaveOrNo', {
              initialValue: this.props.dataInfo.HaveOrNo ? this.props.dataInfo.HaveOrNo : '全部',
            })(
              <Select>
                <Select.Option key={0} value='2'>{this.props.isPost[0]}</Select.Option>
                <Select.Option key={1} value='1'>{this.props.isPost[1]}</Select.Option>
                <Select.Option key={2} value='0'>{this.props.isPost[2]}</Select.Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem  {...formItemLayout} colon={false} label='职务'>
            {getFieldDecorator('PostName', {
              initialValue: this.props.dataInfo.PostName ? this.props.dataInfo.PostName : '',
            })(
              <Input placeholder="请输入" />
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
