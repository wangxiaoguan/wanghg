import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import { Form, Input } from 'antd';

@connect(({ loading }) => ({
  loading,
}))
class ClientTrainingEdit extends DefaultEditView {
  constructor(props) {
    super(props, "clientTraining", "客户提交培训详情");
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '需求标题',
        content: getFieldDecorator('requireTitle', { initialValue: orgData.requireTitle })(<Input disabled={true} />),
      },
      {
        label: '单位名称',
        content: getFieldDecorator('companyName', { initialValue: orgData.companyName })(<Input disabled={true} />),
      },
      {
        label: '联系人',
        content: getFieldDecorator('contactPerson', { initialValue: orgData.contactPerson })(<Input disabled={true} />),
      },
      {
        label: '电话',
        content: getFieldDecorator('contactPhone', { initialValue: orgData.contactPhone })(<Input disabled={true} />),
      },
      {
        label: '培训内容',
        content: getFieldDecorator('requireContent', { initialValue: orgData.requireContent })(<Input.TextArea disabled={true} />),
      },
    ];
  }
}

export default Form.create()(ClientTrainingEdit);