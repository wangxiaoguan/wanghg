import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';

@connect(({ loading }) => ({
  loading
}))
class WTOLabelEdit extends DefaultEditView {
  constructor(props) {
    super(props, "WTOLabel", "标签编辑");
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '标签名称',
        content: getFieldDecorator('labelName', { rules: createFormRules(true), initialValue: orgData.labelName })(<HInput />),
      },
    ];
  }
}
export default Form.create()(WTOLabelEdit);