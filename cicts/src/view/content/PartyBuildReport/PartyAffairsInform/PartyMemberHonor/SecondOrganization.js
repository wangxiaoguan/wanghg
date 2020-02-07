import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Select  } from 'antd';
import './PartyMemberHonor.less'
import {RuleConfig} from  '../../../ruleConfig';

const FormItem = Form.Item;

export default class SecondOrganizationFromHonor extends Component{
  constructor(props){
    super(props);
    this.state = {
      data:{
        time:'2018年1月2日 - 至今',
        pointData:[],
      },
      totalNum: 0,
      pageSize: 10,
      dataInfo:{//表单内容
        name:''
      },
    }
  }
  //重置按钮父组件
  resetBtn =() =>{
    this.setState({dataInfo:{}})
  }
  //表单赋值
  changeDataInfo = (data) => {
    this.setState({dataInfo:data},()=>{console.log(this.state)})
  }
  //页码改变触发
  onPageChange = (current, pageSize) =>{
    getService(`${API_PREFIX}services/partybuildingreport/examReport/getExamListPage/${current}/${pageSize}`,data =>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      } else if(data.status === 0){
        message.error(data.retMsg);
      }
    });
  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    getService(`${API_PREFIX}services/partybuildingreport/examReport/getExamListPage/${current}/${pageSize}`,data =>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      } else if(data.status === 0){
        message.error(data.retMsg);
      }
    });
  }
  render(){
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
      dataIndex: 'index',
      key:'index',
      render: (text, record,index) => {
        return <div>
          <span>{index+1}</span>
        </div>
      },
    },{
      title: '党组织名称',
      dataIndex: 'name',
      key:'name',
    },{
      title: '支部数量',
      dataIndex: 'number',
      key:'number',
    },{
      title: '三会一课任务',
      dataIndex: 'task',
      key:'people',
    },{
      title: '支部党员大会',
      dataIndex: 'meeting',
      key:'meeting',
    },{
      title: '支部委员会',
      dataIndex: 'committee',
      key:'committee',
    },{
      title: '党小组会',
      dataIndex: 'group',
      key:'group',
    },{
      title: '党课',
      dataIndex: 'course',
      key:'course',
    },{
      title: '组织完成率',
      dataIndex: 'completionRate',
      key:'completionRate',
    },{
      title: '党员参与率',
      dataIndex: 'participationRate',
      key:'participationRate',
    },{
      title: '党员人数',
      dataIndex: 'number',
      key:'number',
    },{
      title: '操作',
      dataIndex: 'operation',
      key:'operation',
      render: (text, record) => {
        return <div>
          <a href={`#/PartyBuildReport/PartyAffairsInform/PartyMemberHonor/PartyBranchesDetail?id=${record.id}`} 
           style={{ display: 'inline-block' }}>详情</a>
        </div>;
      },
    },]
    return (<div className='secondOrganizationFromMeet' style={{padding:'22px 26px 50px',}}>
        <span style={{marginBottom:40,fontSize:'2.2rem',display:'block'}}>{this.state.data.time}</span>
        <SecondOrganizationFrom resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo}  dataInfo={this.state.dataInfo} />
        <Button style={{ width:80,height:24,borderRadius:12,margin:'20px 0' }} >导出Excel</Button>
        <Table  className="tabCommon" dataSource={this.state.data.pointData} style={{padding:0,paddingRight:60}} columns={columns} 
          rowKey="id" pagination={pagination}  bordered/>
        <Row type='flex' justify='center' style={{marginTop:10,marginRight:60}}>
          <Button style={{ width:90,height:24,borderRadius:8,}}  type="primary" 
          href={'#/PartyBuildReport/PartyAffairsInform/PartyMemberHonor/FirstOrganization'}
          >返回</Button>
        </Row>
    </div>)
  }
}

class SecondLevelOrganization extends Component{
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
  render(){
    //获取数据
    const { getFieldDecorator } = this.props.form;

    return <div style={{paddingBottom:40,borderBottom:'1px solid rgba(229,229,229,1)'}}>
    <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="inline" >
        <FormItem  colon={false} label='党组织名称'>
          {getFieldDecorator('name', {
            initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
            // ...RuleConfig.nameConfig,
          })(
            <Input style={{width:200}} size='small' placeholder="请输入" />
          )}
        </FormItem>
        <FormItem  style={{marginLeft:60}}>
          <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
          <Button style={{ width:80,borderRadius:12,marginLeft: 15 }}  onClick={this.handleReset}>重置</Button>
        </FormItem>
    </Form>
  </div>
  }
}
const SecondOrganizationFrom = Form.create()(SecondLevelOrganization);
