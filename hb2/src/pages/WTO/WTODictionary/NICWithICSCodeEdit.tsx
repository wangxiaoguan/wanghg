import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';
import ICSCodeWindow, { ICSCodeWindowClass } from '@/components/SelectedWindows/ICSCodeWindow';

@connect(({ loading }) => ({
  loading
}))
class NICWithICSCodeEdit extends DefaultEditView {
  constructor(props) {
    super(props, "NICWithICSCode", "行业分类--HS关联管理");
  }

  transFormValue(values) {
    if (values.icsCode) {
      values.icsCode = values.icsCode.map((item) => item.icsCode).join();
    }
    return values;
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
        label: 'NIC相关ICS码',
        content: getFieldDecorator('icsCode', { initialValue: ICSCodeWindowClass.valueStrToState(orgData.icsCode) })(<ICSCodeWindow />),
      },
    ];
  }
}
export default Form.create()(NICWithICSCodeEdit);