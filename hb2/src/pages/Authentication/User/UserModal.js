import React from 'react';
import { Form, Input, Modal, Select, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const UserModal = Form.create()(props => {
  const {
    modalVisible,
    form,
    modalType,
    handleOk,
    handleCancel,
    data = {},
    passwordRule,
    dispatch,
    orgs,
    onOrgChange,
    departments,
    userTypes,
    ...rest
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (modalType === 1) {
        // 新建
        dispatch({
          type: 'userInfo/validAndAdd',
          payload: fieldsValue,
          callback: () => {
            handleOk(fieldsValue);
            message.success('创建成功！');
          },
        });
      } else {
        // 修改
        const value = { id: data.id, ...fieldsValue };
        dispatch({
          type: 'userInfo/update',
          payload: value,
          callback: () => {
            handleOk(value);
            message.success('修改成功！');
          },
        });
      }
    });
  };

  const modalProps = {
    title: modalType === 2 ? '修改账号' : '新建账号',
    visible: modalVisible,
    onOk: okHandle,
    onCancel: handleCancel,
    ...rest,
  };
  return (
    <Modal destroyOnClose {...modalProps}>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="账号">
        {form.getFieldDecorator('userAccount', {
          initialValue: data.userAccount || '',
          rules: [
            { required: true, message: '请输入用户名！' },
            {
              pattern: /^[a-zA-Z]([-_a-zA-Z0-9]{4,14})$/,
              message: '用户名由5-15位数字、字母、下划线组成 , 必须以字母开头！',
            },
          ],
        })(<Input placeholder="请输入" disabled={modalType !== 1} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('userName', {
          initialValue: data.userName || '',
          rules: [
            { required: true, message: '请输入姓名！' },
            { pattern: /^[\u4E00-\u9FA5]{2,50}$/, message: '姓名必须是中文且不能超过50个字符!' },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="身份证号">
        {form.getFieldDecorator('idCard', {
          initialValue: data.idCard || '',
          rules: [
            { required: true, message: '请输入身份证号！' },
            {
              pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
              message: '请输入正确的身份号码！',
            },
          ],
        })(<Input placeholder="请输入" disabled={modalType !== 1} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户类型">
        {form.getFieldDecorator('userType', {
          initialValue: data.userType || '',
          rules: [{ required: true, message: '请选择用户类型' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {userTypes &&
              userTypes.map(v => (
                <Option key={v.code} value={v.code}>
                  {v.desp}
                </Option>
              ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="单位">
        {form.getFieldDecorator('orgId', {
          initialValue: data.orgId || '',
          rules: [{ required: true, message: '请选择单位' }],
        })(
          <Select
            placeholder="请选择"
            style={{ width: '100%' }}
            onSelect={value => {
              form.setFieldsValue({ deptId: '' });
              if (onOrgChange) {
                onOrgChange(value);
              }
            }}
          >
            {orgs &&
              orgs.map(v => (
                <Option key={v.id} value={v.id}>
                  {v.orgName}
                </Option>
              ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门">
        {form.getFieldDecorator('deptId', {
          initialValue: data.deptId || '',
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {departments &&
              departments.map(v => (
                <Option key={v.id} value={v.id}>
                  {v.orgName}
                </Option>
              ))}
          </Select>
        )}
      </FormItem>
      {modalType === 1 && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
          {form.getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码' },
              passwordRule
                ? {
                    pattern: new RegExp(passwordRule.passwordRule),
                    message: passwordRule.regexExplain,
                  }
                : {},
            ],
          })(<Input placeholder="请输入" type="password" />)}
        </FormItem>
      )}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮箱">
        {form.getFieldDecorator('email', {
          initialValue: data.email || '',
          rules: [
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱地址!' },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
        {form.getFieldDecorator('tel', {
          initialValue: data.tel || '',
          rules: [
            { required: true, message: '请输入手机号码！' },
            {
              pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
              message: '请输入正确的手机号码!',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ip白名单">
        {form.getFieldDecorator('ipWhitelist', {
          initialValue: data.ipWhitelist || '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录方式">
        {form.getFieldDecorator('loginType', {
          initialValue: data.loginType || '',
          rules: [{ required: true, message: '请选择登录方式' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="1">密码登录</Option>
            <Option value="2">统一登录</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户状态">
        {form.getFieldDecorator('userStatus', {
          initialValue: data.userStatus || '',
          rules: [{ required: true, message: '请选择用户状态' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="0">无效</Option>
            <Option value="1">有效</Option>
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

export default UserModal;
