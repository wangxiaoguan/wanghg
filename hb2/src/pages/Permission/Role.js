import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Divider,
  Table,
  Badge,
  Dropdown,
  Icon,
  Menu,
  Popconfirm,
  message,
  Modal,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RoleModal from './RoleModal';
import styles from './Role.less';

const FormItem = Form.Item;
const { Option } = Select;
const statusMap = ['default', 'success'];
const status = ['无效', '有效'];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class User extends PureComponent {
  state = {
    formValues: {},
    modalVisible: false,
    modalType: 1, // 1新建， 2更新
    currentItem: {},
    selectedRowKeys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
    });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'role/fetch',
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'role/fetch',
      payload: {},
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
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
      type: 'role/fetch',
      payload: params,
    });
  };

  showModalVisible = (type, data = {}) => {
    this.setState({
      currentItem: data,
      modalVisible: true,
      modalType: type,
    });
  };

  closeModalVisible = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleOk = () => {
    this.closeModalVisible();
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
    });
    message.success('新建成功！');
  };

  removeRole = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/remove',
      payload: id,
      callback: () => {
        dispatch({
          type: 'role/fetch',
        });
        message.success('删除成功！');
      },
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const onBatchRemove = () => {
      dispatch({
        type: 'role/removeList',
        payload: selectedRowKeys,
        callback: () => {
          this.setState({
            selectedRowKeys: [],
          });
          message.success('删除成功!');
          dispatch({
            type: 'role/fetch',
          });
        },
      });
    };

    if (!selectedRowKeys) return;
    switch (e.key) {
      case 'remove':
        Modal.confirm({
          title: '确定批量删除吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: onBatchRemove,
        });
        break;
      default:
        break;
    }
  };

  gotoUser = item => {
    this.setState({
      currentItem: item,
    });
    router.push({
      pathname: `/permission/roleUser/${item.id}`,
    });
  };

  gotoGroup = item => {
    this.setState({
      currentItem: item,
    });
    router.push({
      pathname: `/permission/roleGroup/${item.id}`,
    });
  };

  gotoOrg = item => {
    this.setState({
      currentItem: item,
    });
    router.push({
      pathname: `/permission/roleOrg/${item.id}`,
    });
  };

  gotoMenu = item => {
    this.setState({
      currentItem: item,
    });
    router.push({
      pathname: `/permission/roleMenu/${item.id}`,
    });
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
              {getFieldDecorator('rolename')(<Input placeholder="请输入" />)}
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
    const {
      role: { data },
      loading,
      dispatch,
    } = this.props;
    const { list, pagination } = data;
    const { modalVisible, modalType, currentItem, selectedRowKeys } = this.state;

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
      {
        title: '操作',
        render: (_, record) => (
          <Fragment>
            <a onClick={() => this.gotoUser(record)}>用户绑定</a>
            <Divider type="vertical" />
            <a onClick={() => this.gotoGroup(record)}>群组绑定</a>
            <Divider type="vertical" />
            <a onClick={() => this.gotoMenu(record)}>目录绑定</a>
            <Divider type="vertical" />
            <a onClick={() => this.gotoOrg(record)}>单位/部门绑定</a>
            {(record.id === 1 || record.id === 2 || record.id === 3 || record.id === 4) ? '' :
            <a>
              <Divider type="vertical" />
              <a onClick={() => this.showModalVisible(2, record)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除？" onConfirm={() => this.removeRole(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </a>
            }
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      modalVisible,
      modalType,
      data: currentItem,
      handleOk: this.handleOk,
      handleCancel: this.closeModalVisible,
      dispatch,
    };

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        {/* <Menu.Item key="approval">批量审批</Menu.Item> */}
      </Menu>
    );

    const rowSelection = {
      selectedRowKeys,
      onChange: sRowKeys => {
        this.setState({
          selectedRowKeys: sRowKeys,
        });
      },
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  this.showModalVisible(1);
                }}
              >
                新建
              </Button>
              {selectedRowKeys.length > 0 && (
                <Dropdown overlay={menu}>
                  <Button>
                    批量操作 <Icon type="down" />
                  </Button>
                </Dropdown>
              )}
            </div>
            <Table
              className={styles.table}
              rowKey="id"
              rowSelection={rowSelection}
              loading={loading}
              dataSource={list}
              columns={columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
        <RoleModal {...parentMethods} />
      </PageHeaderWrapper>
    );
  }
}

export default User;
