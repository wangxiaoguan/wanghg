import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';

@connect(({ loading }) => ({
  loading
}))
class ReportingStatisticsInfo extends DefaultEditView {
  constructor(props) {
    super(props, 'reportingStatistics', '数据核查规则');
  }

  transFormValue(formValues) {

    return { ...formValues, type: '14' };
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [

      {
        label: '主编号',
        content: getFieldDecorator('code', { initialValue: orgData.code })(<HInput />),
      },
      {
        label: '父编号',
        content: getFieldDecorator('parentCode', { initialValue: orgData.parentCode })(<HInput />),
      },
      {
        label: '名称',
        content: getFieldDecorator('name', { initialValue: orgData.name })(<HInput />),
      },
      {
        label: '校验规则',
        content: getFieldDecorator('remark', { initialValue: orgData.remark })(<HInput />),
      },
    ];
  }

}

export default Form.create()(ReportingStatisticsInfo);