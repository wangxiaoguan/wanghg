import React from 'react';
import { Form, Input, Modal, Select, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const UserGroupModal = Form.create()(props => {
  const { modalVisible, form, modalType, handleOk, handleCancel, data = {}, dispatch } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      if (modalType === 1) {
        // 新建
        dispatch({
          type: 'userGroup/add',
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
          type: 'userGroup/update',
          payload: value,
          callback: () => {
            handleOk(value);
            message.success('修改成功！');
          },
        });
      }
    });
  };
  return (
    <Modal
      destroyOnClose
      title={modalType === 2 ? '修改群组' : '新建群组'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleCancel()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="群组名">
        {form.getFieldDecorator('groupName', {
          initialValue: data.groupName || '',
          rules: [
            { required: true, message: '请输入群组名称！' },
            {
              pattern: /^([a-zA-Z]|[\u4E00-\u9FA5])[\u4E00-\u9FA5a-zA-Z0-9_]*$/,
              message: '群组名称由中文、数字、字母、下划线组成，必须以中文或字母开头!',
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
            initialValue: data.status || '',
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              <Option value="0">无效</Option>
              <Option value="1">有效</Option>
            </Select>
          )}
        </FormItem>
      )}
    </Modal>
  );
});

export default UserGroupModal;
