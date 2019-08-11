import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService, exportExcelService } from '../../myFetch';
import ServiceApi from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../redux-root/action/table/table';
import { Form, Row, Col, Input, Select, DatePicker, Modal, Cascader, Divider, Button, message, Table, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
// import './CarouselDetail.less';

@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData: n => dispatch(getPageData(n)),
    retSetData: n => dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
export default class RechargeRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pointData: [], //列表展示数据
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      values: '', //查询条件

      userid: window.sessionStorage.getItem('point-userid') ? JSON.parse(window.sessionStorage.getItem('point-userid')) : '', //userid值 --此页面接口请求的参数
      loading: false,
    };
  }

  componentWillUnmount() {
    window.sessionStorage.removeItem('point-userid');
    //this.getPageData(1, 10, '');
    this.props.retSetData({ root: { list: [] } });
    this.props.getSelectRowData([]);
  }

  componentDidMount() {
    this.setState({ loading: true });
    //获取用户积分管理列表初始数据
    getService(ServiceApi + 'services/system/userTreasureRecharge/list/1/10', data => {
      console.log('initPoint:', data);
      if (data.retCode === 1) {
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          loading:false,
        }, () => {
          console.log('pointdata:', this.state.pointData);
        });
      }  else{
        message.error(data.retMsg);
        this.setState({
          loading:false
        })
      }
    });

  }

  exportExcel = () => {
    let path = ServiceApi + 'services/system/userTreasureRecharge/export' + '?' + `${this.state.values}`;
    exportExcelService(path, '', '用户充值记录');
  }

  //当查询条件变化时
  onChangeData = value => {
    this.setState({
      pointData: value.root.list,
      totalNum: value.root.totalNum,
    });
  }

  getParametersFromChild = value => {
    this.setState({
      values: value,
    });
  }

  //页码改变触发
  onPageChange = (current, pageSize) => {
    getService(ServiceApi + `services/system/userTreasureRecharge/list/${current}/${pageSize}?${this.state.values}`, data => {
      if (data.retCode === 1) {
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      } else if (data.retCode === 0) {
        message.error(data.retMsg);
      }
    });
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    getService(ServiceApi + `services/system/userTreasureRecharge/list/${current}/${pageSize}?${this.state.values}`, data => {
      if (data.retCode === 1) {
        this.setState({
          totalNum: data.root.totalNum,
          currentPage: current,
          pageSize: pageSize,
          pointData: data.root.list,
        });
      } else if (data.retCode === 0) {
        message.error(data.retMsg);
      }
    });
  }

  render() {
    let currentPage = this.state.currentPage;
    let pageSize = this.state.pageSize;

    let powers = this.props.powers;
    console.log('权限码', powers);
    let readPowers = powers && powers['20001.21604.003'];
    let exportPowers = powers && powers['20001.21604.202'];  

    const columns = [
      {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '充值积分',
        dataIndex: 'point',
        key: 'point',
      },
      {
        title: '实付金额',
        dataIndex: 'money',
        key: 'money',
      },
      {
        title: '创建时间',
        dataIndex: 'createdate',
        key: 'createdate',
      },
      {
        title: '收款账户',
        dataIndex: 'payAccount',
        key: 'payAccount',
      },
      {
        title: '支付方式',
        dataIndex: 'payWay',
        key: 'payWay',
      },
    ];

    this.state.pointData && this.state.pointData.map((item, index) => {
      item['key'] = index + 1;
    });

    let pagination = {
      total: this.state.totalNum,
      defaultPageSize: this.state.pageSize,
      pageSize: this.state.pageSize,
      current: this.state.currentPage,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '15', '20'],
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
    };

    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };

    return <Spin spinning={this.state.loading}><div className="custom-table">
      <div className="custom-table-search">
        <WrappedSearchForm userid={this.state.userid} currentPage={this.state.currentPage} pageSize={this.state.pageSize}
          onChangeData={this.onChangeData}
          getParametersFromChild={this.getParametersFromChild} />
      </div>
      <div className="custom-table-btn">
        <Button className="exportBtn" style={{ order: 1 }} onClick={this.exportExcel}>
          导出
        </Button>
      </div>
      <Table dataSource={this.state.pointData} columns={columns} pagination={pagination} bordered />
    </div></Spin>;
  }
}

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryFilter: {}, //查询条件
    };
  }

  componentDidMount() {

  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      console.log('before qFilter:', this.state.queryFilter);

      let qFilter = '';
      Object.values(this.state.queryFilter).map(item => {
        if (qFilter == '') {
          qFilter = item;
        } else {
          qFilter = qFilter + '&' + item;
        }
      });

      console.log('after qFilter:', qFilter);

      getService(ServiceApi + `services/system/userTreasureRecharge/list/${this.props.currentPage}/${this.props.pageSize}?${qFilter}`, data => {
        if (data.retCode === 1) {
          this.props.onChangeData(data);
          this.props.getParametersFromChild(qFilter);
        } else if (data.retCode === 0) {
          message.error(data.retMsg);
        }
      });
    });
  }

  handleChange = (key, index, value) => {
    console.log('key', key);
    console.log('index', index);
    console.log('value', value);

    let query = this.state.queryFilter;
    switch (index) {
      case 1:
        query[key] = `Q=username_S_LK=${value}`;
        console.log('11111', query[key]);
        break;
      case 2:
        query[key] = `Q=mobile_S_LK=${value}`;
        console.log('22222', query[key]);
        break;
      case 3:
        if (value.length != 0) {
          query[key] = `Q=createdate_D_GE=${value[0].format('YYYY-MM-DD HH:mm:ss')}&Q=createdate_D_LE=${value[1].format('YYYY-MM-DD HH:mm:ss')}`;
        } else {
          query[key] = '';
        }
        break;
      default:
        break;
    }

    this.setState({
      queryFilter: query,
    }, () => {
      console.log('queryFilter:', this.state.queryFilter);
    });
  }

  /*handleChange = (value)=> {
    console.log('value:',value);
    if(value.length != 0) {
      let query = `Q=createdate_D_GE=${value[0].format('YYYY-MM-DD HH:mm:ss')}&Q=createdate_D_LE=${value[1].format('YYYY-MM-DD HH:mm:ss')}`;
      this.setState({
        queryFilter: query,
      }, () => {
        console.log('queryFilter:', this.state.queryFilter);
      });
    } else{
      this.setState({
        queryFilter:'',
      });
    }
  }*/

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 15,
      },
    };
    const formItemLayout1 = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 13,
      },
    };

    const config = {
      rules: [{
        required: false,
      }],
    };

    return (
      <Form onSubmit={this.handleSubmit} >
        <Row>
          <Col span={9}>
            <FormItem {...formItemLayout1} label="姓名" maxLength="60">
              {getFieldDecorator('username', config)(
                <Input
                  className="input1"
                  style={{ width: '100%' }}
                  placeholder="请输入关键字"
                  onChange={e => {
                    this.handleChange('username', 1, e.target.value);
                  }} />
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem {...formItemLayout} label="手机号" maxLength="11">
              {getFieldDecorator('mobile', config)(
                <Input
                  className="input1"
                  style={{ width: '100%' }}
                  placeholder="请输入关键字"
                  onChange={e => {
                    this.handleChange('mobile', 2, e.target.value);
                  }} />
              )}
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem className="RangePicker"  {...formItemLayout1} label="起止时间" >
              {getFieldDecorator('createdate', { initialValue: '' }, config)(
                <RangePicker
                  className="input1"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{ format: 'HH:mm:ss' }}
                  onChange={value => {
                    this.handleChange('createdate', 3, value);
                  }}
                />
              )}
            </FormItem>

            
          </Col>
          <Col span="24" className="colBtn">
            <Button
              type="primary"
              htmlType="submit"
              className="queryBtn"
            >
              查询
            </Button>
            <Button
              type="primary"
              className="resetBtn"
              onClick={() => {
                this.props.form.resetFields();
                this.setState({
                  queryFilter: {},
                });
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const WrappedSearchForm = Form.create()(SearchForm);


