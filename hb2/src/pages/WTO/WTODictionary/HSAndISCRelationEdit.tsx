import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';
import { getPropsParams } from '@/utils/SystemUtil';
import HSCodeWindow, {HSCodeWindowClass} from '@/components/SelectedWindows/HSCodeWindow';
import ICSCodeWindow, { ICSCodeWindowClass } from '@/components/SelectedWindows/ICSCodeWindow';
@connect(({ loading }) => ({
  loading
}))
class HSAndISCRelationEdit extends DefaultEditView {
  constructor(props) {
    super(props, "HSAndISCRelation", "CS-HS码关联管理");
  }

  transFormValue(values) {
    values.hsCode = values.hsCode[0].hsCode;
    values.icsCode = values.icsCode[0].icsCode;
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    const PropsParamsType = getPropsParams(this.props).type;
    return [
      {
        label: 'ICS编码',
        content: getFieldDecorator('icsCode', {initialValue: ICSCodeWindowClass.valueStrToState(orgData.icsCode),rules: createFormRules(true, null) })(<ICSCodeWindow icsCode={orgData.icsCode} maxSelectCount={1}
          onChange={(value) => {
            this.setState({ selectedICS: value })
          }} />),
      },
      {
        label: 'ICS名称',
        content: <HInput.TextArea disabled value={PropsParamsType==='add'?this.state.selectedICS ? this.state.selectedICS.map(item => item.icsName) :'':orgData.icsName} />,
      },
      {
        label: 'HS编码',
        content: getFieldDecorator('hsCode', {initialValue: HSCodeWindowClass.valueStrToState(orgData.hsCode),rules: createFormRules(true, null) })(<HSCodeWindow hsCode={orgData.hsCode} maxSelectCount={1}
          onChange={(value) => {
            this.setState({ selectedHS: value })
          }} />),
      },
      {
        label: 'HS名称',
        content: <HInput.TextArea disabled value={PropsParamsType==='add'?this.state.selectedHS ? this.state.selectedHS.map(item => item.hsName) :'':orgData.hsName} />,
      },
    ];
  }
}
export default Form.create()(HSAndISCRelationEdit);