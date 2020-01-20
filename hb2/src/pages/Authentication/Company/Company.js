/*
 * @Desc: 单位管理
 * @Author: Jackie
 * @Date: 2018-10-24 15:56:16
 * @Last Modified by: Jackie
 * @Last Modified time: 2018-10-26 12:28:25
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Button, Input, Tree, Popconfirm, Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './index.less';

const { TreeNode } = Tree;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ authcom, loading }) => ({
  authcom,
  loading: loading.effects['authcom/fetch'],
}))
@Form.create()
class Company extends PureComponent {
  onTreeSelect = selectedKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcom/updateTreeSelected',
      payload: selectedKeys,
    });
  };

  handleNew = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcom/updateLocal',
      payload: { isAdd: true },
    });
  };

  handleDel = () => {
    const {
      dispatch,
      authcom: { curItem },
    } = this.props;
    dispatch({
      type: 'authcom/remove',
      payload: { item: curItem },
    });
  };

  handleUpdate = e => {
    e.preventDefault();

    const {
      dispatch,
      form,
      authcom: { isAdd },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const type = isAdd ? 'authcom/add' : 'authcom/update';

      dispatch({
        type,
        payload: { item: fieldsValue },
      });
    });
  };

  gotoDepartment = () => {
    const {
      authcom: { curItem },
    } = this.props;
    router.push({
      // pathname: '/authentication/department',
      pathname: `/authentication/company/${curItem.id}`,
      state: {
        item: curItem,
      },
    });
  };

  renderBtns() {
    const {
      authcom: { curItem },
    } = this.props;
    const disabledDel = !curItem || curItem.parentId === 0;
    return (
      <div>
        <Button.Group>
          <Button
            type="primary"
            style={{ marginRight: '24px' }}
            onClick={this.gotoDepartment}
            disabled={!curItem}
          >
            查看部门
          </Button>
          <Button type="primary" onClick={this.handleNew} disabled={!curItem}>
            新增
          </Button>
          <Popconfirm title="确定删除？" onConfirm={this.handleDel}>
            <Button disabled={disabledDel}>删除</Button>
          </Popconfirm>
        </Button.Group>
      </div>
    );
  }

  renderTree() {
    const {
      authcom: { group = [], selectedKeys = [] },
    } = this.props;
    const loop = data =>
      data.map(item => {
        if (!item) {
          return false;
        }
        if (item.children) {
          return (
            <TreeNode key={item.code} title={item.title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.code} title={item.title} />;
      });
    return (
      <Tree autoExpandParent={false} onSelect={this.onTreeSelect} selectedKeys={selectedKeys}>
        {loop(group)}
      </Tree>
    );
  }

  renderContent() {
    const {
      form,
      authcom: { statusOpts, curItem, isAdd },
    } = this.props;
    if (!isAdd) {
      if (!curItem || curItem.parentId === 0) {
        return false;
      }
    }

    return (
      <Form onSubmit={this.handleUpdate}>
        {!isAdd && (
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="编号：">
            {form.getFieldDecorator('code', {
              initialValue: curItem.code,
            })(<Input placeholder="编号" disabled />)}
          </FormItem>
        )}
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="名称：">
          {form.getFieldDecorator('title', {
            initialValue: isAdd ? undefined : curItem.title,
            rules: [{ required: true, message: '请输入!' }],
          })(<Input placeholder="请输入名称（必填）" />)}
        </FormItem>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="描述：">
          {form.getFieldDecorator('desp', {
            initialValue: isAdd ? undefined : curItem.desp,
            rules: [{ required: true, message: '请输入描述!' }],
          })(<Input placeholder="请输入描述（必填）" />)}
        </FormItem>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="状态">
          {form.getFieldDecorator('status', {
            initialValue: isAdd ? undefined : curItem.status.toString(),
            rules: [{ required: true, message: '请选择状态' }],
          })(
            <Select placeholder="请选择状态" style={{ width: '100%' }}>
              {statusOpts && statusOpts.map(row => <Option value={row.code}>{row.desp}</Option>)}
            </Select>
          )}
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {form.getFieldDecorator('id', {
            initialValue: isAdd ? undefined : curItem.id,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {form.getFieldDecorator('parentId', {
            initialValue: isAdd ? curItem.id : curItem.parentId,
          })(<Input />)}
        </FormItem>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form>
    );
  }

  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="单位管理">
          {this.renderBtns()}
          <div style={{ marginTop: '16px' }}>
            <Row gutter={24}>
              <Col span={12}>
                <Card className={styles.cardContent}>{this.renderTree()}</Card>
              </Col>
              <Col span={12}>
                <Card className={styles.cardContent}>{this.renderContent()}</Card>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Company;
