import React from 'react';
import Form from 'antd/lib/form';
import { connect } from 'dva';
import DefaultEditView from '@/components/DefaultEditView';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';
import { createFormRules } from '@/utils/AntdUtil';

/**
 * ProductTypeDicEdit
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class ProductTypeDicEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'productTypeDic', 'ProductTypeDicEdit');
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {
      sortNum: 0
    };
    return [
      {
        label: '类别名称',
        content: getFieldDecorator('name', { rules: createFormRules(true), initialValue: orgData.name })(<HInput />),
      },
      {
        label: '排序',
        content: getFieldDecorator('sortNum', { initialValue: orgData.sortNum })(<HInputNumber />),
      },
      {
        label: '备注',
        content: getFieldDecorator('remark', { initialValue: orgData.remark })(<HInput />),
      },
    ];
  }
}


export default Form.create()(ProductTypeDicEdit);