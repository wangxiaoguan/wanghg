import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form } from 'antd';
import RichEditor from '@/components/RichEditor';
import { connect } from 'dva';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';
import { createFormRules, getAttatchStr, createDefaultUploadFile, createSelectOptions } from '@/utils/AntdUtil';
import HSelect from '@/components/Antd/HSelect';
import DynamicNewsEnum from '@/Enums/DynamicNewsEnum';

@connect(({ loading }) => ({
  loading
}))
class NewsEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'faultyNews', '动态新闻');
  }

  transFormValue(formValues) {
    const result = { publishColumn: '1', ...formValues };
    result.imgPath = getAttatchStr(result.imgPath);
    result.filePath = getAttatchStr(result.filePath);
    return result;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    const readOnly = this.readOnly;
    const disabled = readOnly === '1'
    return [
      {
        label: '标题',
        content: getFieldDecorator('title', { rules: createFormRules(true), initialValue: orgData.title })(<Input disabled={disabled} />),
      },
      {
        label: '新闻类型',
        content: getFieldDecorator('type', { rules: createFormRules(true), initialValue: orgData.type })(<HSelect disabled={disabled} >
          {
            createSelectOptions(DynamicNewsEnum.ALL_LIST, DynamicNewsEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '封面',
        content: getFieldDecorator('imgPath', { initialValue: createDefaultUploadFile(orgData.imgPath) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} disabled={disabled} />),
      },
      {
        label: '附件',
        content: getFieldDecorator('filePath', { initialValue: createDefaultUploadFile(orgData.filePath) })(<LimitUpload disabled={disabled} />),
      },
      {
        label: '内容',
        content: getFieldDecorator('content', { initialValue: orgData.content })(<RichEditor disabled={disabled} />),
      },
    ];
  }

}

export default Form.create()(NewsEdit);