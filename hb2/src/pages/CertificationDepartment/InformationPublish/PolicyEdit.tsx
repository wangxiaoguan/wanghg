import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form } from 'antd';
import RichEditor from '@/components/RichEditor';
import { connect } from 'dva';
import { createFormRules, getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload from '@/components/LimitUpload';

@connect(({ loading }) => ({
  loading
}))
class PolicyEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'InfoList', '政策法规编辑');
  }

  transFormValue(formValues) {
    const result = { publishColumn: '1', ...formValues };
    result.path = getAttatchStr(result.path);
    return result;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '主题',
        content: getFieldDecorator('title', { rules: createFormRules(true), initialValue: orgData.title })(<Input />),
      },
      {
        label: '作者',
        content: getFieldDecorator('author', { rules: createFormRules(true), initialValue: orgData.author })(<Input />),
      },
      {
        label: '附件',
        content: getFieldDecorator('path', { initialValue: createDefaultUploadFile(orgData.path) })(<LimitUpload />),
      },
      {
        label: '内容',
        content: getFieldDecorator('content', { initialValue: orgData.content })(<RichEditor />),
      },
    ];
  }
}

export default Form.create()(PolicyEdit);;