import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Badge, Table, Row, Col, Form, Button, Input, Select, Alert, message } from 'antd';
import styles from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;
const userStatusMap = ['default', 'success'];
const auditStatusMap = ['default', 'success'];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ groupUserModal, loading }) => ({
  groupUserModal,
  loading: loading.effects['groupUserModal/fetch'],
}))
@Form.create()
class GroupUserModal extends PureComponent {
  state = {
    formValues: {},
    selectedRowKeys: [],
  };

  componentDidMount() {
    const { dispatch, groupId } = this.props;
    dispatch({
      type: 'groupUserModal/fetch',
      payload: { groupId },
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, groupId } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      // console.log(values);
      dispatch({
        type: 'groupUserModal/fetch',
        payload: { ...values, groupId },
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch, groupId } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'groupUserModal/fetch',
      payload: { groupId },
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, groupId } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'groupUserModal/fetch',
      payload: { ...params, groupId },
    });
  };

  handleRowSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([]);
  };

  okHandle = () => {
    const { handleOk, dispatch, groupId } = this.props;
    const { selectedRowKeys = [] } = this.state;

    if (selectedRowKeys.length === 0) {
      message.error('请选择后再确定');
    } else {
      dispatch({
        type: 'groupUserModal/addUser',
        payload: { groupId, userIds: selectedRowKeys },
        callback: () => {
          handleOk(selectedRowKeys);
        },
      });
    }
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="账号">
              {getFieldDecorator('userAccount')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('userName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户类型">
              {getFieldDecorator('userType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">外部用户</Option>
                  <Option value="1">内部用户</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户状态">
              {getFieldDecorator('userStatus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">无效</Option>
                  <Option value="1">有效</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { modalVisible, handleCancel } = this.props;
    const {
      groupUserModal: { data },
      loading,
    } = this.props;
    const { list, pagination } = data;
    const { selectedRowKeys } = this.state;

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        render(val, record, index) {
          const { current = 1, pageSize = 10 } = {};
          return <span>{(current - 1) * pageSize + (index + 1)}</span>;
        },
      },
      {
        title: '账号',
        dataIndex: 'userAccount',
      },
      {
        title: '姓名',
        dataIndex: 'userName',
      },
      {
        title: '用户类型',
        dataIndex: 'userType',
        render(_, record) {
          return <span>{record.userTypeDesp}</span>;
        },
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        render(val, record) {
          const i = val === '0' ? 0 : 1;
          return <Badge status={auditStatusMap[i]} text={record.auditStatusDesp} />;
        },
      },
      {
        title: '用户状态',
        dataIndex: 'userStatus',
        render(val, record) {
          const i = val === '0' ? 0 : 1;
          return <Badge status={userStatusMap[i]} text={record.userStatusDesp} />;
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <Modal
        destroyOnClose
        width="60%"
        title="绑定用户"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleCancel()}
      >
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.standardTable}>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <Fragment>
                    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}
                    项&nbsp;&nbsp;
                    <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                      清空
                    </a>
                  </Fragment>
                }
                type="info"
                showIcon
              />
            </div>
            <Table
              rowKey="id"
              rowSelection={rowSelection}
              loading={loading}
              dataSource={list}
              columns={columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default GroupUserModal;
