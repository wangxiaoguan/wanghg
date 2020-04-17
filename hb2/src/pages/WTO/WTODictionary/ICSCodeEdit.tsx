import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';

@connect(({ loading }) => ({
  loading
}))
class ICSCodeEdit extends DefaultEditView {
  constructor(props) {
    super(props, "ICSCode", "ICS码编辑");
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: 'ICS码',
        content: getFieldDecorator('icsCode', { rules: createFormRules(true), initialValue: orgData.icsCode })(<HInput />),
      },
      {
        label: 'ICS名称',
        content: getFieldDecorator('icsName', { rules: createFormRules(true, null), initialValue: orgData.icsName })(<HInput />),
      },
    ];
  }
}
export default Form.create()(ICSCodeEdit);