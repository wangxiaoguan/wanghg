import React, { Component } from 'react';
import { Tabs, Divider, Popconfirm, Message, Table, Form, Row, Col, Cascader, Select, Button } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import ServiceApi from '../../apiprefix';
import { postService, GetQueryString, getService } from '../../myFetch.js';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
import './CompletionRate.less';
@Form.create()
export default class CompletionRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: GetQueryString(location.hash, ['id']).id,//列表页面传入的id
      dataSource: [],//总体概况的数据源
      statusOption: [],//完成状态的option
      partyOption: [],//党组织Option
      dataSourceDetail: [],//详细情况的数据源
      selectedRowKeys: [],//选中行的key值
      selectedRows: [],//选中的那一行
      currentPage: 1,//当前页数
      pageSize: 10,  //modal本身就不大，所以不能让用户选择每页显示多少条
      totalNumber: 10,//全部的数据
      partyOrganizationDatas: [],//条件查询时，组织机构级联选项

    }
  }
  componentDidMount() {
    //页面相关的数据处理
    this.dealData();
  }
  dealData = () => {
    //获取党组织数据
    getService(ServiceApi + 'services/system/partyOrganization/partyOrganizationList/get', data => {
      console.log('党组织数据：', data);
      let pOrgs = data.root.list;
      if (pOrgs) {
        //调用接口数据处理函数
        this.getPartyOrganationData(pOrgs);
        this.setState({
          partyOrganizationDatas: pOrgs,
        });
      }
    });
    /**
     * body中的内容：
     * {
  "partyId": "integer",
  "taskId": "integer",
  "page": "integer",
  "pageSize": "integer",
  "completeStatus": "boolean"
}
     */
    let body = {
      taskId: this.state.id,
      page: 1,
      pageSize: 10
    }
    postService(ServiceApi + `services/partybuilding/task/get/getTaskComplete`, body, result => {
      if (result.retCode === 1) {//接口数据请求成功  设置数据源，设置分页
        if (result.root.object) {
          this.setState({
            dataSource: [result.root.object],
            page: body.page,
            pageSize: body.pageSize,
            totalNumber: result.root.totalNumber,
            dataSourceDetail: result.root.list
          });
        }
      } else {
        Message.error(result.retMsg);
      }
    });
  }
  //递归取出接口返回的党组织的数据
  getPartyOrganationData(poData) {
    poData.map((item, index) => {
      item.value = item.id;
      item.label = item.name;
      item.children = item.partyOrganizationList;
      if (item.partyOrganizationList) {//不为空，递归
        this.getPartyOrganationData(item.partyOrganizationList);
      }
    });
  }
  //选中项发生变化的时的回调
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log("当前选中的行:", selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  }
  //页码改变的回调，参数是改变后的页码及每页条数
  onPageChange = (page, pageSize) => {
    this.setState({ currentPage: page, pageSize: pageSize }, () => {
      let body = {
        taskId: this.state.id,
        page: this.state.currentPage,
        pageSize: this.state.pageSize,
      }
      //根据新的页面重新调用接口
      postService(ServiceApi + `services/partybuilding/task/get/getTaskComplete`, body, result => {
        if (result.retCode === 1) {//接口数据请求成功  设置数据源，设置分页
          if (result.root) {
            this.setState({
              totalNumber: result.root.totalNumber,
              dataSourceDetail: result.root.list
            });
          }
        } else {
          Message.error(result.retMsg);
        }
      });
    });
  }
  //条件查询
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);

      let partyId = '';
      if (fieldsValue.partyId && fieldsValue.partyId.length > 0) {
        partyId = fieldsValue.partyId[fieldsValue.partyId.length - 1];
      }
      let completeStatus = fieldsValue.completeStatus;
      let body = {
        partyId: partyId,
        taskId: this.state.id,
        page: this.state.page,
        pageSize: this.state.pageSize,
        completeStatus: completeStatus
      }
      console.log('body', body);
      postService(ServiceApi + `services/partybuilding/task/get/getTaskComplete`, body, result => {
        if (result.retCode === 1) {//接口数据请求成功  设置数据源，设置分页
          if (result.root) {
            this.setState({
              totalNumber: result.root.totalNumber,
              dataSourceDetail: result.root.list
            });
          }
        } else {
          Message.error(result.retMsg);
        }
      });
    });
  }
  //重置
  handleReset = (e) => {
    this.props.form.setFieldsValue({ partyId: [], completeStatus: '' })
  }
  render() {
    const { dataSource, dataSourceDetail, partyOrganizationDatas } = this.state;
    console.log('dataSource', dataSource, dataSourceDetail);
    const columns = [
      {
        title: '完成组织数',
        dataIndex: 'partyFinishCount',
        key: 'partyFinishCount',
      },
      {
        title: '组织完成率',
        dataIndex: 'partyPercentage',
        key: 'partyPercentage',
      },
      {
        title: '参与党员数',
        dataIndex: 'memFinishCount',
        key: 'memFinishCount',
      },
      {
        title: '党员参与率',
        dataIndex: 'memPercentage',
        key: 'memPercentage',
      },
    ];
    const columnsDetail = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        render: (data, record, index) => {
          return index + 1;
        }
      },
      {
        title: '党组织名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '完成状态',
        dataIndex: 'completeStatus',
        key: 'completeStatus',
        render: (data, record) => {
          return record.completeStatus ? '是' : '否'
        }
      },
      {
        title: '参与党员数',
        dataIndex: 'allMemCount',
        key: 'allMemCount',
      },
      {
        title: '党员参与率',
        dataIndex: 'memPercentage',
        key: 'memPercentage',
      },
    ];
    //rowSelection
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };
    //pagination
    let pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: this.state.totalNumber,
      current: this.state.currentPage,
      onChange: this.onPageChange,
    };
    const { getFieldDecorator } = this.props.form;  //获取表单中的属性
    const options = [
      {
        value: '是',
        label: true,
      },
      {
        value: '否',
        label: false,
      }
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
      },
    };
    return (
      <div className="party_task_completion">
        <p >总体概况</p>
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}

        >
        </Table>
        <p>详细情况</p>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="党组织名称"
              >
                {
                  getFieldDecorator('partyId')
                    (
                    <Cascader placeholder="请选择" options={partyOrganizationDatas} changeOnSelect />
                    )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="完成状态"
              >
                {
                  getFieldDecorator('completeStatus')
                    (
                    <Select placeholder="请选择">
                      <Option value={''}>全部</Option>
                      <Option value={true}>是</Option>
                      <Option value={false}>否</Option>
                    </Select>
                    )
                }
              </FormItem>
            </Col>
            <Col span={3}>
              <Button type="primary" htmlType="submit" style={{}}>查询</Button>
            </Col>
            <Col span={3}>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置
              </Button>
            </Col>
          </Row>

        </Form>
        <Table
          bordered
          columns={columnsDetail}
          dataSource={dataSourceDetail}
          rowSelection={rowSelection}
          pagination={pagination}
          rowKey={'id'}

        >
        </Table>
      </div>
    );
  }
}