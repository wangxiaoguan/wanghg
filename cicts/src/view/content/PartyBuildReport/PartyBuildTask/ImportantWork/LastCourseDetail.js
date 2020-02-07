import React, { Component } from 'react'
import { Row, Col,Tabs,Input,Select,DatePicker,Button, Table, Form, Spin, message } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
import {Link} from 'react-router-dom'
import './LastCourseDetail.less'
import {getService, exportExcelService1} from '../../../myFetch'
import API_PREFIX from '../../../apiprefix';
import moment from 'moment'
import { connect } from 'react-redux';
@connect(
  state => ({
    powers: state.powers,
  })
)
@Form.create()
export default class FirstCourseDetail extends Component {
    constructor(props) {
      super(props)
      this.state = {
        startDate: '',
        endDate: '',
        query: '',
        data: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        partyId: props.location.search.substr(1).split('=')[1],
        taskTypeList: [],
        taskStatusList: [],
        spinning: false,
        reportExcel: false
      }
    }  
    requestData = () => { //封装查询、分页等请求的函数
      this.setState({spinning: true})
      let {currentPage, pageSize, query} = this.state
      let path = `${API_PREFIX}services/web/party/important/work/partyListPagesDetailsDrill/${currentPage}/${pageSize}?${query?`${query}`:''}`
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
          this.setState({spinning: false})
          message.error('请求数据失败')
        }
      })
    }
    componentWillMount() {
      let date = JSON.parse(sessionStorage.getItem('date'))
      let query = `Q=startTime=${date.startDate}&Q=endTime=${date.endDate}&Q=upPartyId=${this.state.partyId}`
      this.setState({
        startDate: date.startDate,
        endDate: date.endDate,
        query
      }, () => {
        this.requestData()
      })
      // this.requestData(this.state.currentPage, this.state.pageSize, query)
      getService(`${API_PREFIX}services/web/party/taskType/getList/1/1000`, data => { //获取任务类型数据
        if(data.status === 1) {
          data.root.list.unshift({
            appName: "SmartMs",
            id: 0,
            typeName: "全部",
            revision: 1
          })
          this.setState({
            taskTypeList: data.root.list,
            taskStatusList: [
              {code: 0, desp: '全部',},
              {code: 2, desp: '进行中',},
              {code: 3, desp: '已截至',}
            ]
          })
        }
      })
      // getService(`${API_PREFIX}services/partybuildingreport/lookUp/queryTaskStatus`, data => { //获取任务状态数据
      //   data.unshift({
      //     appName: "SmartMs",
      //     code: 0,
      //     desp: "全部",
      //     revision: 1
      //   })
      //   this.setState({
      //     taskStatusList: data
      //   })
      // })
    }
    goback = () => { // 返回按钮
      history.back()
    } 
    reset= () => { //重置Form表单数据
      this.setState({
        currentPage: 1,
        pageSize: 10,
      })
      this.props.form.resetFields()
    }
    change = (page,pageSize) => { //页码改变函数
      this.setState({
        currentPage: page,
        pageSize: pageSize
      }, () => {
        this.requestData()
      })
    }
    pageSizeChange = (current, size) => {
      this.setState({
        currentPage: 1,
        pageSize: size
      }, () => {
        this.requestData()
      })
    }
    querySubmit = (e) => { //表单提交函数
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          console.log(this.props.form.getFieldValue('partyName'))


          let name = values.partyName?`&Q=taskName=${values.partyName}`:''
          let type = values.taskType?`&Q=taskType=${values.taskType}`:''
          let status = values.taskState?`&Q=status=${values.taskState}`:''
          let query = `Q=startTime=${this.state.startDate}&Q=endTime=${this.state.endDate}&Q=upPartyId=${this.state.partyId}${name}${type}${status}`
          this.setState({
            currentPage: 1,
            pageSize: 10,
            query,
          },()=>{
            this.requestData(1, 10, query)
          })
         
        }
      })
    }
    exportExcel = () => { //导出表格
      this.setState({reportExcel: true})
      let path = `${API_PREFIX}services/web/party/important/work/partyExportDetailsDrill?${this.state.query}`
      exportExcelService1(path, '重要工作组织详情统计').then(data => {
        console.log(data)
        this.setState({reportExcel: data})
      })
    }
    render() {
      let exports = this.props.powers && this.props.powers['20011.25001.202']
      const columns = [{
        title: '序号',
        key: 'key',
        dataIndex: 'key',
      }, {
        title: '任务名称',
        key: 'taskName',
        dataIndex: 'taskName',
      }, {
        title: '关联上级工作部署',
        key: 'linkTaskName',
        dataIndex: 'linkTaskName',
      },{
        title: '任务类型',
        key: 'typeName',
        dataIndex: 'typeName',
      },{
        title: '任务截止时间',
        key: 'endTime',
        dataIndex: 'endTime',
      },{
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
      },{
        title: '任务状态',
        key: 'statusName',
        dataIndex: 'statusName',
      },{
        title: '党员参与率',
        key: 'memRation',
        dataIndex: 'memRation',
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
      return (
        <div className='lastCourse'>
          <Spin spinning={this.state.spinning} size='large'>
            <div className='search'>
              <div className='fs'>
              <span>{moment(this.state.startDate).format('YYYY-MM-DD')}  </span>
              <span> ~ </span>
              <span>{moment(this.state.endDate).format('YYYY-MM-DD')}</span>
              </div>
              <Form  onSubmit={this.querySubmit}>
                <Row>
                  <Col span={7}>
                    <FormItem>
                      <label>任务名称：</label>
                      {getFieldDecorator('partyName', {
                        initialValue:""
                      })(<Input placeholder="请输入" />) }  
                    </FormItem>
                  </Col>
                  <Col span={7}>
                    <FormItem>
                      <label>任务类型：</label>
                      {getFieldDecorator('taskType', {
                        initialValue: 0
                      })(
                        <Select>
                          {this.state.taskTypeList.map((item, i) => {
                              return (<Option key={item.id} value={item.id}>{item.typeName}</Option>)
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={7}>
                    <FormItem>
                      <label>任务状态：</label>
                      {getFieldDecorator('taskState', {
                          initialValue: 0
                      })(
                        <Select >
                        {this.state.taskStatusList.map((item, i) => {
                            return (<Option key={item.code} value={item.code}>{item.desp}</Option>)
                          })
                        }
                      </Select>
                    )} 
                    </FormItem>
                  </Col>     
                </Row>
                <Row style={{marginTop: 20}}>
                  <Col>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                  </Col>
                </Row>
              </Form>
            </div>
            
            {
              exports ? <Button className='excelF' disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button> : null
            }
            <Table className='tableData' columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} />
            <Row style={{textAlign: 'center', marginTop: 20}}>
              <Button type="primary" className='back' onClick={this.goback}>返回</Button>
            </Row>
          </Spin>
      </div>
      )
  }
}
