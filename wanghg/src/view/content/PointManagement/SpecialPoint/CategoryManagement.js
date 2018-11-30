import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService, exportExcelService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../redux-root/action/table/table';
import { Form, Row, Col, Input, InputNumber, Select, Modal, Cascader, Divider, Button, message, Table } from 'antd';
import { RuleConfig } from '../../ruleConfig';
import AlterPoint from '../UserPoint/AlterPoint';
const FormItem = Form.Item;
const Option = Select.Option;
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
export default class CategoryManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryData: [], //列表展示数据
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,

      dataInfo: {}, //获取列表的某行数据
      flag: false, //是否显示 编辑Modal
    };
  }

  componentWillUnmount() {
    //this.getPageData(1, 10, '');
    // this.props.retSetData({ root: { list: [] } });
    // this.props.getSelectRowData([]);
  }

  componentDidMount() {
    //获取类别管理列表初始数据
    getService(API_PREFIX + 'services/system/specialTreasureTask/typeList/1/10', data => {
      console.log('initCategoryManagement:', data);
      if (data.retCode === 1) {
        this.setState({
          totalNum: data.root.totalNum,
          categoryData: data.root.list,
        }, () => {
          console.log('categoryData:', this.state.categoryData);
        });
      } else if (data.retCode === 0) {
        message.error(data.retMsg);
      }
    });
  }

  //打开 编辑Modal
  editCategory = (value) => {
    this.setState({
      flag: true,
      dataInfo: value,
    }, () => {
      console.log('editCategory:', this.state.dataInfo);
    });
  }

  //关闭 编辑Modal
  closeCategory = () => {
    this.setState({
      flag: false,
    });
  }

  //刷新列表展示数据
  refreshData = () => {
    getService(API_PREFIX + `services/system/specialTreasureTask/typeList/${this.state.currentPage}/${this.state.pageSize}`, data => {
      if (data.retCode === 1) {
        this.setState({
          categoryData: data.root.list,
          totalNum: data.root.totalNum,
        });
      } else if (data.retCode === 0) {
        message.error(data.retMsg);
      }
    });
  }

  //页码改变触发
  onPageChange = (current, pageSize) => {
    getService(API_PREFIX + `services/system/specialTreasureTask/typeList/${current}/${pageSize}`, data => {
      if (data.retCode === 1) {
        this.setState({
          totalNum: data.root.totalNum,
          categoryData: data.root.list,
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
    getService(API_PREFIX + `services/system/specialTreasureTask/typeList/${current}/${pageSize}`, data => {
      if (data.retCode === 1) {
        this.setState({
          totalNum: data.root.totalNum,
          currentPage: current,
          pageSize: pageSize,
          categoryData: data.root.list,
        });
      } else if (data.retCode === 0) {
        message.error(data.retMsg);
      }
    });
  }

  render() {
    let currentPage = this.state.currentPage;
    let pageSize = this.state.pageSize;

    // let powers = this.props.powers;
    // console.log('权限码', powers);
    // let createPowers = powers && powers['20001.21008.001'];
    // let updatePowers = powers && powers['20001.21008.002'];
    // let readPowers = powers && powers['20001.21008.003'];
    // let deletePowers = powers && powers['20001.21008.004'];

    const columns = [
      {
        title: '类别名称',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
      },
      {
        title: '兑换比例',
        dataIndex: 'ratio',
        key: 'ratio',
      },
      {
        title: '创建时间',
        dataIndex: 'createdate',
        key: 'createdate',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return <div>
            <a className="operation" onClick={this.editCategory.bind(this, record)}
              style={{ display: 'inline-block' }} >编辑</a>
          </div>;
        },
      },
    ];

    this.state.categoryData && this.state.categoryData.map((item, index) => {
      item['key'] = index + 1;
    });

    let pagination = {
      total: this.state.totalNum,
      pageSize: this.state.pageSize,
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

    return <div className="custom-table">
      <div className="custom-table-btn">
        <Button className="resetBtn" style={{ order: 1 }} onClick={() => history.back()}>
          返回
        </Button>
      </div>
      <Table className="tabCommon" dataSource={this.state.categoryData} columns={columns} pagination={pagination} bordered />
      <Modal
        title="编辑类别"
        key={'categoryManagementModal'}
        visible={this.state.flag}
        cancelText="返回"
        okText="确定"
        onCancel={this.closeCategory}
        footer={null}
        destroyOnClose={true}
      >
        <WrappedCategoryForm dataInfo={this.state.dataInfo} refreshData={this.refreshData} closeCategory={this.closeCategory} />
      </Modal>
    </div>;
  }
}

class CategoryForm extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const values = {
        ...fieldsValue,
      };

      values.id = this.props.dataInfo.id;

      postService(API_PREFIX + 'services/system/specialTreasureTask/update/type', values, data => {
        if (data.retCode === 1) {
          message.success(data.retMsg);
          this.props.refreshData();
          this.props.closeCategory();
        } else if (data.retCode === 0) {
          message.error(data.retMsg);
        }
      });
    });
  }

  render() {
    console.log('dataInfo', this.props.dataInfo);

    //获取数据
    const { getFieldDecorator } = this.props.form;
    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 10 },
      },
    };

    const config = {
      rules: [{
        required: false,
      }],
    };

    return (
      <Form onSubmit={this.handleSubmit} >
        <FormItem {...formItemLayout} label="类别名称" >
          {getFieldDecorator('typeName', {
            initialValue: this.props.dataInfo.typeName ? this.props.dataInfo.typeName : '',
            ...RuleConfig.typeNameConfig,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="优先级" maxLength="11">
          {getFieldDecorator('priority',
            {
              initialValue: this.props.dataInfo.priority ? this.props.dataInfo.priority : '',
              ...RuleConfig.priorityConfig,
            })(
              <InputNumber min={1} max={999} step={1} />
            )}
        </FormItem>
        <FormItem {...formItemLayout} label="兑换比例" maxLength="3">
          {getFieldDecorator('ratio',
            {
              initialValue: this.props.dataInfo.ratio ? this.props.dataInfo.ratio : '',
              ...RuleConfig.ratioConfig,
            })(
              <InputNumber min={0} max={100} step={1} />
            )}
        </FormItem>
        <Row>
          <Col>
            <Button style={{ marginLeft: '165px' }} className="queryBtn" type="primary" htmlType="submit" size="large">确定</Button>
            <Button className="resetBtn" onClick={() => this.props.closeCategory()}>返回</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const WrappedCategoryForm = Form.create()(CategoryForm);



