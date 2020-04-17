import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';
import HInputNumber from '@/components/Antd/HInputNumber';

@connect(({ loading }) => ({
  loading
}))
class ExportCountryEdit extends DefaultEditView {
  constructor(props) {
    super(props, "ExportCountry", "我省出口国家");
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {
      sortNum: 1,
    };
    return [
      {
        label: '国家编号',
        content: getFieldDecorator('countryCode', { rules: createFormRules(true), initialValue: orgData.countryCode })(<HInput />),
      },
      {
        label: '国家名称',
        content: getFieldDecorator('countryName', { rules: createFormRules(true), initialValue: orgData.countryName })(<HInput />),
      },
      {
        label: '排序',
        content: getFieldDecorator('sortNum', { initialValue: orgData.sortNum })(<HInputNumber />),
      },
    ];
  }
}
export default Form.create()(ExportCountryEdit);