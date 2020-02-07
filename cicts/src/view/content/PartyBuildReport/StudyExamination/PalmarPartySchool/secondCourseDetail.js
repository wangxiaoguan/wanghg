import React, { Component } from 'react'
import { Row, Col,Tabs,Input,Select,DatePicker,Button, Table, Form, Spin, message,Cascader  } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
import {Link} from 'react-router-dom'
// import './secondCourseDetail.less'
import './style.less'
import {getService, exportExcelService1,GetQueryString} from '../../../myFetch'
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
    this.state = {
      startDate: '',
      endDate: '',
      name: GetQueryString(location.hash,['name']).name,
      partyid: GetQueryString(location.hash,['partyid']).partyid,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      data: [],
      spinning: true,
      reportExcel: false,
      dp: [],
      query: '',
    }
  }
  requestData = (page, pageSize, query) => {
    this.setState({
      spinning: true
    })
    let path = `${API_PREFIX}services/web/party/palmPartyClass/getPalmPartyPartyOrgStatistics/${page}/${pageSize}?${query?`${query}`:''}`
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
          spinning:false
        })
        message.error('获取数据失败')
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
    let date = JSON.parse(sessionStorage.getItem('date'))
    let query = `Q=parentId=${this.state.partyid}&Q=type=parentId&Q=startTime=${date.startDate}&Q=endTime=${date.endDate}`
    this.setState({
      startDate: date.startDate,
      endDate: date.endDate,
      query
    })
    this.requestData(this.state.currentPage, this.state.pageSize, query)
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
    console.log('1111',nextProps)
    let obj ={}
    nextProps.location.search.substr(1).split('&').forEach((item, index) => {
      obj[item.split('=')[0]] = item.split('=')[1] 
    })
    let date = JSON.parse(sessionStorage.getItem('date'))
    if(obj.partyid != this.state.partyid) {
      let query = `Q=parentId=${obj.partyid}&Q=type=parentId&Q=startTime=${date.startDate}&Q=endTime=${date.endDate}`
      this.setState({
        name: obj.name,
        partyid: obj.partyid,
        currentPage: 1,
        pageSize: 10,
        startDate: date.startDate,
        endDate: date.endDate,
        query
      })
      this.requestData(1, 10, query)
    }
    
  }
  
  goback = () => {
    // this.props.history.push(`/PartyBuildReport/StudyExamination/PalmarPartySchool/FirstCourseDetail?name=${this.state.name}&partyid=${this.state.partyid}`)
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
        // let name = values.partyName?`&Q=name_LK=${values.partyName}`:''
        let name = values.partyName?`&Q=partyId=${values.partyName[values.partyName.length - 1]}`:''
        let query = `Q=parentId=${this.state.partyid}&Q=type=parentId&${name}&Q=startTime=${this.state.startDate}&Q=endTime=${this.state.endDate}`
        this.setState({
          currentPage: 1,
          pageSize: 10,
          query,
        },()=>{
          this.requestData(1, 10, query)
        });
       
      }
    })
  }
  change = (page,pageSize) => {
    this.setState({
      currentPage: page,
      pageSize: pageSize
    })
    this.requestData(page, pageSize,this.state.query)
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
    let path = `${API_PREFIX}services/web/party/palmPartyClass/exportPalmPartyPartyOrgStatistics?${this.state.query}`
    exportExcelService1(path, '掌上党校组织统计').then(data => {
      console.log(data)
      this.setState({reportExcel: data})
    })
  }
  toOrganizationDetail = record => {
    getService(`${API_PREFIX}services/web/party/palmPartyClass/checkMinOrg/${record.partyId}`, data => {
      console.log(data)
      if(data.root.object.count == '0') {
        this.props.history.push(`/PartyBuildReport/StudyExamination/SecondCourseDetail?name=${record.name}&partyid=${record.partyId}`)
      }else {
        location.hash = `/PartyBuildReport/StudyExamination/LastCourseDetail?name=${record.name}&partyid=${record.partyId}`
      }
    })
  }
  render() {
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
      dataIndex: 'elective',
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
        let path = `/PartyBuildReport/StudyExamination/PalmarPartySchool/LastCourseDetail?name=${record.name}&partyid=${record.partyId}`
          return (
            <span>
              {/* <Link style={{color: '#007AFF'}} to={path}>详情</Link> */}
              <a href='javascript:;' onClick={() => this.toOrganizationDetail(record)} style={{color: '#007AFF'}}>详情</a>
            </span>
          )
      }
    }]
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
      <div className='secondCourseSchool'>
        <Spin spinning={this.state.spinning} size='large'>
          <div className='search'>
            <div className='fs'>
              <span>{moment(this.state.startDate,'YYYY-MM-DD').format('YYYY-MM-DD')}</span>
              <span> ~ </span>
              <span>{moment(this.state.endDate,'YYYY-MM-DD').format('YYYY-MM-DD')}</span>
            </div>
            <Form onSubmit={this.querySubmit}>
              <Row>
                <Col span={8}>
                  <FormItem>
                    <label>党组织名称：</label>
                    {getFieldDecorator('partyName')(
                    // <Input className='partyName' placeholder="请输入" />
                    <Cascader className='partyName' options={this.state.dp} changeOnSelect placeholder="请选择关键字"/>
                    ) }  
                  </FormItem>
                </Col>
                <Col span={8} style={{marginTop: 7}}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.reset}>重置</Button>
                </Col>
              </Row>
            </Form>
          </div>
          {
            exports ? <Button className='excelF' onClick={this.exportExcel}>导出Excel</Button> : null
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