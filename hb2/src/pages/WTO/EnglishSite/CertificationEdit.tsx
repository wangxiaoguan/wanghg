import React from 'react';
import Form from 'antd/lib/form';
import { createFormRules, getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import { connect } from 'dva';
import DefaultEditView from '@/components/DefaultEditView';
import HInput from '@/components/Antd/HInput';
import RichEditor from '@/components/RichEditor';

/**
 * CertificationEdit
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class CertificationEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'certification', 'CertificationEdit');
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
        label: '认证名称',
        content: getFieldDecorator('cName', { rules: createFormRules(true), initialValue: orgData.cName })(<HInput />),
      },
      {
        label: '认证内容',
        content: getFieldDecorator('cContent', { initialValue: orgData.cContent })(<RichEditor />),
      },
      {
        label: '附件',
        content: getFieldDecorator('attachInfo', { initialValue: createDefaultUploadFile(orgData.attachInfo) })(<LimitUpload type={LimiteTypeEnum.NORMAL} max={10} />),
      },
    ];
  }
}


export default Form.create()(CertificationEdit);