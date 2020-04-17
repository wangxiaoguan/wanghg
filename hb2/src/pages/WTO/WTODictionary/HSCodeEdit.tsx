import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';

@connect(({ loading }) => ({
  loading
}))
class HSCodeEdit extends DefaultEditView {
  constructor(props) {
    super(props, "HSCode", "HS码编辑");
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode', { rules: createFormRules(true), initialValue: orgData.hsCode })(<HInput />),
      },
      {
        label: 'HS名称',
        content: getFieldDecorator('hsName', { rules: createFormRules(true), initialValue: orgData.hsName })(<HInput />),
      },
      {
        label: 'HS缩写',
        content: getFieldDecorator('hsShortName', { initialValue: orgData.hsShortName })(<HInput />),
      },
    ];
  }
}
export default Form.create()(HSCodeEdit);