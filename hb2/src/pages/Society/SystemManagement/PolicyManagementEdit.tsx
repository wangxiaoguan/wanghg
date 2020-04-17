import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form, Radio } from 'antd';
import RichEditor from '@/components/RichEditor';
import { connect } from 'dva';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';
import { createFormRules, getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';

@connect(({ loading }) => ({
  loading
}))
class PolicyManagementEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'policyManagement', '政策背景管理编辑');
  }

  transFormValue(formValues) {
    const result = { publishColumn: '3', ...formValues };
    result.imgPath = getAttatchStr(result.imgPath);
    result.filePath = getAttatchStr(result.filePath);
    return result;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '标题',
        content: getFieldDecorator('title', { rules: createFormRules(true), initialValue: orgData.title })(<Input />),
      },
      {
        label: '资讯类型',
        content: getFieldDecorator('newsType', { rules: createFormRules(true, null), initialValue: 1 })(
          <Radio.Group disabled={this.state.orgData}>
            <Radio value={1}>自定义链接</Radio>
            <Radio value={2}>自有资讯</Radio>
          </Radio.Group>
        ),
      },
      this.props.form.getFieldValue('newsType') === 1 ? {
        label: '资讯连接',
        content: getFieldDecorator('skipUrl', { rules: createFormRules(true), initialValue: orgData.skipUrl })(<Input />),
      } :
        {
          label: '内容',
          content: getFieldDecorator('content', { rules: createFormRules(true), initialValue: orgData.content })(<RichEditor />),
        },
    ];
  }

}

export default Form.create()(PolicyManagementEdit);