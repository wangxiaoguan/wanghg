import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Badge, Table, Row, Col, Form, Button, Input, Select, Alert, message } from 'antd';
import styles from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;
const statusMap = ['default', 'success'];
const status = ['无效', '有效'];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ userRoleModal, loading }) => ({
  userRoleModal,
  loading: loading.effects['userRoleModal/fetch'],
}))
@Form.create()
class GroupUserModal extends PureComponent {
  state = {
    formValues: {},
    selectedRowKeys: [],
  };

  componentDidMount() {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'userRoleModal/fetch',
      payload: { userId },
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, userId } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'userRoleModal/fetch',
        payload: { ...values, userId },
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch, userId } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userRoleModal/fetch',
      payload: { userId },
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, userId } = this.props;
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
      type: 'userRoleModal/fetch',
      payload: { ...params, userId },
    });
  };

  handleRowSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([]);
  };

  okHandle = () => {
    const { handleOk, dispatch, userId } = this.props;
    const { selectedRowKeys = [] } = this.state;

    if (selectedRowKeys.length === 0) {
      message.error('请选择后再确定');
    } else {
      dispatch({
        type: 'userRoleModal/addUser',
        payload: { userId, roleIds: selectedRowKeys },
        callback: () => {
          handleOk(selectedRowKeys);
          message.success('角色绑定成功！');
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
            <FormItem label="角色名称">
              {getFieldDecorator('roleName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
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
      userRoleModal: { data },
      loading,
    } = this.props;
    const { list, pagination } = data;
    const { selectedRowKeys } = this.state;

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        render(val, record, index) {
          const { current = 1, pageSize = 10 } = pagination;
          return <span>{(current - 1) * pageSize + (index + 1)}</span>;
        },
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          const i = val === '0' ? 0 : 1;
          return <Badge status={statusMap[i]} text={status[i]} />;
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
        title="绑定角色"
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
