import React, { Component } from 'react'
import { Row, Col, Tabs,Input,Select,DatePicker,Button, Form, Table, Divider, Spin, message  } from 'antd'
import {Link} from 'react-router-dom'
import moment from 'moment'
import {getService, exportExcelService1} from '../../../myFetch'
import API_PREFIX from '../../../apiprefix';
const TabPane = Tabs.TabPane
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item

// import './PalmarPartySchool.less'
import './style.less'
import  Organization from './Organization'
import { connect } from 'react-redux';
@connect(
  state => ({
    partyId: state.head.headPartyIdData,
    powers: state.powers,
  })
)
@Form.create()
export default class PalmarPartySchool extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: '',
      endDate: '',
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      total: 0,
      pageSize: 10,
      current: 1,
      query: '',
      data: [],
      newsId: 0,
      spinning: false,
      tabKey: '1',
      partyId: null,
      reportExcel: false
    }
  }
  getData = () => {
    this.setState({
      spinning: true
    })
    let {current, pageSize, query} = this.state
    getService(`${API_PREFIX}services/web/party/palmPartyClass/getPalmPartyStatistics/${current}/${pageSize}?${query}`, data => {
      console.log(data)
      if(data.status == 1) {
        data.root.list&&data.root.list.forEach((v, i) => {
          v['key'] = i + 1
        })
        this.setState({
          data: data.root.list||[],
          total: data.root.totalNum||0,
          spinning: false
        })
      }else {
        this.setState({spinning:false})
        message.error(data.errorMsg)
      }
    })
  }
  componentWillMount() {
    console.log(this.props.partyId)
    let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD') + '%2000:00:00'
    let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD') + '%2023:59:59'
    let query = `Q=parentId=${this.props.partyId}&Q=startTime=${startDate}&Q=endTime=${endDate}`
      this.setState({
        tabKey: sessionStorage.getItem('tabKey'),
        startDate,
        endDate,
        query,
        partyId: this.props.partyId
      }, () => {
        if(JSON.stringify(this.props.partyId) !== "{}") {
          this.getData()
        }
      })
  }
  componentWillReceiveProps(nextProps) {
    if(!this.props.partyId) {
      return false
    }
    if(this.state.partyId != nextProps.partyId) {
      let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD') + '%2000:00:00'
      let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')  + '%2023:59:59'
      let query = `Q=parentId=${nextProps.partyId}&Q=startTime=${startDate}&Q=endTime=${endDate}`
      this.setState({
        pageSize: 10,
        current: 1,
        partyId: nextProps.partyId,
        startDate:moment().subtract( 30, 'days').format('YYYY-MM-DD'),
        endDate:  moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        query,
      }, () => {
        this.getData()
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
        console.log('Received values of form: ', values);
        let startDate = values.courseDate1 ? `&Q=startTime=${values.courseDate1.format('YYYY-MM-DD') + '%2000:00:00'}`:''
        let endDate =  values.courseDate2 ? `&Q=endTime=${values.courseDate2.format('YYYY-MM-DD') + '%2023:59:59'}`:''
        let isrequired = values.courseType == '0'?'':`&Q=isRequired=${values.courseType}`
        let title = values.courseName?`&Q=title=${values.courseName}`: ''
        let query = `Q=parentId=${this.state.partyId}${startDate}${endDate}${title}${isrequired}`
        this.setState({
          current: 1,
          pageSize: 10,
          query
        }, () => {
          this.getData()
        })
      }
    });
  }
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }
  
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  exportExcel = () => {
    this.setState({reportExcel: true})
    let path = `${API_PREFIX}services/web/party/palmPartyClass/exportPalmPartyStatistics?${this.state.query}`
    exportExcelService1(path, '掌上党校按课程导出').then(data => {
      console.log(data)
      this.setState({reportExcel: data})
    })
  }
  
  change = (page,pageSize) => {
    this.setState({
      current: page,
      pageSize: pageSize
    },() => {
      this.getData()
    })
  }
  pageSizeChange = (current, size) => {
    this.setState({
      current: 1,
      pageSize: size
    },() => {
      this.getData()
    })
  }
  keyChange = (k) => {
    this.setState({
      tabKey: k
    })
  }
  startDateChange = (data, dataString) => {
  }
  render() {
    sessionStorage.setItem('tabKey', this.state.tabKey)
    const { getFieldDecorator } = this.props.form
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    let pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: this.state.total,
      current: this.state.current,
      pageSize: this.state.pageSize,
      onChange: this.change,
      onShowSizeChange: this.pageSizeChange,
      showTotal: total => `共 ${total} 条`
    }
    const columns = [{
      title: '序号',
      key: 'key',
      dataIndex: 'key',
    }, {
      title: '课程名称',
      key: 'title',
      dataIndex: 'title'
    }, {
      title: '课程类型',
      key: 'isRequired',
      dataIndex: 'isRequired',
      render: (text, record) =>{
      return  <div>{record.isRequired == '1'?"选修":'必修'}</div>
      }   
    },{
      title: '接收人数',
      key: 'total',
      dataIndex: 'total',
    },{
      title: '课程完成率',
      key: 'completeCr',
      dataIndex: 'completeCr',
      // render: (text, record) =>  record.total == '0'? '0.00%':`${(record.complete/record.total * 100).toFixed(2)}%`  
    },{
      title: '任务发布时间',
      key: 'publishDate',
      dataIndex: 'publishDate',
    },{
      title: '操作',
      dataIndex: 'newsId',
      key: 'newsId',
      render: (text, record) => {
        let path = `/PartyBuildReport/StudyExamination/CompleteRate?id=${this.state.partyId}&newsId=${record.id}&complete=${record.complete}&total=${record.total}`
        return( 
        <span>
          <Link to={path} style={{color: '#007AFF'}}>查看完成率</Link>
        </span>
      )}
    }];
    const hasSelected = selectedRowKeys.length > 0;
    let exports = this.props.powers && this.props.powers['20011.25003.202'];
    return (
      <div className='palmarPartySchool'>
        <Tabs defaultActiveKey={this.state.tabKey} className='tab' onChange={this.keyChange}>
          <TabPane tab="按课程" key="1" className='tabItem'>
            <Spin spinning={this.state.spinning} size='large'> 
              <div className='course'>
                <Form onSubmit={this.querySubmit}>
                  <Row>
                    <Col span={7}>
                      <FormItem>
                        <label>课程名称：</label>
                        {getFieldDecorator('courseName')(<Input placeholder="请输入" />)} 
                      </FormItem>
                    </Col>
                    <Col span={7}>
                      <FormItem>
                        <label>课程类型：</label>
                        {getFieldDecorator('courseType',
                        {
                          initialValue:"0"
                        })(
                          <Select>
                            <Option value="0">全部</Option>
                            <Option value="2">必修</Option>
                            <Option value="1">选修</Option>                 
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <FormItem>
                        <label>选择时间：</label>
                        {getFieldDecorator('courseDate1', {
                          initialValue:moment(moment().subtract(30, 'days'), 'YYYY-MM-DD')
                        })(
                        <DatePicker onChange={this.startDateChange} format={'YYYY-MM-DD'} />
                        )}
                      <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                        {getFieldDecorator('courseDate2', {
                          initialValue: moment(new Date(), 'YYYY-MM-DD')
                        })(
                        <DatePicker onChange={this.endDateChange} format={'YYYY-MM-DD'} />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row style={{marginTop: 20}}>
                    <Col>
                      <Button type="primary" htmlType='submit'>查询</Button>
                      <Button onClick={this.reset}>重置</Button>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div>
                {
                  exports ? <Button className='excel' onClick={this.exportExcel}>导出Excel</Button> : null
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