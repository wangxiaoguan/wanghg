import React, { Component } from 'react';
import { Form, Button, message, Modal } from 'antd';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import HInput from '@/components/Antd/HInput';
import FormItem from 'antd/lib/form/FormItem';
import { createFormRules } from '@/utils/AntdUtil';
import { connect } from 'dva';
import BackButton from '@/components/BackButton';

const formLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ loading }) => ({
  loading,
}))
class ModifyModal extends Component<IFormAndDvaInterface, any> {

  save = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
          values.id = this.props.userData.id;
          this.props.submit(values)
      }
    });
  };

  createFormItemList() {
    const { userData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const phoneReg = /^1[3-9]\d{9}$/;
    return [
      {
        label: '企业名称',
        content: getFieldDecorator('companyName', {
          rules: createFormRules(true),
          initialValue: userData ? userData.companyName : '',
        })(<HInput />),
      },
      {
        label: '手机号码',
        content: getFieldDecorator('phone', {
          rules: createFormRules(true, null, phoneReg),
          initialValue: userData ? userData.phone : '',
        })(<HInput />),
      },
      {
        label: '用户名',
        content: getFieldDecorator('userName', {
          rules: createFormRules(true),
          initialValue: userData ? userData.userName : '',
        })(<HInput />),
      },
    ];
  }

  render() {
    const formItems = this.createFormItemList();
    return (
      <Modal
        visible={this.props.visible}
        onOk={() => this.save()}
        onCancel={() => this.props.clear()}
        title='用户信息修改'
      >
        <Form>
          {formItems &&
            formItems.map(item => {
              return (
                <FormItem key={item.label} {...formLayout} label={item.label}>
                  {item.content}
                </FormItem>
              );
            })}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ModifyModal);
