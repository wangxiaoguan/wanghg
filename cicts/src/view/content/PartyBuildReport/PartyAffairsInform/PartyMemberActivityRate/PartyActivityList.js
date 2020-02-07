import React, { Component } from 'react';
import { Form, Button, Input, DatePicker, Table, Row, Col, Cascader, Spin, message } from 'antd';
import { getService, exportExcelService1 } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import './PartyActivityList.less'
import moment from 'moment';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const { RangePicker, MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';

// Excel表导出权限码配置
@connect(
  state => ({
    partyId: state.head.headPartyIdData,
    powers: state.powers
  })
)

@Form.create()
class PartyActivityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PageSize: 10, //每页十条数据
      current: 1, //当前页
      total: 0,//查询的总数量
      loading: false,
      spinning: false,
      data: [],//table表格初始值
      name: '',//输入框的值
      startTime: '',//开始时间
      endTime: '',//结束时间
      partyId: null,
      query: '',
      partyValue: null,
      organizations: [],
      reportExcel: false,//导出按钮可点击
      mode: ['month', 'month'],
      value: [],
    }
    this.columns = [
      {
        title: "序号",
        dataIndex: 'key',
        key: 'key',
        width: 71,
        render: (text, record, index) => {
          return <div>
            <span>{(this.state.current - 1) * (this.state.PageSize) * 1 + index * 1 + 1}</span>
          </div>
        },
      },
      {
        title: "党组织名称",
        dataIndex: 'name',
        key: 'name',
        width: 231
      },
      {
        title: "党员人数",
        dataIndex: 'total',
        key: 'total',
        width: 143
      },
      {
        title: "党建任务活跃人数",
        dataIndex: 'task',
        key: 'task',
        width: 181
      },
      {
        title: "资讯活动活跃人数",
        dataIndex: 'activity',
        key: 'activity',
        width: 169
      },
      {
        title: "掌上党校活跃人数",
        dataIndex: 'school',
        key: 'school',
        width: 168
      }, {
        title: "党建考试活跃人数",
        dataIndex: 'exam',
        key: 'exam',
        width: 183
      }, {
        title: "党员活跃率",
        dataIndex: 'activecr',
        key: 'activecr',
        width: 157
      },
      {
        title: "操作",
        width: 186,
        key: 'feeno',
        render: (text, record) => {
          return <a className='operation' onClick={() => this.GotoFirstPartyActivityDetail(record)} >详情</a>;
        },
      },
    ];
  }

  //接口请求的函数封装
  commonServer = (current, pageSize, parentId, query) => {
    this.setState({ spinning: true })
    if (parentId != -1) {
      getService(`${API_PREFIX}services/web/party/activeRate/activeList/${current}/${pageSize}?Q=type=id&Q=parentId=${parentId}${query ? `${query}` : ''}`, data => {
        if (data.status === 1) {
          this.setState({
            data: data.root.list,
            total: data.root.totalNum,
            spinning: false
          })
        } else if (data.status === 0) {
          this.setState({ spinning: false })
          message.error(data.errorMsg);
        }
      })
    } else {//当为-1时请求下面接口
      getService(`${API_PREFIX}services/web/party/activeRate/oneActiveList?Q=parentId=-1${query ? `${query}` : ''}`, data => {
        if (data.status === 1) {
          this.setState({
            data: data.root.object,
            total: 1,
            spinning: false
          })
        } else if (data.status === 0) {
          this.setState({ spinning: false })
          message.error(data.errorMsg);
        }
      })
    }
  }

  //级联递归取出接口返回的部门的数据
  getDepartmentData(dpData) {
    dpData.map((item, index) => {
      item.value = item.id;
      item.label = item.partyName;
      item.children = item.partyOrgList;
      if (item.partyOrgList) {//不为空，递归
        this.getDepartmentData(item.partyOrgList)
      }
    });
  }

  //初始化进入页面
  componentWillMount() {
    this.setState({ spinning: true })
    //级联请求获取数据
    getService(`${API_PREFIX}services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, data => {
      if (data.status == 1) {
        let orgs = data.root.object;
        if (orgs) {
          //直接调用处理数据的方法===》处理数据
          this.getDepartmentData(orgs);
          this.setState({
            organizations: orgs,
            spinning: false,
          });
        }
      } else {
        message.error(data.errorMsg);
        this.setState({ loading: false });
      }
    })

    // let startValue = moment().subtract(30, 'days').format('YYYY-MM-DD');//默认开始值
    // let endValue = moment(new Date(), 'YYYY-MM').format('YYYY-MM-DD');//默认结束值
    // let code = this.props.partyId == -1 ? `&Q=type_EQ=parentid` : `&Q=type_EQ=id`
    let start = moment().subtract(30, 'days').format('YYYY-MM-DD');//默认开始值
    let startYear = start.substring(0, 4)
    let startMonth = start.substring(5, 7)
    let startValue = moment(new Date(startYear, startMonth - 1, 1)).format('YYYY-MM-DD 00:00:00')

    let end = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD') //默认结束值
    let endYear = end.substring(0, 4)
    let endMonth = end.substring(5, 7)
    let endValue = moment(new Date(endYear, endMonth, 0)).format('YYYY-MM-DD 23:59:59')

    let query = `&Q=startTime=${startValue}&Q=endTime=${endValue}`
    if (!this.props.partyId) {
      return false
    }

    this.setState({
      startTime: startValue,
      endTime: endValue,
      query,
      partyId: this.props.partyId
    })
    if (this.props.partyId) {
      //初始化页面进行判断属于哪个等级
      this.commonServer(this.state.current, this.state.PageSize, this.props.partyId, query)
    }
  }

  //当props改变时而触发的生命周期函数
  componentWillReceiveProps(nextProps) {
    if (!this.props.partyId) {
      return false
    }
    // let startValue = moment().subtract(30, 'days').format('YYYY-MM-DD')
    // let endValue = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    
    let start = moment().subtract(30, 'days').format('YYYY-MM-DD');//默认开始值
    let startYear = start.substring(0, 4)
    let startMonth = start.substring(5, 7)
    let startValue = moment(new Date(startYear, startMonth - 1, 1)).format('YYYY-MM-DD 00:00:00')

    let end = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD') //默认结束值
    let endYear = end.substring(0, 4)
    let endMonth = end.substring(5, 7)
    let endValue = moment(new Date(endYear, endMonth, 0)).format('YYYY-MM-DD 23:59:59')
    let query = `&Q=startTime=${startValue}&Q=endTime=${endValue}`
    if (this.state.partyId != nextProps.partyId) {
      //当切换对应的职务的时候，会将输入框以及时间框清空
      this.props.form.resetFields();
      this.setState({
        current: 1,
        PageSize: 10,
        partyId: nextProps.partyId,
        startTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        endTime: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        query
      })
      this.commonServer(1, 10, nextProps.partyId, query)
    }
  }


  //一级组织详情
  GotoFirstPartyActivityDetail = (record) => {
    getService(`${API_PREFIX}services/web/party/palmPartyClass/checkMinOrg/${record.partyId}?`, data => {
      if (data.root.object.count === 0) {//如果为0则依次跳下一级
        location.hash = `/PartyBuildReport/PartyAffairsInform/FirstPartyActivityDetail?id=${record.partyId}`
      } else {//否则直接到最后一级count等于1时跳转最后一页
        location.hash = `/PartyBuildReport/PartyAffairsInform/PartyActivityBranchesDetails?id=${record.partyId}`
      }

    })
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    this.commonServer(1, pageSize, this.state.partyId, this.state.query)
    this.setState({
      current: 1,
      PageSize: pageSize
    })
  }

  handlePanelChange = (value, mode) => {
    console.log("111",value,mode)
    this.setState({
      value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
    this.props.form.setFieldsValue({
      getDate: value
    });
  };

  handleChange = value => {
    console.log("222",value)
    this.setState({ value });
  };

  //form表单提交
  submitSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
       // let username = fieldsValue.name ? `&Q=name_LK=${fieldsValue.name[fieldsValue.name.length - 1]}` : '';
        let username = fieldsValue.name ? `&Q=nameId=${fieldsValue.name[fieldsValue.name.length - 1]}` : '';
        if (username == `&Q=nameId=` + undefined) {
          username = ''
        }
        let startTime = fieldsValue.startTime.format('YYYY-MM')+"-01"+"%2000:00:00"
        let endTime = fieldsValue.endTime.format('YYYY-MM')+"-31"+"%2023:59:59"
        let query = `&Q=startTime=${startTime}&Q=endTime=${endTime}${username}`
        this.setState({
          name: username,
          startTime,
          endTime,
          current: 1,
          PageSize: 10,
          query
        })
        this.commonServer(1, 10, this.state.partyId, query)
      }
    })
  }

  //级联
  onChangeParty = (value) => {
    this.setState({ partyValue: value });
  }

  changePage = (page, pageSize) => {//跳转对应的第几页触发的事件
    this.setState({
      current: page,
      PageSize: pageSize
    })
    this.commonServer(page, pageSize, this.state.partyId, this.state.query)
  }

  //Excel表单导出
  ExportExcel = () => {
    // let queryname = this.state.name ? `${this.state.name}` : ''
    this.setState({ reportExcel: true })//点击后置灰
    let path = ''
    if (this.state.partyId != -1) {
      path = `${API_PREFIX}services/web/party/activeRate/exportActive?Q=type=id&Q=parentId=${this.state.partyId}${this.state.query}`
    } else {
      path = `${API_PREFIX}services/web/party/activeRate/exportOneActive?Q=parentId=-1${this.state.query}`
    }
    exportExcelService1(path, '党员活跃率党组织表统计').then(data => {
      this.setState({ reportExcel: data })
    })
  }


  render() {
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const { getFieldDecorator } = this.props.form;
    const { value, mode } = this.state;
    let powers = this.props.powers;
    let exportExcelPower = powers && powers['20011.25006.202']
    //存储时间控件的时间
    sessionStorage.setItem('time', JSON.stringify(this.state));
    //默认开始值
    let start = moment().subtract(30, 'days').format('YYYY-MM-DD');//默认开始值
    let startYear = start.substring(0, 4)
    let startMonth = start.substring(5, 7)
    //默认结束值
    let end = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    let endYear = end.substring(0, 4)
    let endMonth = end.substring(5, 7)
    return (
      <div className="PartyActivityList">
        <Spin size='large' spinning={this.state.spinning}>
          <Form layout="inline" className="form" onSubmit={this.submitSearch}>
            <Row className="name">
              <Col span={8} style={{ minWidth: '300px' }}>
                <FormItem label="党组织名称" maxLength="70" {...formItemLayout}>
                  {
                    getFieldDecorator('name')(
                      // <Input placeholder="请输入" />
                      <Cascader style={{ width: 200 }} options={this.state.organizations} placeholder='请输入' changeOnSelect onChange={this.onChangeParty} />
                    )
                  }
                </FormItem>
              </Col>
              {/* <Col span={10}>
                <FormItem label="选择时间" {...formItemLayout}>
                  {getFieldDecorator('getDate', {
                    initialValue: [moment(moment().subtract(30, 'days'), 'YYYY-MM'), moment(new Date(), 'YYYY-MM')]
                  })(
                    <RangePicker
                    format="YYYY-MM"
                    value={value}
                    mode={mode}
                    onChange={this.handleChange}
                    onPanelChange={this.handlePanelChange}
                  />
                  )}
                </FormItem>
              </Col> */}
              <Col span={14}>
                <FormItem {...formItemLayout} label="选择时间" maxLength="56">
                  {getFieldDecorator('startTime', { initialValue: moment(moment(new Date(startYear, startMonth - 1, 1)), monthFormat) })(
                    <MonthPicker format={monthFormat} allowClear={false} disabledDate={this.disabledStartDate} />

                  )}
                </FormItem>
                <label className="formItemLabel" style={{marginRight: 14, lineHeight: '38px'}}>至</label>
                <FormItem>

                  {getFieldDecorator('endTime', { initialValue: moment(moment(new Date(endYear, endMonth, 0)), monthFormat) })(
                    <MonthPicker format={monthFormat} className="month" allowClear={false} disabledDate={this.disabledEndDate} />
                  )}
                </FormItem>

              </Col>
            </Row>
            <Row className="allBtn">
              <Button className="queryBtn" type="primary" htmlType="submit">查询</Button>
              <Button className="resetBtn" onClick={() => {
                this.props.form.resetFields();
              }}>重置</Button>
            </Row>
          </Form>
          {exportExcelPower ? (<div className="ExportExcelDiv">
            <Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={this.state.reportExcel} >导出Excel</Button>
          </div>) : ''}
          {/* <div className="ExportExcelDiv">
            <Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={(exportExcelPower ? false:true)||this.state.reportExcel}>导出Excel</Button>
          </div> */}

          <Table
            className="table"
            rowKey={(record, index) => `complete${record.id}${index}`}
            bordered
            pagination={{
              pageSize: this.state.PageSize,
              current: this.state.current,
              total: this.state.total,
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: this.onPageSizeChange,
              pageSizeOptions: ['10', "20", "30", "40"],
              onChange: this.changePage,
              showTotal: total => `共 ${total} 条`
            }}
            columns={this.columns}
            dataSource={this.state.data}
          />
        </Spin>
      </div>
    )
  }
}

export default PartyActivityList;