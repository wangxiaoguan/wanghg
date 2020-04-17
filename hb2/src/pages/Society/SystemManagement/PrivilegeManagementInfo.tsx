import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { InputNumber, Form, DatePicker } from 'antd';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import { getPropsParams } from '@/utils/SystemUtil';

const moment = require('moment');

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

@connect(({ loading }) => ({
  loading
}))
class PrivilegeManagementInfo extends DefaultEditView {
  constructor(props) {
    super(props, 'privilegeManagement', '核查通报编辑');
  }

  transFormValue(formValues) {
    const value = formValues
    formValues.statisticsDate = value.statisticsDate.format('YYYY-MM')
    return formValues;
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    const receiveTotal = form.getFieldValue('receiveTotal');
    const problemCount = form.getFieldValue('problemCount');
    if(problemCount>receiveTotal){
      callback('问题数量不得大于数据总量');
    }
    callback();
  };

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    let param = getPropsParams(this.props);
    return [
      {
        label: '核查月份',
        content: getFieldDecorator('statisticsDate', { rules: createFormRules(true,null,null,null), initialValue: moment(orgData.statisticsDate)  })(
          <MonthPicker placeholder="Select month" format='YYYY-MM' disabled={!!param.id} />
        ),
      },
      {
        label: '数据总量',
        content: getFieldDecorator('receiveTotal', { rules: [{required:true, message: '请输入数据总量'},{validator: this.validateToNextPassword}], initialValue: orgData.receiveTotal })(<InputNumber precision={0} min={1} />),
      },
      {
        label: '问题数量',
        content: getFieldDecorator('problemCount', { rules: [{required:true, message: '请输入问题数量'},{validator: this.validateToNextPassword}], initialValue: orgData.problemCount, })(<InputNumber precision={0} min={1} />),
      },
      // {
      //   label: '核查错误率',
      //   content: getFieldDecorator('', { rules: createFormRules(true), initialValue: orgData.linkman })(<HInput />),
      // },
    ];
  }

}

export default Form.create()(PrivilegeManagementInfo);