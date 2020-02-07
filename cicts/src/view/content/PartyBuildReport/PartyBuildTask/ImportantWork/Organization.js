import React, { Component } from 'react'
import { Row, Col,Tabs,Input,Select,DatePicker,Button, Table, Form, TreeSelect, Cascader, Spin, message } from 'antd'
import moment from 'moment'
const TabPane = Tabs.TabPane
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode;

import { Link } from 'react-router-dom'
import './Organization.less'
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
export default class Organization extends Component {
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
      partyId: null,
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
    this.setState({ partyValue: value });
  }
  requestData = () => {
    this.setState({spinning: true})
    let {currentPage,pageSize, query} = this.state
    let path = `${API_PREFIX}services/web/party/important/work/partyListPagesIndex/${currentPage}/${pageSize}?${query?`${query}`:''}`
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
    let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD') + '%2000:00:00'
    let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD') + '%2023:59:59'
    let query = `Q=startTime=${startDate}&Q=endTime=${endDate}&Q=drill=3&Q=upPartyId=${this.props.partyId}`
    this.setState({
      startDate: moment().subtract( 30, 'days').format('YYYY-MM-DD 00:00:00'),
      endDate: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59'),
      query,
      partyId: this.props.partyId
    }, () => {
      this.requestData()
    })
    // if(JSON.stringify(this.props.partyId) !== "{}") {
    //   this.requestData(this.state.currentPage, this.state.pageSize, this.props.partyId, query)
    // }
    // this.requestData()
  }
  componentWillReceiveProps(nextProps) {
    if(this.state.partyId != nextProps.partyId) {
      let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD') + '%2000:00:00'
      let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD') + '%2023:59:59'
      let query = `Q=startTime=${startDate}&Q=endTime=${endDate}&Q=drill=3&Q=upPartyId=${nextProps.partyId}`
      this.setState({
        currentPage: 1,
        pageSize: 10,
        partyId: nextProps.partyId,
        query,
      }, () => {
        this.requestData()
      })
    } 
  }
  change = (page,pageSize) => {
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
  reset= () => {
    this.props.form.resetFields()
    this.setState({partyValue: null})
  }
  querySubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        if(!values.getDate1) {
            message.error('请选择查询开始时间')
            return
        }
        let startDate = values.getDate1? `Q=startTime=${values.getDate1.format('YYYY-MM-DD') + '%2000:00:00'}`:''
        let endDate =  values.getDate2? `&Q=endTime=${values.getDate2.format('YYYY-MM-DD') + '%2023:59:59'}`:''
        let partyName = ''
        if(values.name) {
          partyName = values.name.length?`&Q=partyId=${values.name[values.name.length-1]}`:''
        }
        let query = `${startDate}${endDate}${partyName}&Q=upPartyId=${this.props.partyId}&Q=drill=3`
        this.setState({
          currentPage: 1,
          pageSize: 10,
          query,
          startDate: values.getDate1? values.getDate1.format('YYYY-MM-DD 00:00:00'): null,
          endDate: values.getDate2? values.getDate2.format('YYYY-MM-DD 23:59:59'): moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59'),
        }, () => {
          this.requestData()
        })
      }
    })
  }
  exportExcel = () => {
    this.setState({reportExcel: true})
    let path = `${API_PREFIX}services/web/party/important/work/partyExportIndex?${this.state.query}`
    exportExcelService1(path, '重要工作组织统计').then(data => {
      console.log(data)
      this.setState({reportExcel: data})
    })
  }
  toOrganizationDetail = (record) => {
    if(record.servlet == 1) {
      location.hash = `/PartyBuildReport/PartyBuildTask/LastCourseDetail?partyId=${record.partyId}`
      
    }else {
      location.hash = `/PartyBuildReport/PartyBuildTask/SecondCourseDetail?partyId=${record.partyId}`  
    }
    // sessionStorage.setItem('partyName', record.partyName)
  }
  render() {
    let exports = this.props.powers && this.props.powers['20011.25001.202'];
    sessionStorage.setItem('date', JSON.stringify({startDate: this.state.startDate, endDate: this.state.endDate}))
    const columns = [{
        title: '序号',
        dataIndex: 'key',
      }, {
        title: '党组织名称',
        dataIndex: 'partyName',
      }, {
        title: '重要工作部属',
        dataIndex: 'allPartyCount',
      },{
        title: '组织完成率',
        dataIndex: 'partyRatio',
      },{
        title: '党员参与率',
        dataIndex: 'memRatio',
      },{
        title: '党员人数',
        dataIndex: 'partyMemCount',
      },{
        title: '操作',
        // dataIndex: 'caozuo',
        render: (text, record) => {
          return (
            <span>
              <a href="javascript:;" onClick={() => this.toOrganizationDetail(record)} style={{color: '#1890FF'}}>详情</a>
            </span>
          )
        }
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
      <div className='workOrganization'>
        <Spin spinning={this.state.spinning} size='large'>
          <div className='search'>
            <Form onSubmit={this.querySubmit}>
              <Row>
                <Col span={8} className='treeselect'>
                  <FormItem>
                    <label>党组织名称：</label>
                    {
                      getFieldDecorator('name')(
                        <Cascader options={this.state.partyData} placeholder='请输入' changeOnSelect  onChange={this.onChangeParty} />
                      )
                      } 
                  </FormItem>
                </Col>
                <Col span={12} className='ranger'>
                  <FormItem>
                    <label>选择时间：</label>
                    {getFieldDecorator('getDate1', {
                      initialValue:moment(moment().subtract(30, 'days'), 'YYYY-MM-DD')
                    })(
                    <DatePicker onChange={this.onChangeStart} format={'YYYY-MM-DD'} />
                    )}
                  <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                    {getFieldDecorator('getDate2', {
                      initialValue: moment(new Date(), 'YYYY-MM-DD')
                    })(
                    <DatePicker onChange={this.onChangeEnd} format={'YYYY-MM-DD'} />
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
            exports ? <Button className='excel' disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button> : null
          }
          <Table className='tableData' columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} />
        </Spin>
      </div>
    )
  }
}