/*
 * @Desc: 单位管理(新)
 * @Author: Jackie
 * @Date: 2018-10-24 15:56:16
 * @Last Modified by: Jackie
 * @Last Modified time: 2018-10-26 14:10:40
 * import {cloneDeep} from 'lodash';
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Modal, Checkbox } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage } from 'umi/locale';
import TreeDept from './Tree';
import UpdateModal from './UpdateModal';
import RightMenu from './RightMenu';
import { getAuthInfo, checkArr } from '@/utils/utils';

const CheckboxGroup = Checkbox.Group;
const Confirm = Modal.confirm;

const isEmpty = obj => {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0;
};

@connect(({ authcomdep, loading }) => ({
  authcomdep,
  loading: loading.effects['authcomdep/loadTree'],
}))
@Form.create()
class CompDept extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcomdep/loadTree',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcomdep/updateLocal',
      payload: {
        selectedKeys: [],
        selectedRightKeys: [],
        groupRight: [],
        groupRightMap: {},
        group: [],
        groupMap: {},
        rightClickTreeItem: {},
      },
    });
  }

  // =============common================

  handleDel = () => {
    const {
      dispatch,
      authcomdep: { rightClickItem },
    } = this.props;
    dispatch({
      type: 'authcomdep/remove',
      payload: { item: rightClickItem },
    });
  };

  handleUpdate = fieldsValue => {
    const {
      dispatch,
      authcomdep: { isAdd, isDept, status, newOrUpdateDepartmentRootOrgId },
    } = this.props;
    let type = isAdd ? 'authcomdep/add' : 'authcomdep/update';
    if (isAdd && status === 1 && isDept) {
      type = 'authcomdep/addRootDept';
    }
    dispatch({
      type,
      payload: { item: fieldsValue, orgId: newOrUpdateDepartmentRootOrgId },
    });
    this.handleCloseUpdateModal();
  };

  handleCloseMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcomdep/updateLocal',
      payload: { rightClickTreeItem: {} },
    });
  };

  handleCloseUpdateModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcomdep/updateLocal',
      payload: { updateVisible: false },
    });
  };

  showConfirm = () => {
    Confirm({
      title: '慎重提示',
      content: '确认删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.handleDel();
      },
    });
  };

  onRightMenuItemClick = ({ key }) => {
    const {
      dispatch,
      authcomdep: { rightClickItem },
    } = this.props;
    // 执行事件
    if (key === '1') {
      // 增加单位
      dispatch({
        type: 'authcomdep/updateLocal',
        payload: { isAdd: true, isDept: false, updateVisible: true },
      });
    } else if (key === '2') {
      // 增加部门
      dispatch({
        type: 'authcomdep/updateLocal',
        payload: { isAdd: true, isDept: true, updateVisible: true },
      });
    } else if (key === '3') {
      // 修改
      dispatch({
        type: 'authcomdep/updateLocal',
        payload: { isAdd: false, isDept: true, updateVisible: true },
      });
    } else if (key === '4') {
      // 删除
      this.showConfirm();
    } else if (key === '5') {
      router.push({
        pathname: `/authentication/compdept/${rightClickItem.id}`,
      });
    } else if (key === '6') {
      // 角色绑定
      dispatch({
        type: 'authcomdep/loadCanBindRole',
        payload: { orgId: rightClickItem.id },
        callback: () => { },
      });
    }
  };

  renderRightMenu = () => {
    const {
      authcomdep: { rightClickTreeItem, menus, status, canDeleteOrg },
    } = this.props;
    // status 1 左边 status 2 右边
    menus[0].disabled = !(status === 1);
    menus[3].disabled = canDeleteOrg;
    // 在此处控制权限
    if (!getAuthInfo().isAdmin) {
      for (let i = 0; i < menus.length; i += 1) {
        if (i !== 4) {
          menus[i].disabled = true;
        }
      }
    } else {
      const { roles }  =  getAuthInfo().authInfo;
      if (checkArr(roles, '2') && status === 1) {
        for (let i = 0; i < menus.length; i += 1) {
          if (i === 1 || i === 2 || i=== 4) {
            menus[i].disabled = false;
          } else {
            menus[i].disabled = true;
          }
        }
      }
      if (checkArr(roles, '2') && status === 2) {
        for (let i = 0; i < menus.length; i += 1) {
          if (i !== 0) {
            menus[i].disabled = false;
          }else {
            menus[i].disabled = true;
          }
        }
      }
      if (checkArr(roles, '3') && status === 1) {
        for (let i = 0; i < menus.length; i += 1) {
          if (i === 4) {
            menus[i].disabled = false;
          } else {
            menus[i].disabled = true;
          }
        }
      }
      if (checkArr(roles, '3') && status === 2) {
        for (let i = 0; i < menus.length; i += 1) {
          if (i === 2 || i === 4) {
            menus[i].disabled = false;
          } else {
            menus[i].disabled = true;
          }
        }
      }
    }

    const props = {
      rightClickTreeItem,
      menus,
      onMenuSelect: this.onRightMenuItemClick,
    };
    return <RightMenu {...props} />;
  };

  okRoleHandle = () => {
    const {
      dispatch,
      authcomdep: { bindRoleOrgId, roleSelecteds, roleNoSelecteds },
    } = this.props;
    dispatch({
      type: 'authcomdep/bindRolesOrUnbindRolesByOrgId',
      payload: { orgId: bindRoleOrgId, bind: roleSelecteds, unbind: roleNoSelecteds },
      callback: () => { },
    });
  };

  cancelRoleHandle = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authcomdep/updateLocal',
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
      authcomdep: { roleCanBinds },
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
      type: 'authcomdep/updateLocal',
      payload: {
        roleSelecteds: checkedList,
        roleNoSelecteds: difference,
        roleSelectedIds: checkedList,
        intersection,
      },
    });
  };

  renderModal() {
    const {
      form,
      authcomdep: { isAdd, isDept, updateVisible, rightClickItem, orgLevels, orgStatus },
    } = this.props;
    if (isEmpty(rightClickItem)) {
      return false;
    }
    const props = {
      visible: updateVisible,
      form,
      onOk: this.handleUpdate,
      isAdd,
      isDept,
      orgLevels,
      item: rightClickItem,
      onCancel: this.handleCloseUpdateModal,
      checkNameFunc: undefined,
      orgStatus,
    };
    return <UpdateModal {...props} />;
  }

  renderRoleModal() {
    const {
      authcomdep: { roleVisible, roleCanBinds, roleSelectedIds },
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

  // =============start=================================

  // ===============left================

  renderLeftTree() {
    const {
      dispatch,
      authcomdep: { group = [], selectedKeys = [], groupMap = {} },
      loading,
    } = this.props;
    const onTreeSelect = selected => {
      if (selected && selected.length > 0) {
        const curItem = groupMap[selected[0]];
        dispatch({
          type: 'authcomdep/updateLocal',
          payload: { newOrUpdateDepartmentRootOrgId: curItem.id },
        });
      }
      dispatch({
        type: 'authcomdep/loadRightTree',
        payload: { selectedKeys: selected, groupMap },
      });
    };
    const onTreeRightClick = (treeNodeItem, treeItem) => {
      // status : 1左边的树 2 右边的树
      const {
        authcomdep: { rootDepartMentId },
      } = this.props;
      dispatch({
        type: 'authcomdep/updateLocal',
        payload: {
          rightClickTreeItem: treeNodeItem,
          rightClickItem: treeItem,
          status: 1,
          canDeleteOrg: treeItem.id === rootDepartMentId,
          newOrUpdateDepartmentRootOrgId: treeItem.id,
        },
      });
    };

    const props = {
      loading,
      group,
      groupMap,
      selectedKeys,
      onSelect: onTreeSelect,
      onRightClick: onTreeRightClick,
      topTitle: '单位',
    };
    return <TreeDept {...props} />;
  }

  // ===============left===end=====

  // ===============right================

  renderRightTree() {
    const {
      dispatch,
      authcomdep: { groupRight = [], selectedRightKeys = [], groupRightMap = {} },
      loading,
    } = this.props;

    const onTreeSelect = selected => {
      dispatch({
        type: 'authcomdep/updateRightTreeSelected',
        payload: selected,
      });
    };

    const onTreeRightClick = (treeNodeItem, treeItem) => {
      // status : 1左边的树 2 右边的树
      dispatch({
        type: 'authcomdep/updateLocal',
        payload: { rightClickTreeItem: treeNodeItem, rightClickItem: treeItem, status: 2 },
      });
    };

    const props = {
      loading,
      group: groupRight,
      groupMap: groupRightMap,
      selectedKeys: selectedRightKeys,
      onSelect: onTreeSelect,
      onRightClick: onTreeRightClick,
      topTitle: '部门',
    };
    return <TreeDept {...props} />;
  }

  // ===============right===end=====
  render() {
    return (
      <div onClick={this.handleCloseMenu}>
        <PageHeaderWrapper>
          <Card bordered={false} title={formatMessage({ id: 'menu.authentication.company' })}>
            <Row gutter={24}>
              <Col span={12}>{this.renderLeftTree()}</Col>
              <Col span={12}>{this.renderRightTree()}</Col>
            </Row>
          </Card>
          {this.renderRightMenu()}
          {this.renderModal()}
          {this.renderRoleModal()}
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default CompDept;
