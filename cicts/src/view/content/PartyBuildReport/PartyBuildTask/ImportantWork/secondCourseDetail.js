import React, { Component } from 'react';
import { Row, Col, Input, Select, DatePicker, Button, Table, Form,TreeSelect, Cascader, Spin, message } from 'antd';
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
import {Link} from 'react-router-dom';
import './secondCourseDetail.less';
import moment from 'moment'
import {getService, exportExcelService1,GetQueryString} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
@connect(
  state => ({
    powers: state.powers,
  })
)

@Form.create()
export default class FirstCourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      query: '',
      data: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      partyId: props.location.search.substr(1).split('=')[1],
      partyData: [],
      partyValue: null,
      spinning: false,
      reportExcel: false,
      id:GetQueryString(location.hash, ['partyId']).partyId || '',
    };
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
    console.log(value);
    this.setState({ partyValue: value });
  }
  requestData = () => {
    this.setState({spinning: true});
    let {currentPage, pageSize, query} = this.state
    let path = `${API_PREFIX}services/web/party/important/work/partyListPagesIndex/${currentPage}/${pageSize}?${query?`${query}`:''}`;
    getService(path, data => {
      console.log(data);
      if(data.status == '1') {
        data.root.list && data.root.list.forEach((item, i) => {
          item['key'] = i + 1;
        });
        this.setState({
          data: data.root.list || [],
          total: data.root.totalNum,
          spinning: false,
        });
      }else {
        this.setState({spinning: false});
        message.error('请求数据失败');
      }
    });
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
    let date = JSON.parse(sessionStorage.getItem('date'));
    let query = `Q=startTime=${date.startDate}&Q=endTime=${date.endDate}&Q=drill=1&Q=upPartyId=${this.state.partyId}`;
    this.setState({
      startDate: date.startDate,
      endDate: date.endDate,
      query,
    }, () => {
      this.requestData()
    });
    // this.requestData(this.state.currentPage, this.state.pageSize, query);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.location.search.substr(1).split('=')[1] != this.state.partyId) {
      let id = nextProps.location.search.substr(1).split('=')[1];
      // this.setState({id})
      let date = JSON.parse(sessionStorage.getItem('date'));
      let query = `Q=startTime=${date.startDate}&Q=endTime=${date.endDate}&Q=drill=1&Q=upPartyId=${id}`;
      this.setState({
        partyId: id,
        currentPage: 1,
        pageSize: 10,
        query,
      }, () => {
        this.requestData();
      });
    }
    
  }
  change = (page,pageSize) => {
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
  querySubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // let partyName = values.name.length?`&Q=partyid_EQ=${values.name[values.name.length-1]}`:''
        let partyName = '';
        if(values.name) {
          partyName = values.name.length?`&Q=partyId=${values.name[values.name.length-1]}`:'';
        }
        let query = `Q=startTime=${this.state.startDate}&Q=endTime=${this.state.endDate}&Q=drill=1&Q=upPartyId=${this.state.id}${partyName}`;
        this.setState({
          currentPage: 1,
          query,
        }, () => {
          this.requestData()
        });
      }
    });
  }
  exportExcel = () => {
    this.setState({reportExcel: true});
    let path = `${API_PREFIX}services/web/party/important/work/partyExportIndex?${this.state.query}`;
    exportExcelService1(path, '重要工作组织详情统计').then(data => {
      console.log(data);
      this.setState({reportExcel: data});
    });
  }
  goback = () => {
    history.back();
  } 
  reset= () => {
    this.props.form.resetFields();
    this.setState({partyValue: null});
  }
  toOrganizationDetail = (record) => {
    if(record.servlet == 1) {
      location.hash = `/PartyBuildReport/PartyBuildTask/LastCourseDetail?partyId=${record.partyId}`;
    }else {
      location.hash = `/PartyBuildReport/PartyBuildTask/SecondCourseDetail?partyId=${record.partyId}`;  
    }
    // let str = sessionStorage.getItem('partyName')
    // sessionStorage.setItem('partyName', str + '>' + record.partyName)
  }
  render() {
    let exports = this.props.powers && this.props.powers['20011.25001.202'];
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
      render: (text, record) => {
        return (
          <span>
            <a href="javascript:;" onClick={() => this.toOrganizationDetail(record)} style={{color: '#1890FF'}}>详情</a>
          </span>
        );
      },
    }];
    const { getFieldDecorator } = this.props.form;
    let pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: this.state.total,
      current: this.state.current,
      pageSize: this.state.pageSize,
      onChange: this.change,
      onShowSizeChange: this.pageSizeChange,
      showTotal: total => `共 ${total} 条`,
    };
    // let name = sessionStorage.getItem('partyName')
    return (
      <div className='secondCourseWork'>
        <Spin spinning={this.state.spinning} size='large'>
          <div className='search'>
            <div className='fs'>
              <span>{name}</span>
            </div>
            <div className='fs'>
              <span>{moment(this.state.startDate).format('YYYY-MM-DD')}  </span>
              <span> ~ </span>
              <span>{moment(this.state.endDate).format('YYYY-MM-DD')}</span>
            </div>
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
                <Col span={8} style={{marginTop: 7}}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.reset}>重置</Button>
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
    );
  }
}