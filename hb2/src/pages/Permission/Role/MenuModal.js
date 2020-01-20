import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Badge, Table, Row, Col, Form, Button, Input, Select, Alert, message } from 'antd';
import styles from '../Role.less';

const FormItem = Form.Item;
const { Option } = Select;
const statusMap = ['default', 'success'];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ roleMenuModal, loading }) => ({
  roleMenuModal,
  loading: loading.effects['roleMenuModal/fetch'],
}))
@Form.create()
class roleMenuModal extends PureComponent {
  state = {
    formValues: {},
    selectedRowKeys: [],
  };

  componentDidMount() {
    const { dispatch, roleId } = this.props;
    dispatch({
      type: 'roleMenuModal/fetch',
      payload: { roleId },
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, roleId } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'roleMenuModal/fetch',
        payload: { ...values, roleId },
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch, roleId } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'roleMenuModal/fetch',
      payload: { roleId },
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, roleId } = this.props;
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
      type: 'roleMenuModal/fetch',
      payload: { ...params, roleId },
    });
  };

  handleRowSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([]);
  };

  okHandle = () => {
    const {
      handleOk,
      dispatch,
      roleId,
      roleMenuModal: { data },
    } = this.props;
    const { selectedRowKeys = [] } = this.state;

    if (selectedRowKeys.length === 0) {
      message.error('请选择后再确定');
    } else {
      const { list } = data;
      const rows = list.filter(item => selectedRowKeys.includes(item.id));
      console.log('rows: ', rows);
      dispatch({
        type: 'roleMenuModal/bindMenu',
        payload: rows.map(v => ({ roleId, sysId: v.id, status: v.status })),
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
            <FormItem label="目录名称">
              {getFieldDecorator('sysMenuName')(<Input placeholder="请输入" />)}
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
      roleMenuModal: { data },
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
        title: '目录名称',
        dataIndex: 'sysMenuName',
      },
      {
        title: '简介',
        dataIndex: 'description',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val, record) {
          const i = val === '0' ? 0 : 1;
          return (
            <Badge
              status={statusMap[i]}
              text={record.statusDesp || (val === '0' ? '无效' : '有效')}
            />
          );
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
        title="绑定目录"
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

export default roleMenuModal;
