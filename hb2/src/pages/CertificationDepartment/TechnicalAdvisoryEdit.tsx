import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form } from 'antd';
import RichEditor from '@/components/RichEditor';
import { connect } from 'dva';

@connect(({ loading }) => ({
  loading
}))
class TechnicalAdvisoryEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'TechnicalAdvisory', '技术咨询回复');
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '技术咨询主题',
        content: getFieldDecorator('question', { initialValue: orgData.question })(<Input />),
      },
      {
        label: '提问时间',
        content: getFieldDecorator('createDate', { initialValue: orgData.createDate })(<Input disabled />),
      },
      {
        label: '技术咨询回复',
        content: getFieldDecorator('answer', { initialValue: orgData.answer })(<RichEditor />),
      },
    ];
  }

}

export default Form.create()(TechnicalAdvisoryEdit);