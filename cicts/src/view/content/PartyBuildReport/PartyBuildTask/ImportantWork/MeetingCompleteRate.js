import React, { Component } from 'react';
import { Row, Col,Tabs,Input,Select,DatePicker,Button, Table, Form ,TreeSelect, Cascader, Spin, message } from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
import {Link} from 'react-router-dom';
import './CompleteRate.less';
import {getService, exportExcelService1} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import './MeetingCompleteRate.less';
@connect(
  state => ({
    powers: state.powers,
  })
)
@Form.create()
export default class Organization extends Component {
  constructor(props) {
    super(props);
    let obj = {};
    props.location.search.substr(1).split('&').forEach((item, index) => {
      obj[item.split('=')[0]] = item.split('=')[1]; 
    });
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
      spinning: false,
      reportExcel: false,
    };
  }
  requestData = () => { //封装发送查询、分页请求
    this.setState({spinning: true});
    let {currentPage,pageSize,query} = this.state
    let path = `${API_PREFIX}services/web/party/important/work/sillyDemand/${currentPage}/${pageSize}?${query?`${query}`:''}`;
    getService(path, res => {
      if(res.status === 1) {
        let data = res.root.object;
        console.log('55555555555555', data);
        let arr = [];
        data.importantTaskToLessonsOverAll && arr.push(data.importantTaskToLessonsOverAll);
        arr[0]['key'] = 1;
        data.importantTaskToLessons && data.importantTaskToLessons.forEach((item, index) => {
          item['key'] = index + 1;
        });
        this.setState({
          data: data.importantTaskToLessons,
          data2: arr,
          total: data.dataCount,
          spinning: false,
        });  
      }else {
        message.error(res.errorMsg)
        this.setState({spinning: false})
      }
    });
  }
  componentWillMount() {
    this.setState({
      query: `Q=upPartyId=${this.state.partyId}&Q=taskId=${this.state.taskId}`
    }, () => {
      this.requestData();
    })
  }
  componentWillReceiveProps(nextProps) {
    // let obj = {}
    // nextProps.location.search.substr(1).split('&').forEach((item, index) => {
    //   obj[item.split('=')[0]] = item.split('=')[1] 
    // })
    // if(obj.partyId != this.state.partyId || obj.taskId != this.state.taskId) {
    //   this.setState({
    //     pageSize: 10,
    //     currentPage: 1,
    //     taskId: obj.taskId,
    //     partyId: obj.partyId,
    //     partyName: decodeURI(obj.partyName),
    //   })
    //   this.requestData(this.state.currentPage, this.state.pageSize,obj.taskId, obj.partyId)
    //   getService(`${API_PREFIX}services/partybuildingreport/task/taskListPagesOverallDrill/${obj.taskId}/${obj.partyId}`, data => { //获取总体概况数据
    //     // console.log(data)
    //     data['key'] = 1
    //     let arr =[]
    //     arr.push(data)
    //     this.setState({
    //       data2: arr
    //     })
    //   })
    // }
  }
  querySubmit = (e) => { //点击查询获取数据
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let name = values.name ? `&Q=userName=${values.name}`: '';
        let userNum = values.userNum? `&Q=userNo=${values.userNum}`:'';
        let taskType = !values.taskType?'':`&Q=taskType=${values.taskType}`;
        let query = `Q=upPartyId=${this.state.partyId}&Q=taskId=${this.state.taskId}${name}${userNum}${taskType}`;
        this.setState({
          currentPage: 1,
          pageSize: 10,
          query,
        }, () => {
          this.requestData();
        });
      }
    });
  }
  change = (page,pageSize) => { //页码改变，发送请求获取数据
    this.setState({ 
      currentPage: page,
      pageSize: pageSize,
    }, () => {
      this.requestData();
    });
  }
  pageSizeChange = (current, size) => {
    this.setState({
      currentPage: 1,
      pageSize: size,
    }, () => {
      this.requestData();
    });
  }
  exportExcel = () => { //导出表格
    this.setState({reportExcel: true});
    let path = `${API_PREFIX}services/web/party/important/work/exportSillyDemand?${this.state.query}`;
    exportExcelService1(path, '重要工作按任务统计详情').then(data => {
      console.log(data);
      this.setState({reportExcel: data});
    });
  }
  reset= () => { //重置Form表单数据为默认值
    this.props.form.resetFields();
  }
  goback = () => {
    history.back();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, selectedRowKeys } = this.state;
    let exports = this.props.powers && this.props.powers['20011.25001.202'];
    const columns = [{
      title: '序号',
      dataIndex: 'key',
    }, {
      title: '姓名',
      dataIndex: 'memName',
    }, {
      title: '员工号',
      dataIndex: 'memNo',
    },
    // {
    //   title: '身份证号',
    //   dataIndex: 'idCard',
    // },
    {
      title: '完成状态',
      dataIndex: 'statusName',
    },
  ];
  const columns2 = [{
      title: '参与党员数',
      dataIndex: 'memJoin',
    },{
      title: '党员参与率',
      dataIndex: 'memJoinRate',
    }];
    let pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: this.state.total,
      current: this.state.currentPage,
      pageSize: this.state.pageSize,
      onChange: this.change,
      onShowSizeChange: this.pageSizeChange,
      showTotal: total => `共 ${total} 条`,
    };
    return (
      <div className='meetingCompleteRate'>
        <Spin spinning={this.state.spinning} size='large'>
          <div className='total'>
            <div className='fs'>
              <span>{this.state.partyName}</span>
            </div>
            <div style={{marginBottom: '10px'}}>总体概况</div>
            <Table pagination={false} columns={columns2} dataSource={this.state.data2} bordered={true} />
          </div>
          <div className='detail'>
            <Row style={{marginBottom: '15px'}}>详细情况</Row>
            <Form onSubmit={this.querySubmit}>
              <Row>
                <Col span={8} style={{marginRight: 30}}>
                  <FormItem>
                  <label>姓名：</label>
                  {
                    getFieldDecorator('name')(
                      <Input className='taskName' placeholder="请输入" />
                    )
                   } 
                </FormItem>
                </Col>
                <Col span={8} >
                  <FormItem>
                  <label>员工号：</label>
                  {
                    getFieldDecorator('userNum')(
                      <Input className='taskName' placeholder="请输入" />
                    )
                   } 
                </FormItem>
                </Col>
              </Row>
              <Row>
                {/* <Col span={8} >
                  <FormItem>
                  <label>身份证号：</label>
                  {
                    getFieldDecorator('idCord')(
                      <Input className='taskName' placeholder="请输入" />
                    )
                   } 
                </FormItem>
                </Col> */}
                <Col span={8}>
                  <FormItem>
                    <label>完成状态：</label>
                    {getFieldDecorator('taskType', {
                        initialValue: '',
                      })(
                        <Select>
                          <Option value={''}>全部</Option>
                          <Option value={'0'}>未完成</Option>
                          <Option value={'1'}>已完成</Option>
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
            <Button type="primary" className='back' className='goback' onClick={this.goback}>返回</Button>
          </Row>
        </Spin>
      </div>
    );
  }
}