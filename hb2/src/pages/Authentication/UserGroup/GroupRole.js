import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Select, Button, Table, Badge, message } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RoleModal from './RoleModal';
import styles from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;
const statusMap = ['default', 'success'];
const status = ['无效', '有效'];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ userGroupRole, loading }) => ({
  userGroupRole,
  loading: loading.models.userGroupRole,
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
    this.groupId = params.id;

    const { dispatch } = this.props;
    dispatch({
      type: 'userGroupRole/fetchGroup',
      payload: this.groupId,
    });
    dispatch({
      type: 'userGroupRole/fetch',
      payload: { groupId: this.groupId },
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
        type: 'userGroupRole/fetch',
        payload: { groupId: this.groupId, ...values },
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
      type: 'userGroupRole/fetch',
      payload: { groupId: this.groupId },
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
      type: 'userGroupRole/fetch',
      payload: { groupId: this.groupId, ...params },
    });
  };

  showModalVisible = visible => {
    this.setState({
      modalVisible: !!visible,
    });
  };

  handleOk = () => {
    this.showModalVisible(false);
    message.success('角色绑定成功！');

    const { dispatch } = this.props;
    dispatch({
      type: 'userGroupRole/fetch',
      payload: { groupId: this.groupId },
    });
  };

  groupUserDeleteUser = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userGroupRole/removeRole',
      payload: { groupId: this.groupId, id },
      callback: () => {
        message.success('解绑成功！');
        dispatch({
          type: 'userGroupRole/fetch',
          payload: { groupId: this.groupId },
        });
      },
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
    const { userGroupRole, loading, dispatch } = this.props;
    const { list, pagination, item = {} } = userGroupRole;
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
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '角色描述',
        dataIndex: 'roledesc',
      },
      {
        title: '角色状态',
        dataIndex: 'roleStatus',
        render(val) {
          const i = val === '0' ? 0 : 1;
          return <Badge status={statusMap[i]} text={status[i]} />;
        },
      },
      {
        title: '操作',
        render: (_, record) => (
          <Fragment>
            <a
              onClick={() => {
                this.groupUserDeleteUser(record.id);
              }}
            >
              解除绑定
            </a>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      groupId: this.groupId,
      modalVisible,
      handleOk: this.handleOk,
      handleCancel: this.showModalVisible,
      dispatch,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false} title={item.groupName || ''}>
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
                绑定角色
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
              className={styles.table}
              rowKey="id"
              loading={loading}
              dataSource={list}
              columns={columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
        {modalVisible && <RoleModal {...parentMethods} />}
      </PageHeaderWrapper>
    );
  }
}

export default User;
