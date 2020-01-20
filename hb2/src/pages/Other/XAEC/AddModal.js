import React from 'react';
import { Select, Modal, Form, Input } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handle,
    isAdd,
    item,
    handleModalVisible,
    isShowSelect,
    checkCodeFunc,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handle(fieldsValue);
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    handleModalVisible();
  };

  const codeValidate = (rule, value, cab) => {
    const regAccount = /^[A-Za-z0-9-]+$/;
    if (!regAccount.test(value)) {
      cab('编码只能由英文字母和数字组成。');
    } else if (value.length > 100) {
      cab('编码必须填写，且不能超过100个字符');
    } else if (checkCodeFunc) {
      checkCodeFunc(value, has => {
        if (has) {
          cab('抱歉，编码已存在，请重新填写。');
        } else {
          cab();
        }
      });
    } else {
      cab();
    }
  };
  return (
    <Modal
      title={isAdd ? '新增' : '编辑'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="名称：">
        {form.getFieldDecorator('desp', {
          initialValue: isAdd ? '' : item.desp,
          rules: [
            { required: true, min: 1, message: '名称至少为 1个字符' },
            {
              pattern: /^([a-zA-Z]|[\u4E00-\u9FA5])[\u4E00-\u9FA5a-zA-Z0-9_]*$/,
              message: '名称由中文、数字、字母、下划线组成，必须以中文或字母开头!',
            },
          ],
        })(<Input placeholder="请输入名称（必填）" />)}
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="编码：">
        {form.getFieldDecorator('code', {
          initialValue: isAdd ? '' : item.code,
          rules: [
            { required: true, max: 100, message: '编码必须填写，且不能超过100个字符' },
            { validator: codeValidate },
          ],
        })(<Input placeholder="请输入编码（必填）" />)}
      </FormItem>
      {isShowSelect && (
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="类型：">
          {form.getFieldDecorator('type', {
            initialValue: isAdd ? undefined : item.type,
            rules: [{ required: true, message: '请选择结构层级.' }],
          })(
            <Select disabled={!isAdd} placeholder="请选择结构层级" style={{ width: '100%' }}>
              <Option value="0">单层级</Option>
              <Option value="1">多层级</Option>
            </Select>
          )}
        </FormItem>
      )}
    </Modal>
  );
});

export default CreateForm;
