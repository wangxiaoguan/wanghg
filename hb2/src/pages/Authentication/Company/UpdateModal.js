/*
 * @Desc: 增改单位/部门
 * @Author: Jackie
 * @Date: 2018-10-26 10:40:00
 * @Last Modified by: Jackie
 * @Last Modified time: 2018-10-26 11:41:55
 */
import React from 'react';
import { Select, Modal, Form, Input } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

const RoleModal = Form.create()(props => {
  const {
    visible,
    form,
    onOk,
    isAdd,
    isDept,
    item,
    onCancel,
    checkNameFunc,
    orgLevels,
    orgStatus,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      onOk(fieldsValue);
    });
  };
  const cancelHandle = () => {
    form.resetFields();
    onCancel();
  };

  const nameValidate = (rule, value, cab) => {
    const reg = /^[a-zA-Z\u4e00-\u9fa5\\(\\)\\（\\）)]+$/;
    if (value !== undefined && value.length > 20) {
      cab('名称必须填写，且不能超出20个字符');
    } else if (checkNameFunc) {
      checkNameFunc(value, has => {
        if (has) {
          cab('抱歉，名称已存在，请重新填写。');
        } else {
          cab();
        }
      });
    } else if (!reg.test(value)) {
      cab('单位/部门名称只能输入中英文');
    } else {
      cab();
    }
  };

  const orgTypeItem = isDept ? 0 : 1;

  return (
    <Modal
      title={isAdd ? '新增' : '编辑'}
      visible={visible}
      onOk={okHandle}
      onCancel={cancelHandle}
    >
      {!isAdd && (
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="编号：">
          {form.getFieldDecorator('code', {
            initialValue: item.code,
          })(<Input placeholder="编号" disabled />)}
        </FormItem>
      )}
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="名称：">
        {form.getFieldDecorator('orgName', {
          initialValue: isAdd ? undefined : item.orgName,
          rules: [{ required: true, message: '请输入名称!' }, { validator: nameValidate }],
        })(<Input placeholder="请输入名称（必填）" />)}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="简称：">
        {form.getFieldDecorator('orgShortName', {
          initialValue: isAdd ? undefined : item.orgShortName,
          rules: [{ required: false, message: '请输入简称!' }],
        })(<Input placeholder="请输入简称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="编码：">
        {form.getFieldDecorator('orgCode', {
          initialValue: isAdd ? undefined : item.orgCode,
          rules: [{ required: false, message: '请输入单位编码!' }],
        })(<Input placeholder="请输入单位编码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="描述：">
        {form.getFieldDecorator('description', {
          initialValue: isAdd ? undefined : item.description,
          rules: [{ required: false, max: 80, message: '请输入描述!' }],
        })(<Input placeholder="请输入描述" />)}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="级别">
        {form.getFieldDecorator('orgClass', {
          initialValue: isAdd ? undefined : item.orgClass,
          rules: [{ required: true, message: '请选择级别' }],
        })(
          <Select placeholder="请选择级别" style={{ width: '100%' }}>
            {orgLevels &&
              orgLevels.map(row => (
                <Option value={row.code} key={row.code}>
                  {row.desp}
                </Option>
              ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="状态">
        {form.getFieldDecorator('status', {
          initialValue: isAdd ? undefined : item.status.toString(),
          rules: [{ required: true, message: '请选择状态' }],
        })(
          <Select placeholder="请选择状态" style={{ width: '100%' }}>
            {orgStatus &&
              orgStatus.map(row => (
                <Option value={row.code} key={row.code}>
                  {row.desp}
                </Option>
              ))}
          </Select>
        )}
      </FormItem>
      <FormItem style={{ display: 'none' }}>
        {form.getFieldDecorator('id', {
          initialValue: isAdd ? undefined : item.id,
        })(<Input />)}
      </FormItem>
      <FormItem style={{ display: 'none' }}>
        {form.getFieldDecorator('parentOrgId', {
          initialValue: isAdd ? item.id : item.parentOrgId,
        })(<Input />)}
      </FormItem>
      <FormItem style={{ display: 'none' }}>
        {form.getFieldDecorator('orgType', {
          initialValue: isAdd ? orgTypeItem : item.orgType,
        })(<Input />)}
      </FormItem>
    </Modal>
  );
});

export default RoleModal;
