import React, { Component } from 'react'
import { Row, Col,Tabs,Input,Select,DatePicker,Button, Table, Form, Spin,message } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
const FormItem = Form.Item
const { RangePicker } = DatePicker
// import './CompleteRate.less'
import './style.less'
import {getService, exportExcelService1,GetQueryString} from '../../../myFetch'
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';

const columns = [{
    title: '序号',
    dataIndex: 'key',
  }, {
    title: '姓名',
    dataIndex: 'name',
  }, {
    title: '员工号',
    dataIndex: 'userNo',
  },
  {
    title: '完成状态',
    dataIndex: 'state',
    render: (text, record) => {
      return record.state=='1'?'已完成':'未完成'
    }
  },{
    title: '学习时长',
    dataIndex: 'studyTime',
  }]
  const columns2 = [{
    title: '课程完成人数',
    dataIndex: 'complete',
    render: (text,record) => {
      return `${record.complete}/${record.total}`
    }
  },{
    title: '课程完成率',
    dataIndex: 'total',
    render: (text, record) =>  record.total == '0'? '0.00%':`${(record.complete/record.total * 100).toFixed(2)}%`
  }]
  @Form.create()
  @connect(
    state => ({
      powers: state.powers,
    })
  )
export default class Organization extends Component {
  constructor(props) {
    super(props)
    this.state = {
      partyId: GetQueryString(location.hash,['id']).id,
      newsId: GetQueryString(location.hash,['newsId']).newsId,
      data: [],
      totalNum: 0,
      data2: [],
      currentPage: 1,
      pageSize: 10,
      query: '',
      level: '',
      spinning: false,
      reportExcel: false,
      total:GetQueryString(location.hash,['total']).total||0,//获取前一个页面传过来的总人数
    }
  }
  goback = () => {
    this.props.history.go(-1)
  }
  requestData = (page, pageSize, query) => {
    this.setState({
      spinning: true
    })
    let {newsId, partyId} = this.state
    let path = `${API_PREFIX}services/web/party/palmPartyClass/getPalmPartyMemStatistics/${page}/${pageSize}?Q=parentId=${partyId}&Q=newsId=${newsId}${query?`${query}`:''}`
    getService(path, data => {
      console.log(data)
      if(data.status == '1') {
        data.root.list && data.root.list.forEach((item, i) => {
          item['key'] = i + 1
        })
        this.setState({
          data: data.root.list || [],
          level: data.root.level,
          totalNum: data.root.totalNum,
          spinning: false
        })
      }else {
        message.error(data.errorMsg)
        this.setState({
          spinning: false
        })
      }
    })
  }
  componentWillMount() {
    this.requestData(this.state.currentPage, this.state.pageSize)
    this.getCompleteNum()
  }
  
  getCompleteNum = () => {
    let {newsId, partyId,total} = this.state
      getService(API_PREFIX + `services/web/party/palmPartyClass/getPalmPartyMemOverAllStatistics?Q=parentId=${partyId}&Q=newsId=${newsId}`,data=>{
          if(data.status === 1){
              let complete = data.root.object.complete
              let list = [{key:1,complete:complete,total:total}]
              this.setState({data2:list})
          }else{
              message.error(data.errorMsg)
          }
      })
  }

  changePage = (page,pageSize) => {
    this.setState({
      currentPage: page,
      pageSize: pageSize
    })
    this.requestData(page, pageSize, this.state.query)
  }
  pageSizeChange = (current, size) => {
    this.setState({
      currentPage: 1,
      pageSize: size
    })
    this.requestData(1, size, this.state.query)
  }
  reset= () => {
    this.props.form.resetFields()
  }
  querySubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        let name = values.name?`&Q=name=${values.name}`:''
        let userNo = values.userNo? `&Q=userNo=${values.userNo}`: ''
        // let idCard = values.idCard?`&Q=idcard_LK=${values.idCard}`: ''
        let complete = values.complete == '2'?'':`&Q=state=${values.complete}`
        let query = `${name}${userNo}${complete}`
        this.setState({
          currentPage: 1,
          pageSize: 10,
          query
        })
        this.requestData(1, 10, query)
      }
    })
  }
  exportExcel = () => {
    this.setState({reportExcel: true})
    let query = this.state.query ? `&${this.state.query}` : ''
    let {partyId, newsId} = this.state
    let path = `${API_PREFIX}services/web/party/palmPartyClass/exportPalmPartyMemStatistics?Q=parentId=${partyId}&Q=newsId=${newsId}${query}`
    exportExcelService1(path, '掌上党校按任务导出').then(data => {
      console.log(data)
      this.setState({reportExcel: data})
    })
  }
  render() {
    let pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: this.state.totalNum,
      current: this.state.currentPage,
      pageSize: this.state.pageSize,
      onChange: this.changePage,
      onShowSizeChange: this.pageSizeChange,
      showTotal: total => `共 ${total} 条`
    }
    const { getFieldDecorator } = this.props.form
    let exports = this.props.powers && this.props.powers['20011.25003.202'];
    console.log(this.state)
    return (
      <div className='examCompleteRate'>
        <div className='total'>
          {/* <div className='fs'>
            <span>{this.state.level}></span>
          </div> */}
          <div style={{marginBottom: '10px'}}>总体概况</div>
          <Table pagination={false} columns={columns2} dataSource={this.state.data2} bordered={true}></Table>
        </div>
        <div className='detail'>
          <Spin spinning={this.state.spinning} size='large'>
            <Row style={{marginBottom: '15px'}}>详细情况</Row>
            <Form  onSubmit={this.querySubmit}>
              <Row>
                <Col span={7}>
                <FormItem>
                  <label>姓名：</label>
                  {getFieldDecorator('name')(<Input className='partyName' placeholder="请输入" />)} 
                </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem>
                  <label>员工号：</label>
                  {getFieldDecorator('userNo')(<Input className='partyName' placeholder="请输入" />)} 
                  </FormItem>
                </Col>
                {/* <Col span={7}>
                  <FormItem>
                  <label>身份证号：</label>
                  {getFieldDecorator('idCard')(<Input className='partyName' disabled placeholder="请输入" />)} 
                  </FormItem>
                </Col> */}
                <Col span={6}>
                  <FormItem>
                    <label>完成状态：</label>
                    {getFieldDecorator('complete', {
                      initialValue: '2'
                    })(
                      <Select>
                        <Option value="2">全部</Option>
                        <Option value="1">已完成</Option>
                        <Option value="0">未完成</Option>
                      </Select>
                    )}    
                  </FormItem>
                </Col>
              </Row>
              <Row style={{marginTop: 15}}>
                <Col>
                  <Button type="primary" htmlType='submit'>查询</Button>
                  <Button onClick={this.reset}>重置</Button>
                </Col>
              </Row>   
            </Form>
          </Spin>
        </div>
        {
          exports ? <Button className='excelR' style={{margin:20}} onClick={this.exportExcel}>导出Excel</Button> : null
        }
        <Table className='table' columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} />
        <Row style={{textAlign: 'center', marginBottom: 20}}>
          <Button type="primary" className='back' className='goback' onClick={this.goback}>返回</Button>
        </Row>
      </div>
    )
  }
}