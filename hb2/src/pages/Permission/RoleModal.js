import React from 'react';
import { Form, Input, Modal, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const RoleModal = Form.create()(props => {
  const { modalVisible, form, modalType, handleOk, handleCancel, data = {}, dispatch } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      if (modalType === 1) {
        // 新建
        dispatch({
          type: 'role/add',
          payload: fieldsValue,
          callback: () => {
            handleOk(fieldsValue);
          },
        });
      } else {
        // 修改
        const value = { id: data.id, ...fieldsValue };
        dispatch({
          type: 'role/update',
          payload: value,
          callback: () => {
            handleOk(value);
          },
        });
      }
    });
  };
  return (
    <Modal
      destroyOnClose
      title={modalType === 2 ? '修改角色' : '新建角色'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleCancel()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('roleName', {
          initialValue: data.roleName || '',
          rules: [
            { required: true, message: '请输入角色名称！' },
            {
              pattern: /^([a-zA-Z]|[\u4E00-\u9FA5])[\u4E00-\u9FA5a-zA-Z0-9_]*$/,
              message: '角色名称由中文、数字、字母、下划线组成，必须以中文或字母开头!',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('description', {
          initialValue: data.description || '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      {modalType === 2 && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
          {form.getFieldDecorator('status', {
            initialValue: data.status || '1',
            rules: [{ required: true, message: '请选择状态' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              <Option value="0">停用</Option>
              <Option value="1">启用</Option>
            </Select>
          )}
        </FormItem>
      )}
    </Modal>
  );
});

export default RoleModal;
