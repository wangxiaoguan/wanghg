import React, { Component } from 'react'
import { Row, Col, Tabs,Input,Select,DatePicker,Button, Form, Table ,TreeSelect, Cascader, Spin, message } from 'antd'
import {Link} from 'react-router-dom'
import moment from 'moment'
const TabPane = Tabs.TabPane
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode;

import './ImportantWorkDeploy.less'
import  Organization from './Organization'
import {getService, exportExcelService1} from '../../../myFetch'
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
@connect(
  state => ({
    partyId: state.head.headPartyIdData,
    powers: state.powers,
  })
)
@Form.create()
export default class ImportantWorkDeploy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: '',
      endDate: '',
      selectedRowKeys: [], 
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      query: '',
      data: [],
      newsId: 0,
      partyId: null,
      taskTypeList: [],
      taskStatusList: [],
      partyValue: null,
      partyData: [],
      spinning: false,
      tabKey: '1',
      reportExcel: false
    }
  }
  partyDataTree = (partyList, arr) => {
    partyList.forEach(item => {
      if(item.partyOrgList && item.partyOrgList.length>0) {
        arr.push({
          label: item.partyName,
          value: item.id,
          key: item.id,
          children: []
        })
        this.partyDataTree(item.partyOrgList, arr[arr.length - 1].children)
      }else {
        arr.push({
          label: item.partyName,
          value: item.id,
          key: item.id
        })
      }
    })
    return arr
  }
  componentWillMount() {
    getService(`${API_PREFIX}services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, data => {
      let arr = []
      if(data.status == 1) {
        this.partyDataTree(data.root.object, arr)
        this.setState({
          partyData: arr
        })
      }
    })
    let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD') +'%2000:00:00'
    let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')  +'%2023:59:59'
    
    let query = `Q=startTime=${startDate}&Q=endTime=${endDate}&Q=upPartyId=${this.props.partyId}`
    this.setState({
      startDate,
      endDate,
      query,
      partyId: this.props.partyId,
      tabKey: sessionStorage.getItem('tabKey'),
    }, () => {
      if(JSON.stringify(this.props.partyId) !== "{}") {
        this.requestData(query) //获取初始数据
      } 
      // this.requestData(query) //获取初始数据
    })
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
  componentWillReceiveProps(nextProps) {
    console.log('nextProps==>>' , nextProps.reportExcel)
    if(this.state.partyId != nextProps.partyId) {
      let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD') + '%2000:00:00'
      let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD') + '%2023:59:59'
      let query = `Q=startTime=${startDate}&Q=endTime=${endDate}&Q=upPartyId=${nextProps.partyId}`
      this.setState({
        currentPage: 1,
        pageSize: 10,
        query: query,
        partyId: nextProps.partyId,
      }, () => {
        this.requestData(query)
      })
    } 
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  keyChange = (k) => {
    this.setState({
      tabKey: k
    })
  }
  reset= () => { //重置Form表单数据为默认值
    this.props.form.resetFields()
    this.setState({partyValue: null})
  }
  requestData = () => { //封装发送查询、分页请求
    let {currentPage, pageSize, partyId ,query} = this.state
    this.setState({spinning: true})
    let path = `${API_PREFIX}services/web/party/important/work/taskListPagesIndex/${currentPage}/${pageSize}?${query?`${query}`:''}`
    getService(path, data => {
      if(data.status == '1') {
        data.root.list && data.root.list.forEach((item, i) => {
          item['key'] = i + 1
        })
        this.setState({
          data: data.root.list || [],
          total: data.root.totalNum,
          spinning: false
        })
      }
      // else if(data.retCode == '2') {
      //   this.setState({
      //     data: [],
      //     total: data.root.totalNum,
      //     spinning: false
      //   })
      // }
      else {
        this.setState({spinning: false})
        message.error('请求数据失败')
      }  
    })
  }
  onChangeParty = (value) => {
    this.setState({ partyValue: value[value.length - 1] });
  }
  querySubmit = (e) => { //点击查询获取数据
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let startDate = values.checkDate1? `Q=startTime=${values.checkDate1.format('YYYY-MM-DD')+ '%2000:00:00'}`:''
        let endDate =  values.checkDate2? `&Q=endTime=${values.checkDate2.format('YYYY-MM-DD')+ '%2023:59:59'}` :''
        let tastName = values.taskName? `&Q=taskName=${values.taskName}`:''
        // let partyName = values.name.length?`&Q=uppartyid_EQ=${values.name[values.name.length-1]}`:''
        let partyName = ''
        if(values.name) {
          partyName = values.name.length?`&Q=partyId=${values.name[values.name.length-1]}`:''
        }
        let taskType = values.taskType?`&Q=taskType=${values.taskType}`:''
        let taskState = values.taskState?`&Q=taskStatus=${values.taskState}`:''
        let query = `${startDate}${endDate}${tastName}${partyName}${taskType}${taskState}&Q=upPartyId=${this.props.partyId}`
        this.setState({
          currentPage: 1,
          pageSize: 10,
          query,
        }, () => {
          this.requestData()
        })
      }
    });
  }
  change = (page,pageSize) => { //页码改变，发送请求获取数据
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
  toCompleteDetail = record => {
    getService(`${API_PREFIX}services/web/party/important/work/taskListPagesDetailsDrill/1/10?Q=taskId=${record.taskId}&Q=upPartyId=${record.upPartyId}`, data => {
     
      if(data.status == 2) {
        console.log('wowowowowowow', data)
        location.hash = `/PartyBuildReport/PartyBuildTask/MeetingCompleteRate?taskId=${record.taskId}&partyId=${record.upPartyId}&partyName=${record.upPartyName}`
      }else {
        let path = `/PartyBuildReport/PartyBuildTask/CompleteRate?taskId=${record.taskId}&partyId=${record.upPartyId}&partyName=${record.upPartyName}`
        location.hash = path
      }
    })
  }
  exportExcel = () => { //导出表格
    this.setState({reportExcel: true})
    let path = `${API_PREFIX}services/web/party/important/work/taskExportIndex?${this.state.query}`
    exportExcelService1(path, '重要工作按任务统计').then(data => {
      console.log(data)
      this.setState({reportExcel: data})
    })
  }
 
  render() {
    sessionStorage.setItem('tabKey', this.state.tabKey)
    let exports = this.props.powers && this.props.powers['20011.25001.202'];
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: '序号',
      key: 'key',
      dataIndex: 'key',
    }, {
      title: '任务名称',
      key: 'taskName',
      dataIndex: 'taskName',
    }, {
      title: '任务类型',
      key: 'taskType',
      dataIndex: 'taskType'
    },{
      title: '发起人',
      key: 'upUserName',
      dataIndex: 'upUserName',
    },{
      title: '发起人党组织',
      key: 'upPartyName',
      dataIndex: 'upPartyName',
    },{
      title: '任务截至时间',
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
      key: 'memJoinRatio',
      dataIndex: 'memJoinRatio',
    },{
      title: '操作',
      dataIndex: 'taskId',
      key: 'text',
      render: (text, record) => {
        return (
          <span>
            <a href='javascript:;' style={{color: '#007AFF'}} onClick={() => this.toCompleteDetail(record)}>查看完成率</a>
          </span>
        )
        
      }
    }]
    const { loading, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
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
      <div className='importantWorkDeploy'>
        <Tabs defaultActiveKey={this.state.tabKey} className='tab' onChange={this.keyChange}>
          <TabPane tab="按任务" key="1" className='tabItem'>
            <Spin size='large' spinning={this.state.spinning}>
              <div className='course'>
                <Form onSubmit={this.querySubmit}>
                  <Row>
                      <Col span={7}>
                        <FormItem>
                          <label>任务名称：</label>
                          {getFieldDecorator('taskName')(<Input placeholder="请输入" />) }    
                        </FormItem>
                      </Col>
                      <Col span={7}>
                        <FormItem>
                          <label>任务类型：</label>
                          {getFieldDecorator('taskType', {
                              initialValue: 0
                          })(
                            <Select>
                              {
                                this.state.taskTypeList.map((item, i) => {
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
                        {getFieldDecorator('taskState',{
                            initialValue: 0
                        })(
                          <Select >
                            {
                              this.state.taskStatusList.map((item, i) => {
                                return (<Option key={item.code} value={item.code}>{item.desp}</Option>)
                              })
                            }
                          </Select>
                        )}
                      </FormItem>
                    </Col>   
                  </Row>
                  <Row>
                    <Col span={7}>
                      <FormItem>
                        <label>发起人党组织：</label>
                        {
                          getFieldDecorator('name')(
                            <Cascader options={this.state.partyData} placeholder='请输入' changeOnSelect   />
                          )
                        } 
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <div>
                        <FormItem>
                          <label>选择时间：</label>
                          {getFieldDecorator('checkDate1', {
                            initialValue:moment(moment().subtract(30, 'days'), 'YYYY-MM-DD')
                          })(
                          <DatePicker format={'YYYY-MM-DD'} />
                          )}
                        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                          {getFieldDecorator('checkDate2', {
                            initialValue: moment(new Date(), 'YYYY-MM-DD')
                          })(
                          <DatePicker  format={'YYYY-MM-DD'} />
                          )}
                        </FormItem>
                      </div>
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
              <div>
                
                {
                  exports ? <Button className='excel' disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button> : null
                }
                <Table id='tableExcel' rowSelection={rowSelection} columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} />
              </div>
            </Spin>
          </TabPane>
          <TabPane tab="按组织" key="2" className='tabItem'>
            <Organization></Organization>
          </TabPane>
        </Tabs>      
      </div>
    );
  }
}