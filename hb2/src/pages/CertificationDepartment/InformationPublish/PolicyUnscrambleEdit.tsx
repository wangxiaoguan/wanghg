import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form } from 'antd';
import RichEditor from '@/components/RichEditor';
import { connect } from 'dva';
import LimitUpload from '@/components/LimitUpload';
import { createFormRules, getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';

@connect(({ loading }) => ({
  loading
}))
class PolicyUnscrambleEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'InfoList', '政策解读编辑');
  }

  transFormValue(formValues) {
    const result = { publishColumn: '2', ...formValues };
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

export default Form.create()(PolicyUnscrambleEdit);