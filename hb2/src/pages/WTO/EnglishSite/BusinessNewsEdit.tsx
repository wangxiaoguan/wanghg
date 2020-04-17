import React from 'react';
import Form from 'antd/lib/form';
import { createFormRules, getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import { connect } from 'dva';
import DefaultEditView from '@/components/DefaultEditView';
import HInput from '@/components/Antd/HInput';
import RichEditor from '@/components/RichEditor';
import GlobalEnum from '@/Enums/GlobalEnum';

/**
 * BusinessNewsEdit
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class BusinessNewsEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'businessNews', 'BusinessNewsEdit');
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
        content: getFieldDecorator('newsTitle', { rules: createFormRules(true), initialValue: orgData.newsTitle })(<HInput />),
      },
      {
        label: '作者',
        content: getFieldDecorator('newsAuthor', { initialValue: orgData.newsAuthor })(<HInput />),
      },
      {
        label: '内容',
        content: getFieldDecorator('newsContent', { initialValue: orgData.newsContent })(<RichEditor />),
      },
      {
        label: '附件',
        content: getFieldDecorator('attachInfo', { initialValue: createDefaultUploadFile(orgData.attachInfo) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} max={1} />),
      },
    ];
  }
}


export default Form.create()(BusinessNewsEdit);