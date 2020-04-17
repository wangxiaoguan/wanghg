import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import { Form } from 'antd';
import HInputNumber from '@/components/Antd/HInputNumber';
import { createFormRules } from '@/utils/AntdUtil';
import { getPropsParams } from '@/utils/SystemUtil';

@connect(({ loading }) => ({
  loading
}))
class LicenseExpireEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'LicenseExpire', '证书到期提醒设置',
      {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      });
  }

  transFormValue(formValues) {
    const values = formValues
    formValues.time = values.time.toString()
    return formValues
  }

  getOrgData() {
    let param = getPropsParams(this.props);
    // if (param.id) {
    //   this.props.dispatch(
    //     {
    //       type: `${this._nameSpace}/search`,
    //       payLoad: param.id,
    //       callBack: (res) => {
    //         this.setState({ orgData: res.data });
    //         this.props.form.resetFields();
    //       }
    //     }
    //   );
    // }
    this.props.dispatch(
      {
        type: `${this._nameSpace}/search`,
        payLoad: param.id,
        callBack: (res) => {
          this.setState({ orgData: res.data });
          this.props.form.resetFields();
        }
      }
    );
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {
      days: 60,
    }
    return [
      {
        label: '设置到期提醒时间（天数）',
        content: getFieldDecorator('time', { initialValue: orgData.time, rules: createFormRules(true, null) })(<HInputNumber />),
      },
    ];
  }
}

export default Form.create()(LicenseExpireEdit);