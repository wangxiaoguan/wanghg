import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form, Tree } from 'antd';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';
import { RawDataSource, HBUnificationCodeLib, IssueDataSource } from './RoleDistribute';

const { TreeNode } = Tree

@connect(({ loading }) => ({ loading }))
/**
 * 角色编辑
 */
class RoleEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'RoleManage', '角色权限编辑');
  }

  transFormValue(formValues) {
    console.log('form values => ', formValues)
    console.log('upload values =>', { ...formValues, rolePermission: formValues.rolePermission.join(',') })
    return { ...formValues, rolePermission: formValues.rolePermission.join(',') };
  }


  onChecked = (checkedKeys: string[], info) => {

    console.log('checkedKeys =>', checkedKeys)
    console.log('info =>', info)
    this.props.form.setFieldsValue({
      rolePermission: checkedKeys
    })
  }

  createFormItemList() {
    // console.log(routes)
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    const rolePermission = (orgData.rolePermission && orgData.rolePermission.split(',')) || []
    return [
      {
        label: '角色名称',
        content: getFieldDecorator('roleName', { rules: createFormRules(true), initialValue: orgData.roleName })(<Input disabled={this.state.orgData !== null} />),
      },
      {
        label: '角色分配',
        content: getFieldDecorator('rolePermission', { rules: createFormRules(false, null), initialValue: rolePermission, valuePropName: 'checkedKeys' })(
          <Tree
            checkable
            defaultExpandAll
            onCheck={this.onChecked}
          >
            <TreeNode title="原始数据" key="1">
              {RawDataSource.map((item) => {
                return (
                  <TreeNode title={item.label} key={item.key} />
                )
              })}
            </TreeNode>
            <TreeNode title="湖北省统一代码库" key="2">
              {HBUnificationCodeLib.map((item) => {
                return (
                  <TreeNode title={item.label} key={item.key} />
                )
              })}
            </TreeNode>
            <TreeNode title="问题数据" key="3">
              {IssueDataSource.map((item) => {
                return (
                  <TreeNode title={item.label} key={item.key} />
                )
              })}
            </TreeNode>
            <TreeNode title="数据下载" key="4" />
          </Tree>
        ),
      },
    ];
  }

}

export default Form.create()(RoleEdit);