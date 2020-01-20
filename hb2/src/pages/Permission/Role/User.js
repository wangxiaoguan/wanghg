import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Badge, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UserModal from './UserModal';
import styles from '../Role.less';

const FormItem = Form.Item;
const userStatusMap = ['default', 'success'];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ roleUser, loading }) => ({
  roleUser,
  loading: loading.effects['roleUser/fetch'],
}))
@Form.create()
class User extends PureComponent {
  state = {
    formValues: {},
    modalVisible: false,
  };

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.roleId = params.id;

    const { dispatch } = this.props;
    dispatch({
      type: 'roleUser/fetchRole',
      payload: this.roleId,
    });
    dispatch({
      type: 'roleUser/fetch',
      payload: { roleId: this.roleId },
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
        type: 'roleUser/fetch',
        payload: { roleId: this.roleId, ...values },
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
      type: 'roleUser/fetch',
      payload: { roleId: this.roleId },
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
      type: 'roleUser/fetch',
      payload: { roleId: this.roleId, ...params },
    });
  };

  showModalVisible = visible => {
    this.setState({
      modalVisible: !!visible,
    });
  };

  handleOk = () => {
    this.showModalVisible(false);
    const { dispatch } = this.props;
    dispatch({
      type: 'roleUser/fetch',
      payload: { roleId: this.roleId },
    });
    message.success('绑定成功！');
  };

  unbindUser = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleUser/removeUser',
      payload: { roleId: this.roleId, id },
    }).then(() => {
      message.success('解绑成功！');
      dispatch({
        type: 'roleUser/fetch',
        payload: { roleId: this.roleId },
      });
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
      roleUser: { list, pagination, item = {} },
      loading,
      dispatch,
    } = this.props;

    const { modalVisible } = this.state;

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
        title: '姓名',
        dataIndex: 'userName',
      },
      {
        title: '用户状态',
        dataIndex: 'userStatus',
        render(val, record) {
          const i = val === '0' ? 0 : 1;
          return <Badge status={userStatusMap[i]} text={record.userStatusDesp} />;
        },
      },
      {
        title: '创建人',
        dataIndex: 'createUserName',
      },
      {
        title: '操作',
        render: (_, record) => (
          <Fragment>
            <a onClick={() => this.unbindUser(record.id)}>解除绑定</a>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      modalVisible,
      handleOk: this.handleOk,
      handleCancel: this.showModalVisible,
      roleId: this.roleId,
      dispatch,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false} title={item.roleName || ''}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  this.showModalVisible(true);
                }}
              >
                绑定用户
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  router.goBack();
                }}
              >
                返回
              </Button>
            </div>
            <Table
              rowKey="id"
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
