import  React,{ Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Select  } from 'antd';
import './PartyBuildExamination.less';
import {RuleConfig} from  '../../../ruleConfig';

const FormItem = Form.Item;

export default class SecondOrganization extends Component{
  constructor(props){
    super(props);
    this.state = {
      data:{
        time:'2018年1月2日 - 至今',
        pointData:[{
          id:1,
          index:1,
          name:'sdasd',
          number:20,
          people:10,
          rate:'50%',
          report:90,
        },{
          id:2,
          index:1,
          name:'sdasd',
          number:20,
          people:10,
          rate:'50%',
          report:90,
        },{
          id:3,
          index:1,
          name:'sdasd',
          number:20,
          people:10,
          rate:'50%',
          report:90,
        },],
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

  }
  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
   
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
    },{
      title: '党组织名称',
      dataIndex: 'name',
      key:'name',
    },{
      title: '党员人数',
      dataIndex: 'number',
      key:'number',
    },{
      title: '考试完成人数',
      dataIndex: 'people',
      key:'people',
    },{
      title: '考试完成率',
      dataIndex: 'rate',
      key:'rate',
    },{
      title: '平均成绩',
      dataIndex: 'report',
      key:'report',
    },{
      title: '操作',
      dataIndex: 'operation',
      key:'operation',
      render: (text, record) => {
        return <div>
          <a href={`#/PartyBuildReport/StudyExamination/PartyBuildExamination/PartyBranchesDetail?id=${record.id}`} 
           style={{ display: 'inline-block' }}>详情</a>
        </div>;
      },
    },]

    return (<div className='secondOrganization' style={{padding:'22px 26px 50px',}}>
        <span style={{marginBottom:40,fontSize:'2.2rem',display:'block'}}>{this.state.data.time}</span>

        <SecondOrganizationFrom resetBtn={this.resetBtn} changeDataInfo={this.changeDataInfo} dataInfo={this.state.dataInfo} />

        <Button style={{ width:80,borderRadius:30,margin:'40px 0 20px' }} >导出Excel</Button>
        <Table  className="tabCommon" dataSource={this.state.data.pointData} style={{padding:0,paddingRight:60}} columns={columns} 
          rowKey="id" pagination={pagination}  bordered/>
        <Row type='flex' justify='center' style={{marginTop:10,marginRight:60}}>
          <Button style={{ width:90,borderRadius:8,}}  type="primary" 
          href={'#/PartyBuildReport/StudyExamination/PartyBuildExamination/FirstOrganization'}
          >返回
          </Button>
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

    return <div style={{paddingBottom:40,borderBottom:'1px solid rgba(229,229,229,1)'}}>
    <Form onSubmit={this.handleSubmit} hideRequiredMark={true} layout="inline" >
        <FormItem  colon={false} label='党组织名称'>
          {getFieldDecorator('name', {
            initialValue: this.props.dataInfo.name ? this.props.dataInfo.name : '',
          })(
            <Input style={{width:200}} placeholder="请输入" />
          )}
        </FormItem>
        <FormItem style={{marginLeft:60}} >
          <Button style={{ width:80,borderRadius:12, }}  type="primary" htmlType="submit">查询</Button>
          <Button style={{ width:80,borderRadius:12,marginLeft: 15 }} onClick={this.handleReset}>重置</Button>
        </FormItem>
    </Form>
  </div>
  }
}
const SecondOrganizationFrom = Form.create()(SecondLevelOrganization);
