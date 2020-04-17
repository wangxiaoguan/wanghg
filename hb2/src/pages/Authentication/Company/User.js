/*
 * @Desc: 单位/部门下的用户
 * @Author: Jackie
 * @Date: 2018-10-26 10:40:18
 * @Last Modified by: Jackie
 * @Last Modified time: 2018-10-26 10:40:18
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Input, Button, Row, Col, Badge } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './user.less';

const FormItem = Form.Item;
const userStatusMap = ['default', 'success'];
const userStatus = ['无效', '有效'];
const auditStatusMap = ['default', 'success'];
const auditStatus = ['未审核', '通过', '不通过'];

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ authcomdep, loading }) => ({
  authcomdep,
  loading: loading.effects['authcomdep/fetchUser'],
}))
@Form.create()
class User extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    this.id = params.id;
    dispatch({
      type: 'authcomdep/fetchUser',
      payload: { id: this.id },
    });
  }

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
      ...filters,
      ...formValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    params.id = this.id;
    dispatch({
      type: 'authcomdep/fetchUser',
      payload: params,
    });
  };

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
      const params = {
        ...values,
      };
      params.id = this.id;
      dispatch({
        type: 'authcomdep/fetchUser',
        payload: params,
      });
    });
  };

  handleFormReset = () => {
    const {
      dispatch,
      form,
      match: { params },
    } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.id = params.id;
    dispatch({
      type: 'authcomdep/fetchUser',
      payload: { id: this.id },
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
      authcomdep: { data },
      loading,
    } = this.props;
    const { list, pagination } = data;
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
        onFilter: () => {},
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
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              rowKey="id"
              className={styles.table}
              loading={loading}
              dataSource={list}
              columns={columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default User;
