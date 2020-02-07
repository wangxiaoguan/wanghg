import React, { Component } from 'react'
import { Row, Col,Tabs,Input,Select,DatePicker,Button, Table, Form ,TreeSelect, Cascader, Spin, message } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode;
import {Link} from 'react-router-dom'
import './CompleteRate.less'
import {getService, exportExcelService1} from '../../../myFetch'
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
@connect(
  state => ({
    powers: state.powers,
  })
)
@Form.create()
export default class Organization extends Component {
  constructor(props) {
    super(props)
    let obj = {}
    props.location.search.substr(1).split('&').forEach((item, index) => {
      obj[item.split('=')[0]] = item.split('=')[1] 
    })
    this.state = {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      query: '',
      data: [],
      taskId: obj.taskId,
      partyId: obj.partyId,
      partyName: decodeURI(obj.partyName),
      data2: [],
      partyData: [],
      partyValue: null,
      spinning: false,
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
  onChangeParty = (value) => {
    console.log(value)
    this.setState({ partyValue: value });
  }
  requestData = () => { //封装发送查询、分页请求
    this.setState({spinning: true})
    let {currentPage, pageSize,partyId,taskId,query} = this.state
    let path = `${API_PREFIX}services/web/party/important/work/taskListPagesDetailsDrill/${currentPage}/${pageSize}?${query?`${query}`:''}`
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
      }else if(data.retCode == '2') {
        this.setState({
          data: [],
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
    // system/partyOrganization/partyOrganizationList/get
    getService(`${API_PREFIX}services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, data => {
      console.log('ttttttttttttttttttt', data)
      let arr = []
      if(data.status == 1) {
        this.partyDataTree(data.root.object, arr)
        this.setState({
          partyData: arr
        })
      }
    })
    this.setState({
      query: `Q=upPartyId=${this.state.partyId}&Q=taskId=${this.state.taskId}`,
    }, () => {
      this.requestData()
    })
    getService(`${API_PREFIX}services/web/party/important/work/taskListPagesOverAllDrill/${this.state.taskId}/${this.state.partyId}`, data => { //获取总体概况数据
      // console.log(data)
      if(data.status === 1) {
        data['key'] = 1
        let arr =[]
        arr.push(data.root.object)
        this.setState({
          data2: arr
        })
      }
      
    })
  }
  componentWillReceiveProps(nextProps) {
    let obj = {}
    nextProps.location.search.substr(1).split('&').forEach((item, index) => {
      obj[item.split('=')[0]] = item.split('=')[1] 
    })
    if(obj.partyId != this.state.partyId || obj.taskId != this.state.taskId) {
      this.setState({
        pageSize: 10,
        currentPage: 1,
        taskId: obj.taskId,
        partyId: obj.partyId,
        partyName: decodeURI(obj.partyName),
        query: `Q=upPartyId=${obj.partyId}&Q=taskId=${obj.taskId}`,
      }, () => {
        this.requestData()
      })
      // this.requestData(this.state.currentPage, this.state.pageSize,obj.taskId, obj.partyId)
      getService(`${API_PREFIX}services/web/party/important/work/taskListPagesOverAllDrill/${obj.taskId}/${obj.partyId}`, data => { //获取总体概况数据
        // console.log(data)
        if(data.status === 1) {
          data['key'] = 1
          let arr =[]
          arr.push(data.root.object)
          this.setState({
            data2: arr
          })
        }
      })
    }
  }
  querySubmit = (e) => { //点击查询获取数据
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        // let partyName = values.name.length?`Q=partyid_EQ=${values.name[values.name.length-1]}`:''
        let partyName = ''
        if(values.name) {
          partyName = values.name.length?`&Q=partyId=${values.name[values.name.length-1]}`:''
        }
        let isComplete = values.isComplete == '-1'?'':`&Q=isComplete=${values.isComplete}`
        let query = `Q=upPartyId=${this.state.partyId}&Q=taskId=${this.state.taskId}${partyName}${isComplete}`
        this.setState({
          currentPage: 1,
          pageSize: 10,
          query
        }, () => {
          this.requestData()
        })
        // this.requestData(1, 10, this.state.taskId, this.state.partyId, query)
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
  exportExcel = () => { //导出表格
    this.setState({reportExcel: true})
    let path = `${API_PREFIX}services/web/party/important/work/taskExportDetailsDrill?${this.state.query}`
    exportExcelService1(path, '重要工作按任务统计').then(data => {
      console.log(data)
      this.setState({reportExcel: data})
    })
  }
  reset= () => { //重置Form表单数据为默认值
    this.props.form.resetFields()
    this.setState({partyValue: null})
  }
  goback = () => {
    history.back()
  }
  toCompleteDetail = record => {
    getService(`${API_PREFIX}services/web/party/important/work/taskListPagesDetailsDrill/1/10?Q=taskId=${record.taskId}&Q=upPartyId=${record.partyId}`, data => {
      console.log('wowowowowowow', data)
      if(data.status == 2) {
        location.hash = `/PartyBuildReport/PartyBuildTask/MeetingCompleteRate?taskId=${record.taskId}&partyId=${record.partyId}&partyName=${record.upPartyName}`
      }else {
        let path = `/PartyBuildReport/PartyBuildTask/CompleteRate?taskId=${record.taskId}&partyId=${record.partyId}&partyName=${record.upPartyName}`
        location.hash = path
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { loading, selectedRowKeys } = this.state;
    const columns = [{
      title: '序号',
      dataIndex: 'key',
    }, {
      title: '党组织名称',
      dataIndex: 'upPartyName',
    }, {
      title: '完成状态',
      dataIndex: 'statusName',
    },{
      title: '参与党员数',
      dataIndex: 'allMemCount',
    },{
      title: '党员参与率',
      dataIndex: 'memJoinRatio',
    },{
      title: '操作',
      key: 'text',
      dataIndex: 'key',
      render: (text, record) => {
        let path = `/PartyBuildReport/CompleteRate?taskId=${record.taskId}&partyId=${record.partyId}&partyName=${record.upPartyName}`
        if(record.servlet == 1 || !record.taskStatus) {
          return (
            <span>
              <Button style={{border: 0}} disabled>详情</Button>
            </span>
          )
        }else {
          return (
            <span>
              <a href='javascript:;' onClick={() => this.toCompleteDetail(record)} style={{color: '#007AFF'}}>详情</a>
            </span>
          )
        }
        
      }
    }
  ];
  const columns2 = [{
      title: '完成组织数',
      dataIndex: 'finishOrg'
    },{
      title: '组织完成率',
      dataIndex: 'finishRate'
    },{
      title: '参与党员数',
      dataIndex: 'joinNumber'
    },{
      title: '党员参与率',
      dataIndex: 'joinRate'
    }]
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
    let exports = this.props.powers && this.props.powers['20011.25001.202'];
    return (
      <div className='completeRate'>
        <Spin spinning={this.state.spinning} size='large'>
          <div className='total'>
            <div className='fs'>
              <span>{this.state.partyName}</span>
            </div>
            <div style={{marginBottom: '10px'}}>总体概况</div>
            <Table pagination={false} columns={columns2} dataSource={this.state.data2} bordered={true}></Table>
          </div>
          <div className='detail'>
            <Row style={{marginBottom: '15px'}}>详细情况</Row>
            <Form onSubmit={this.querySubmit}>
              <Row>
                <Col span={6} style={{marginRight: 30}} className='treeselect'>
                  <FormItem>
                  <label>党组织名称：</label>
                  {
                    getFieldDecorator('name')(
                      <Cascader options={this.state.partyData} placeholder='请输入' changeOnSelect  onChange={this.onChangeParty} />
                    )
                   } 
                </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <label>完成状态：</label>
                    {getFieldDecorator('isComplete', {
                        initialValue: -1
                      })(
                        <Select>
                          <Option value={-1}>全部</Option>
                          <Option value='0'>未完成</Option>
                          <Option value='1'>已完成</Option>
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button  onClick={this.reset}>重置</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          {
            exports ? <Button className='excelR' disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button> : null
          }
          <Table className='tableData' columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} />
          <Row style={{textAlign: 'center', marginBottom: 20}}>
            <Button type="primary" className='goback' onClick={this.goback}>返回</Button>
          </Row>
        </Spin>
      </div>
    )
  }
}