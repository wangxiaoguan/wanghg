import React from 'react';
import Form from 'antd/lib/form';
import { getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import { connect } from 'dva';
import DefaultEditView from '@/components/DefaultEditView';
import RichEditor from '@/components/RichEditor';
import { Input } from 'antd';

/**
 * CertificationEdit
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class EnterpriseMessageEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'enterpriseMessage', 'EnterpriseMessage');
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
        label: '留言企业',
        content: getFieldDecorator('enterprise', { initialValue: orgData.enterprise })(<Input disabled />),
      },
      {
        label: '留言信息',
        content: getFieldDecorator('msgContent', { initialValue: orgData.msgContent })(<RichEditor enable={false} />),
      },
      {
        label: '留言时间',
        content: getFieldDecorator('createDate', { initialValue: orgData.createDate })(<Input disabled />),
      },
    ];
  }
}


export default Form.create()(EnterpriseMessageEdit);