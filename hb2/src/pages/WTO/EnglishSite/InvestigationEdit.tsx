import React from 'react';
import Form from 'antd/lib/form';
import { createFormRules, getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import { connect } from 'dva';
import DefaultEditView from '@/components/DefaultEditView';
import HInput from '@/components/Antd/HInput';
import RichEditor from '@/components/RichEditor';
import HInputNumber from '@/components/Antd/HInputNumber';

/**
 * InvestigationEdit
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class InvestigationEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'investigation', 'InvestigationEdit');
  }

  transFormValue(formValues) {
    const result = { ...formValues };
    result.attachInfo = getAttatchStr(result.attachInfo);

    return result;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '标题',
        content: getFieldDecorator('title', { rules: createFormRules(true), initialValue: orgData.title })(<HInput />),
      },
      {
        label: '作者',
        content: getFieldDecorator('author', { initialValue: orgData.author })(<HInput />),
      },
      {
        label: '排序',
        content: getFieldDecorator('sortNum', { initialValue: orgData.sortNum })(<HInputNumber />),
      },
      {
        label: '内容',
        content: getFieldDecorator('investmentContent', { initialValue: orgData.investmentContent })(<RichEditor />),
      },
      {
        label: '附件',
        content: getFieldDecorator('attachInfo', { initialValue: createDefaultUploadFile(orgData.attachInfo) })(<LimitUpload type={LimiteTypeEnum.NORMAL} max={10} />),
      },
    ];
  }
}


export default Form.create()(InvestigationEdit);