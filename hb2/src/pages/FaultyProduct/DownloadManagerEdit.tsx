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
class DownloadManagerEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'downloadManager', '下载管理编辑');
  }

  transFormValue(formValues) {
    const result = { ...formValues };
    result.fileId = getAttatchStr(result.fileId);
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
        label: '附件',
        content: getFieldDecorator('fileId', { initialValue: createDefaultUploadFile(orgData.path) })(<LimitUpload />),
      },
      {
        label: '内容',
        content: getFieldDecorator('context', { initialValue: orgData.context })(<RichEditor />),
      },
    ];
  }
}

export default Form.create()(DownloadManagerEdit);;