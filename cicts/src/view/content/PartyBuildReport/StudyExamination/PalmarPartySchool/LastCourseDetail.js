import React, { Component } from 'react'
import { Row, Col,Tabs,Input,Select,DatePicker,Button, Table, Form, Spin, message  } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
import {Link} from 'react-router-dom'
// import './LastCourseDetail.less'
import './style.less'
import {getService, exportExcelService1} from '../../../myFetch'
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import moment from 'moment';
@connect(
  state => ({
    powers: state.powers,
  })
)
@Form.create()
export default class FirstCourseDetail extends Component {
  constructor(props) {
    super(props)
    let obj ={}
    props.location.search.substr(1).split('&').forEach((item, index) => {
      obj[item.split('=')[0]] = item.split('=')[1] 
    })
    this.state = {
      startDate: '',
      endDate: '',
      name: obj.name,
      partyid: obj.partyid,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      data: [],
      spinning: false,
      reportExcel: false
    }
  }
  requestData = (page, pageSize, query) => {
    this.setState({
      spinning: true
    })

    let path = `${API_PREFIX}services/web/party/palmPartyClass/getPalmPartyPartyOrgMemStatistics/${page}/${pageSize}?${query?`${query}`:''}`
    getService(path, data => {
      console.log(data)
      if(data.status == '1') {
        data.root.list && data.root.list.forEach((item, i) => {
          item['key'] = i + 1
        })
        this.setState({
          data: data.root.list || [],
          total: data.root.totalNum,
          spinning: false
        })
      }else {
        this.setState({
          spinning: false
        })
        message.error('获取数据失败')
      }
    })
  }
  componentWillMount() {
    let date = JSON.parse(sessionStorage.getItem('date'))
    let query = `Q=parentId=${this.state.partyid}&Q=startTime=${date.startDate}&Q=endTime=${date.endDate}`;

    console.log(moment(date.startDate,'YYYY-MM-DD').format('YYYY-MM-DD 00:00:00'))
    this.setState({
      startDate:date.startDate,
      endDate: date.endDate,
      query
    })
    this.requestData(this.state.currentPage, this.state.pageSize, query);
  }
  goback = () => {
    history.back()
  } 
  reset= () => {
    this.props.form.resetFields()
  }
  querySubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        let userName = values.userName?`&Q=name=${values.userName}&`:''
        let userNumber = values.userNumber?`&Q=userNo=${values.userNumber}&`:''
        let query = `${userName}${userNumber}Q=parentId=${this.state.partyid}&Q=startTime=${this.state.startDate}&Q=endTime=${this.state.endDate}`
        this.setState({
          currentPage: 1,
          pageSize: 10,
          query
        })
        this.requestData(1, 10, query)
      }
    })
  }
  change = (page,pageSize) => {
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
  exportExcel = () => {
    this.setState({reportExcel: true})
    let path = `${API_PREFIX}services/web/party/palmPartyClass/exportPalmPartyPartyOrgMemStatistics?${this.state.query}`//将exportOrg修改为exportGroup/xwx2019/3/11
    exportExcelService1(path, '掌上党校组织统计').then(data => {
      console.log(data)
      this.setState({reportExcel: data})
    })
  }
  render() {
    const columns = [{
      title: '序号',
      dataIndex: 'key',
    }, {
      title: '姓名',
      dataIndex: 'name'
    }, {
      title: '员工号',
      dataIndex: 'userNo',
    },{
      title: '必修课完成次数/完成率',
      dataIndex: 'obligatoryAndCr',
      // render: (text, record) => {
      //   return `${record.obligatory.split('.')[0]}%`
      // }
    },{
      title: '选修课完成次数/完成率',
      dataIndex: 'electiveAndCr',
      // render: (text, record) => {
      //   return `${record.elective.split('.')[0]}%`
      // }
    },{
      title: '学习时长',
      dataIndex: 'studyTime',
    }];
    const { getFieldDecorator } = this.props.form
    let pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: this.state.total,
      current: this.state.currentPage,
      pageSize: this.state.pageSize,
      onChange: this.change,
      onShowSizeChange: this.pageSizeChange,
      showTotal: total => `共 ${total} 条`
    }  
    let exports = this.props.powers && this.props.powers['20011.25003.202'];
    return (
      <div className='lastCourse'>
        <Spin spinning={this.state.spinning} size='large'>
          <div className='search'>
            <div className='fs'>
              <span>{moment(this.state.startDate,'YYYY-MM-DD').format('YYYY-MM-DD')}   </span>
              <span> ~ </span>
              <span>{moment(this.state.endDate,'YYYY-MM-DD').format('YYYY-MM-DD')}</span>
            </div>
            <Form onSubmit={this.querySubmit}>
              <Row>
                <Col span={8}>
                  <label>姓名：</label>
                  { getFieldDecorator('userName')(<Input className='partyName' placeholder="请输入" />) } 
                </Col>
                <Col span={8}>
                  <label>员工号：</label>
                  { getFieldDecorator('userNumber')(<Input className='partyName' placeholder="请输入" />) }
                    
                </Col>
              </Row>
              <Row>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.reset}>重置</Button>
              </Row>
            </Form>
          </div>
          {
            exports ? <Button className='excelF' onClick={this.exportExcel}>导出Excel</Button> : null
          }
          <Table className='tableData' columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} />
          <Row style={{textAlign: 'center', marginTop: 20}}>
            <Button type="primary" className='goback' onClick={this.goback}>返回</Button>
          </Row>
        </Spin>
      </div>
    )
  }
}
