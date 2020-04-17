import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Divider,
  Table,
  Badge,
  Menu,
  Dropdown,
  Icon,
  Popconfirm,
  Modal,
} from 'antd';

import HMessage from '@/components/Antd/HMessage';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UserModal from './UserModal';
import styles from '../index.less';
import { getAuthInfo } from '@/utils/utils';

const FormItem = Form.Item;
const userStatusMap = ['default', 'success'];
const userStatus = ['无效', '有效'];
const auditStatusMap = ['default', 'success'];
const auditStatus = ['未审核', '通过', '未通过'];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ userInfo, loading }) => ({
  userInfo,
  loading: loading.effects['userInfo/fetch'],
}))
@Form.create()
class User extends PureComponent {
  state = {
    formValues: {},
    modalVisible: false,
    modalType: 1, // 1新建， 2更新
    currentItem: {},
    selectedRowKeys: [],
    authInfo: [],
    isAdmin: false,
  };

  componentWillMount() {
    this.setState({
      authInfo: getAuthInfo().authInfo,
      isAdmin: getAuthInfo().isAdmin,
    });
    // console.log(getAuthInfo().isAdmin)
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfo/fetch',
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
        type: 'userInfo/fetch',
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
      type: 'userInfo/fetch',
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
      type: 'userInfo/fetch',
      payload: params,
    });
  };

  showModalVisible = (type, data = {}) => {
    this.setState({
      currentItem: data,
      modalVisible: true,
      modalType: type,
    });
    const { dispatch } = this.props;

    dispatch({ type: 'userInfo/queryOrgs' });
    if (type === 2 && data.orgId) {
      dispatch({
        type: 'userInfo/queryDepartments',
        payload: data.orgId,
      });
    }
    dispatch({ type: 'userInfo/queryPasswordRegexRule' });
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
      type: 'userInfo/fetch',
    });
  };

  removeUser = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfo/remove',
      payload: id,
      callback: () => {
        dispatch({
          type: 'userInfo/fetch',
        });
      },
    });
  };

  auditUser = (id, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userInfo/audit',
      payload: { id, auditStatus: status },
      callback: () => {
        dispatch({
          type: 'userInfo/fetch',
        });
      },
    });
  };

  resetPwd = id => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userInfo/reset',
      payload: id,
      callback: () => {
        dispatch({
          type: 'userInfo/fetch',
        });
         setTimeout(() => {
          HMessage.success('密码已重置为 账号.cas ');
        }, 2000);
      },
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const onBatchRemove = () => {
      dispatch({
        type: 'userInfo/removeList',
        payload: selectedRowKeys,
        callback: () => {
          this.setState({
            selectedRowKeys: [],
          });
          HMessage.success('删除成功!');
          dispatch({
            type: 'userInfo/fetch',
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

  gotoUserRole = item => {
    this.setState({
      currentItem: item,
    });
    router.push({
      pathname: `/authentication/user/${item.id}`,
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
      userInfo: { data, orgs, userTypes, departments, passwordRule },
      loading,
      dispatch,
    } = this.props;
    const { list, pagination } = data;

    const { modalVisible, modalType, currentItem, selectedRowKeys, authInfo, isAdmin } = this.state;
    // console.log(authInfo)
    // 用户权限判断

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
        title: '账号',
        dataIndex: 'userAccount',
      },
      {
        title: '姓名',
        dataIndex: 'userName',
      },
      {
        title: '单位',
        dataIndex: 'orgName',
      },
      {
        title: '部门',
        dataIndex: 'deptName',
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
      },
      {
        title: '联系方式',
        dataIndex: 'tel',
      },
      {
        title: '用户类型',
        dataIndex: 'userType',
        filters: [
          {
            text: '外部用户',
            value: 0,
          },
          {
            text: '内部用户',
            value: 1,
          },
        ],
        render(_, record) {
          return <span>{record.userTypeDesp}</span>;
        },
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        filters: [
          {
            text: auditStatus[0],
            value: 0,
          },
          {
            text: auditStatus[1],
            value: 1,
          },
          {
            text: auditStatus[2],
            value: 2,
          },
        ],
        render(val, record) {
          const i = val === '0' ? 0 : 1;
          return <Badge status={auditStatusMap[i]} text={record.auditStatusDesp} />;
        },
      },
      {
        title: '用户状态',
        dataIndex: 'userStatus',
        filters: [
          {
            text: userStatus[0],
            value: 0,
          },
          {
            text: userStatus[1],
            value: 1,
          },
        ],
        render(val, record) {
          const i = val === '0' ? 0 : 1;
          return <Badge status={userStatusMap[i]} text={record.userStatusDesp} />;
        },
      },
      {
        title: '操作',
        render: (_, record) => (
          <Fragment>
            {isAdmin ? (
              <div>
                <a onClick={() => this.gotoUserRole(record)}>角色管理</a>
                <Divider type="vertical" />
                <a onClick={() => this.resetPwd(record.id)}>重置密码</a>
                <Divider type="vertical" />
                <a onClick={() => this.showModalVisible(2, record)}>修改</a>
                <Divider type="vertical" />
                <Popconfirm title="确定删除？" onConfirm={() => this.removeUser(record.id)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title="审核用户"
                  onConfirm={() => this.auditUser(record.id, '1')}
                  onCancel={() => this.auditUser(record.id, '2')}
                  okText="审核通过"
                  cancelText="审核不通过"
                >
                  <a href="#">审核</a>
                </Popconfirm>
              </div>
            ) : (
                ''
              )}
            {/* 非管理员用户，仅能修改自己的用户信息及重置密码以及查看本部门人员基本信息 */}
            {authInfo.account === record.userAccount && !isAdmin ? (
              <div>
                <a onClick={() => this.resetPwd(record.id)}>重置密码</a>
                <Divider type="vertical" />
                <a onClick={() => this.showModalVisible(2, record)}>修改</a>
              </div>
            ) : (
                ''
              )}
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      modalVisible,
      modalType,
      data: currentItem,
      orgs,
      userTypes,
      departments,
      handleOk: this.handleOk,
      handleCancel: this.closeModalVisible,
      dispatch,
      passwordRule,
      wrapClassName: styles.modal,
      onOrgChange: orgId => {
        dispatch({
          type: 'userInfo/queryDepartments',
          payload: orgId,
        });
      },
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
            {isAdmin ? (
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
            ) : (
                ''
              )}
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
        </Card>
        {modalVisible && <UserModal {...parentMethods} />}
      </PageHeaderWrapper>
    );
  }
}

export default User;
