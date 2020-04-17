import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';
import HSCodeWindow, { HSCodeWindowClass } from '@/components/SelectedWindows/HSCodeWindow';

@connect(({ loading }) => ({
  loading
}))
class NICWithHSCodeEdit extends DefaultEditView {
  constructor(props) {
    super(props, "NICWithHSCode", "行业分类--HS关联管理");
  }

  transFormValue(formValues) {
    if (formValues) {
      if (formValues.hsCode) {
        formValues.hsCode = formValues.hsCode.map((item) => item.hsCode).join(',');
      }
    }
    return formValues;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: 'NIC编码',
        content: getFieldDecorator('industryCode', { rules: createFormRules(true), initialValue: orgData.industryCode })(<HInput />),
      },
      {
        label: 'NIC名称',
        content: getFieldDecorator('industryName', { rules: createFormRules(true), initialValue: orgData.industryName })(<HInput />),
      },
      {
        label: 'NIC相关HS码',
        content: getFieldDecorator('hsCode', { initialValue: HSCodeWindowClass.valueStrToState(orgData.hsCode) })(<HSCodeWindow />),
      },
    ];
  }
}
export default Form.create()(NICWithHSCodeEdit);