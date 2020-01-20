import React from 'react';
import { Input, Form } from 'antd';
import { createFormRules, createDefaultUploadFile, getAttatchStr } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';

@connect(({ loading }) => (
  {
    loading,
  }
))
class ServicesProjectEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'servicesProject', '服务项目管理');

  }

  transFormValue(values) {
    values.attachInfo = getAttatchStr(values.attachInfo);
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {
      sortIndex: 1,
    };
    return [
      {
        label: '标题',
        content: getFieldDecorator('title', { rules: createFormRules(true), initialValue: orgData.title })(<HInput />),
      },
      {
        label: '项目名称',
        content: getFieldDecorator('itemName', { rules: createFormRules(true), initialValue: orgData.itemName })(<HInput />),
      },
      {
        label: '项目简述',
        content: getFieldDecorator('itemIntroduction', { initialValue: orgData.itemIntroduction })(<Input.TextArea />),
      },
      {
        label: '合作方式',
        content: getFieldDecorator('cooperationMode', { initialValue: orgData.cooperationMode })(<Input.TextArea />),
      },
      {
        label: '联系方式',
        content: getFieldDecorator('contactInformation', { initialValue: orgData.contactInformation })(<Input.TextArea />),
      },
      {
        label: '排序',
        content: getFieldDecorator('sortIndex', { initialValue: orgData.sortIndex })(<HInputNumber />),
      },
      {
        label: '图片',
        content: getFieldDecorator('attachInfo', { initialValue: createDefaultUploadFile(orgData.attachInfo) })(<LimitUpload type={LimiteTypeEnum.IMAGE} />),
      },
    ];
  }
}

export default Form.create()(ServicesProjectEdit);