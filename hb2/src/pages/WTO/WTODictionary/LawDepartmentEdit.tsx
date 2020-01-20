import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';
import { createFormRules } from '@/utils/AntdUtil';
import CountryWindow, { CountryWindowClass } from '@/components/SelectedWindows/CountryWindow';


@connect(({ loading }) => ({
  loading
}))
class LawDepartmentEdit extends DefaultEditView {
  constructor(props) {
    super(props, "LawDepartment", "法规分类");
  }

  transFormValue(values) {
    if (values.lawPublishCountry) {
      values.lawPublishCountry = values.lawPublishCountry.map((item) => item.countryName).join();
    }
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {
    };
    return [
      {
        label: '法规发布机构',
        content: getFieldDecorator('lawPublishOrg', { rules: createFormRules(true), initialValue: orgData.lawPublishOrg })(<HInput />),
      },
      {
        label: '所属国家',
        content: getFieldDecorator('lawPublishCountry', { initialValue: CountryWindowClass.valueStrToState(orgData.country) })(<CountryWindow />),
      },
      {
        label: '对应的网站地址',
        content: getFieldDecorator("lawVisitUrl", { initialValue: orgData.lawVisitUrl })(<HInput />),
      }
    ];
  }
}
export default Form.create()(LawDepartmentEdit);