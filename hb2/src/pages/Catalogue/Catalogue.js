/*
 * @Desc: 目录管理
 * @Author: Jackie
 * @Date: 2018-10-24 15:56:16
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-10-30 16:09:22
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Input,
  Tree,
  Popconfirm,
  Select,
  Modal,
  Checkbox,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RightMenu from '../Authentication/Company/RightMenu';

import styles from './index.less';

const { TreeNode } = Tree;
const FormItem = Form.Item;
const { Option } = Select;

const CheckboxGroup = Checkbox.Group;

@connect(({ authcata, loading }) => ({
  authcata,
  loading: loading.effects['authcata/fetch'],
}))
@Form.create()
class Catalogue extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcata/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcata/updateLocal',
      payload: {
        selectedKeys: [],
        group: [],
        groupMap: {},
        rightClickTreeItem: {},
        curItem: undefined,
      },
    });
  }

  onTreeSelect = selectedKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcata/updateTreeSelected',
      payload: selectedKeys,
    });
  };

  handleNew = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcata/updateLocal',
      payload: { isAdd: true },
    });
  };

  handleDel = () => {
    const {
      dispatch,
      authcata: { curItem },
    } = this.props;
    dispatch({
      type: 'authcata/remove',
      payload: curItem,
    });
  };

  handleBatch = status => {
    const {
      dispatch,
      authcata: { curItem },
    } = this.props;
    dispatch({
      type: 'authcata/batch',
      payload: { id: curItem.id, status },
      callback: success => {
        if (success) {
          dispatch({
            type: 'authcata/fetch',
          });
        }
      },
    });
  };

  handleUpdate = e => {
    e.preventDefault();

    const {
      dispatch,
      form,
      authcata: { isAdd },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const type = isAdd ? 'authcata/add' : 'authcata/update';

      dispatch({
        type,
        payload: fieldsValue,
      });
    });
  };

  onRightPress = e => {
    const {
      dispatch,
      authcata: { groupMap },
    } = this.props;
    const { eventKey, title } = e.node.props;
    const { pageX, pageY } = e.event;
    const treeNodeItem = {
      pageX,
      pageY,
      eventKey,
      title,
    };
    const rightClickItemDir = groupMap[eventKey];
    dispatch({
      type: 'authcata/updateLocal',
      payload: {
        rightClickTreeItem: treeNodeItem,
        rightClickItem: groupMap[eventKey],
        bindRoleDirId: rightClickItemDir.id,
        status: 1,
      },
    });
  };

  handleCloseMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcata/updateLocal',
      payload: { rightClickTreeItem: {} },
    });
  };

  onRightMenuItemClick = key => {
    const {
      dispatch,
      authcata: { rightClickItem },
    } = this.props;
    if (key.key === '1') {
      // 角色绑定
      dispatch({
        type: 'authcata/loadCanBindRole',
        payload: {
          sysId: rightClickItem.id,
          page: 1,
          pageSize: 500,
        },
        callback: () => {},
      });
    }
  };

  okRoleHandle = () => {
    const {
      dispatch,
      authcata: { bindRoleDirId, roleSelecteds },
    } = this.props;
    dispatch({
      type: 'authcata/bindRolesOrUnbindRolesByDirIds',
      payload: { sysId: bindRoleDirId, roleIds: roleSelecteds },
      callback: () => {},
    });
  };

  cancelRoleHandle = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcata/updateLocal',
      payload: {
        roleVisible: false,
        roleSelecteds: [],
        roleNoSelecteds: [],
        roleCanBinds: [],
        roleBindeds: [],
        roleSelectedIds: [],
      },
    });
  };

  onRoleChange = checkedList => {
    const {
      dispatch,
      authcata: { roleCanBinds },
    } = this.props;
    const roleCanBindIds = [];
    for (let i = 0; i < roleCanBinds.length; i += 1) {
      const item = roleCanBinds[i];
      roleCanBindIds.push(item.id);
    }
    const intersection = roleCanBindIds.filter(v => checkedList.includes(v));
    const difference = roleCanBindIds
      .concat(checkedList)
      .filter(v => !roleCanBindIds.includes(v) || !checkedList.includes(v));
    dispatch({
      type: 'authcata/updateLocal',
      payload: {
        roleSelecteds: checkedList,
        roleNoSelecteds: difference,
        roleSelectedIds: checkedList,
        intersection,
      },
    });
  };

  renderTree() {
    const {
      authcata: { group = [], selectedKeys = [] },
    } = this.props;
    const loop = data =>
      data.map(item => {
        if (!item) {
          return false;
        }
        if (item.children) {
          return (
            <TreeNode key={item.id} title={item.sysMenuName}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={item.sysMenuName} />;
      });
    return (
      <Tree
        autoExpandParent={false}
        onSelect={this.onTreeSelect}
        selectedKeys={selectedKeys}
        onRightClick={this.onRightPress}
      >
        {loop(group)}
      </Tree>
    );
  }

  renderContent() {
    const {
      form,
      authcata: { statusOpts, curItem, isAdd, menuTypeOpts },
    } = this.props;
    if (!isAdd) {
      if (!curItem || curItem.parentSysMenuId === 0) {
        return false;
      }
    }

    return (
      <Form onSubmit={this.handleUpdate}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="名称：">
          {form.getFieldDecorator('sysMenuName', {
            initialValue: isAdd ? undefined : curItem.sysMenuName,
            rules: [
              { required: true, message: '请输入目录名称!' },
              {
                pattern: new RegExp(/^[_\-0-9a-zA-Z\u4e00-\u9fa5]+$/),
                message: '目录名称只能输入中英文',
              },
            ],
          })(<Input placeholder="请输入名称（必填）" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="描述：">
          {form.getFieldDecorator('description', {
            initialValue: isAdd ? undefined : curItem.description,
            rules: [{ required: false, message: '请输入描述!' }],
          })(<Input placeholder="请输入描述" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="链接：">
          {form.getFieldDecorator('sysMenuUrl', {
            initialValue: isAdd ? undefined : curItem.sysMenuUrl,
            rules: [
              { required: true, message: '请输入链接!' },
              {
                pattern: new RegExp(/^((https|http)?:\/\/)[A-Za-z0-9:_\-.@]+$/),
                message: '链接只能以http://或https://开始的URL格式',
              },
            ],
          })(<Input placeholder="请输入链接（必填）" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="权限码：">
          {form.getFieldDecorator('code', {
            initialValue: isAdd ? undefined : curItem.code,
            rules: [
              { required: true, message: '请输入权限码!' },
              {
                pattern: new RegExp(/^\d{3}$|^\d{5}$/),
                message: '权限码必须为3位或5位数字',
              },
            ],
          })(<Input placeholder="请输入权限码" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="白名单：">
          {form.getFieldDecorator('ipWhitelist', {
            initialValue: isAdd ? undefined : curItem.ipWhitelist,
            rules: [{ required: false, message: '请输入白名单!' }],
          })(<Input placeholder="请输入白名单" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="目录类型：">
          {form.getFieldDecorator('sysMenuType', {
            initialValue: isAdd ? undefined : curItem.sysMenuType.toString(),
            rules: [{ required: true, message: '请选择目录类型' }],
          })(
            <Select placeholder="请选择目录类型" style={{ width: '100%' }}>
              {menuTypeOpts &&
                menuTypeOpts.map(row => (
                  <Option key={row.code} value={row.code}>
                    {row.desp}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="状态">
          {form.getFieldDecorator('status', {
            initialValue: isAdd ? undefined : curItem.status.toString(),
            rules: [{ required: true, message: '请选择状态' }],
          })(
            <Select placeholder="请选择状态" style={{ width: '100%' }}>
              {statusOpts &&
                statusOpts.map(row => (
                  <Option key={row.code} value={row.code}>
                    {row.desp}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {form.getFieldDecorator('id', {
            initialValue: isAdd ? undefined : curItem.id,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {form.getFieldDecorator('parentSysMenuId', {
            initialValue: isAdd ? curItem.id : curItem.parentSysMenuId,
          })(<Input />)}
        </FormItem>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form>
    );
  }

  renderRightMenu = () => {
    const {
      authcata: { rightClickTreeItem, menus, status },
    } = this.props;
    menus[0].disabled = !(status === 1);
    const props = {
      rightClickTreeItem,
      menus,
      onMenuSelect: this.onRightMenuItemClick,
    };
    return <RightMenu {...props} />;
  };

  renderBtns() {
    const {
      authcata: { curItem },
    } = this.props;
    const disabledDel = !curItem || curItem.parentSysMenuId === 0;
    return (
      <div>
        <Button.Group>
          <Button type="primary" onClick={this.handleNew} disabled={!curItem}>
            新增
          </Button>
          <Popconfirm title="确定删除？" onConfirm={this.handleDel}>
            <Button disabled={disabledDel}>删除</Button>
          </Popconfirm>
          <Button onClick={() => this.handleBatch(1)} disabled={!curItem}>
            批量启用
          </Button>
          <Button onClick={() => this.handleBatch(0)} disabled={!curItem}>
            批量禁用
          </Button>
        </Button.Group>
      </div>
    );
  }

  renderRoleModal() {
    const {
      authcata: { roleVisible, roleCanBinds, roleSelectedIds },
    } = this.props;
    const itemList = [];
    for (let i = 0; i < roleCanBinds.length; i += 1) {
      const item = roleCanBinds[i];
      itemList.push(
        <div key={i}>
          <Row>
            <Col>
              <Checkbox value={item.id}>{item.roleName}</Checkbox>
            </Col>
          </Row>
          <br />
        </div>
      );
    }
    return (
      <Modal
        title="角色更改"
        visible={roleVisible}
        onOk={this.okRoleHandle}
        onCancel={this.cancelRoleHandle}
      >
        <CheckboxGroup onChange={this.onRoleChange} value={roleSelectedIds}>
          {itemList}
        </CheckboxGroup>
      </Modal>
    );
  }

  render() {
    return (
      <div onClick={this.handleCloseMenu}>
        <PageHeaderWrapper>
          <Card bordered={false} title="目录管理">
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
          {this.renderRightMenu()}
          {this.renderRoleModal()}
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Catalogue;
