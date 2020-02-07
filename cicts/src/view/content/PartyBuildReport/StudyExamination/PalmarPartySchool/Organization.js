import React, { Component } from 'react'
import { Row, Col,Tabs,Input,Select,DatePicker,Button, Table, Form, Spin, message,Cascader } from 'antd'
import moment from 'moment'
const TabPane = Tabs.TabPane
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
import { Link } from 'react-router-dom'
// import './Organization.less'
import './style.less'
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
      currentPage: 1,
      pageSize: 10,
      data: [],
      query: '',
      total: 0,
      spinning: false,
      partyId: null,
      reportExcel: false,
      dp: [],
    }
  }
  requestData = () => {
    this.setState({
      spinning: true
    }) 
    let {currentPage,pageSize,query,partyId} = this.state
    let path = ''
    if(partyId != -1) {
      path = `${API_PREFIX}services/web/party/palmPartyClass/getPalmPartyPartyOrgStatistics/${currentPage}/${pageSize}?${query?`${query}`:''}` 
    }else {
      path = `${API_PREFIX}services/web/party/palmPartyClass/getPalmPartyOnePartyOrgStatistics/?${query?`${query}`:''}`
    }
    getService(path, data => {
      console.log(data)
      if(data.status === 1) {
        if(data.root.list){
          data.root.list && data.root.list.forEach((item, i) => {
            item['key'] = i + 1
          })
        }else{
          data.root.object && data.root.object.forEach((item, i) => {
            item['key'] = i + 1
          })
        }

        this.setState({
          data: data.root.list || data.root.object || [],
          total: data.root.totalNum,
          spinning: false
        })
      }else {
        this.setState({
          spinning:false
        })
        message.error(data.errorMsg)
      }
    })
  }
    //处理组织机构中的数据
    dealDepartmentData(data) {
      data.map((item, index) => {
        item.value = item.id + '';
        // item.value=item.name;
        item.label = item.partyName;
        item.children = item.partyOrgList;
        if (item.partyOrgList) {
          //不为空，递归
          this.dealDepartmentData(item.partyOrgList);
        }
      });
    }
  componentWillMount() {
    let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD')+ '%2000:00:00'
    let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')+ '%2023:59:59'
    // let code = this.props.partyId == -1 ? `&Q=type_EQ=parentid`:`&Q=type_EQ=id`
    let query = `Q=parentId=${this.props.partyId}&Q=type=id&Q=startTime=${startDate}&Q=endTime=${endDate}`
    this.setState({
      startDate,
      endDate,
      query,
      partyId: this.props.partyId,
      query,
    }, () => {
      if(JSON.stringify(this.props.partyId) !== "{}") {
        this.requestData()
      }
    })
    //获取部门的数据
    let organizationData = [];
    getService(
      API_PREFIX + 'services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1',
      data => {
        if (data.status === 1) {
          organizationData = data.root.object;
          this.dealDepartmentData(organizationData);
          this.setState({ dp: organizationData });
        }else{
          message.error(data.errorMsg);
        }
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    // let code = nextProps.partyId == -1 ? `&Q=type_EQ=parentid`:`&Q=type_EQ=id`
    if(this.state.partyId != nextProps.partyId) {
      let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD')+ '%2000:00:00'
      let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')+ '%2023:59:59'
      let query = `Q=parentId=${nextProps.partyId}&Q=type=id&Q=startTime=${startDate}&Q=endTime=${endDate}`
      this.setState({
        currentPage: 1,
        pageSize:10,
        query,
        partyId: nextProps.partyId,
        startDate,
        endDate,
      }, () => {
        this.requestData()
      })
    } 
  }
  reset= () => {
    this.props.form.resetFields()
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
        let startDate = values.getDate1 ? `&Q=startTime=${values.getDate1.format('YYYY-MM-DD')}`+ '%2000:00:00': ''
        let endDate =  values.getDate2 ? `&Q=endTime=${values.getDate2.format('YYYY-MM-DD')}`+ '%2023:59:59' : ''
        // let name = values.partyName?`&Q=name_LK=${values.partyName}`:''
        // let name = values.partyName?`&Q=name_LK=${values.partyName[values.partyName.length - 1]}`:''
        let name = values.partyName?`&Q=partyId=${values.partyName[values.partyName.length - 1]}`:''
        // let code = this.state.partyId == -1 ? `Q=type_EQ=parentid`:`Q=type_EQ=id`
        let query = `Q=parentId=${this.state.partyId}&Q=type=id&${startDate}${endDate}${name}`
        this.setState({
          currentPage: 1,
          pageSize: 10,
          query,
          startDate: values.getDate1 ? values.getDate1.format('YYYY-MM-DD 00:00:00') : null,
          endDate: values.getDate2? values.getDate2.format('YYYY-MM-DD 23:59:59') : moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59')
        }, () => {
          this.requestData()
        })
      }
    })
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
  exportExcel = () => {
    this.setState({reportExcel: true})
    let path = ''
    if(this.state.partyId != -1) {
      path = `${API_PREFIX}services/web/party/palmPartyClass/exportPalmPartyPartyOrgStatistics?${this.state.query}`
    }else {
      path = `${API_PREFIX}services/web/party/palmPartyClass/exportPalmPartyOnePartyOrgStatistics?${this.state.query}`
    }
    exportExcelService1(path, '掌上党校组织统计').then(data => {
      console.log(data)
      this.setState({reportExcel: data})
    })
  }
  toOrganizationDetail = record => {
    getService(`${API_PREFIX}services/web/party/palmPartyClass/checkMinOrg/${record.partyId}`, data => {
      console.log(data)
      if(!data.root.object.count) {
        location.hash = `/PartyBuildReport/StudyExamination/SecondCourseDetail?name=${record.name}&partyid=${record.partyId}`
      }else {
        location.hash = `/PartyBuildReport/StudyExamination/LastCourseDetail?name=${record.name}&partyid=${record.partyId}`
      }
    })
  }
  
  render() {
    sessionStorage.setItem('date', JSON.stringify({startDate: this.state.startDate, endDate: this.state.endDate}))
    console.log(this.state)
    const columns = [{
      title: '序号',
      dataIndex: 'key',
    }, {
      title: '党组织名称',
      dataIndex: 'name',
    }, {
      title: '党员人数',
      dataIndex: 'total',
    },{
      title: '必修课完成人数',
      dataIndex: 'obligatory',
    },{
      title: '必修课完成率',
      dataIndex: 'obligatoryCr',
      // render: (text, record) => {
      //   return `${record.obligatorycr.split('.')[0]}%`
      // }
    },{
      title: '选修课完成人数',
      dataIndex: 'elective'
    },{
      title: '选修课完成率',
      dataIndex: 'electiveCr',
      // render: (text, record) => {
      //   return `${record.electivecr.split('.')[0]}%`
      // }
    },{
      title: '操作',
      dataIndex: 'appName',
      render: (text, record) => {
        let path = `/PartyBuildReport/StudyExamination/FirstCourseDetail?name=${record.name}&partyid=${record.partyId}`
          return (
            <span>
              {/* <Link  to={path} style={{color: '#007AFF'}}>详情</Link> */}
              <a href='javascript:;' onClick={() => this.toOrganizationDetail(record)} style={{color: '#007AFF'}}>详情</a>
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
    let exports = this.props.powers && this.props.powers['20011.25003.202']
    return (
      <div className='organization'>
        <Spin spinning={this.state.spinning} size='large'>
          <div className='search'>
              <Form onSubmit={this.querySubmit}>
                <Row>
                  <Col span={8}>
                    <FormItem>
                      <label>党组织名称：</label>
                      {getFieldDecorator('partyName')(
                      // <Input className='partyName' placeholder="请输入" />
                      <Cascader className='partyName' options={this.state.dp} changeOnSelect placeholder="请选择关键字"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12} className='ranger'>
                    <FormItem>
                        <label>选择时间：</label>
                        {getFieldDecorator('getDate1', {
                          initialValue:moment(moment().subtract(30, 'days'), 'YYYY-MM-DD')
                        })(
                        <DatePicker onChange={this.startDateChange} format={'YYYY-MM-DD'} />
                        )}
                      <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                        {getFieldDecorator('getDate2', {
                          initialValue: moment(new Date(), 'YYYY-MM-DD')
                        })(
                        <DatePicker onChange={this.endDateChange} format={'YYYY-MM-DD'} />
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