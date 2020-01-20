import React from 'react';
import { DatePicker, Form } from 'antd';
import { createFormRules,createDefaultUploadFile,getAttatchStr } from '@/utils/AntdUtil';
import RichEditor from '@/components/RichEditor';
import DefaultEditView from '@/components/DefaultEditView';
import LimitUpload from '@/components/LimitUpload';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';
import GlobalEnum from '@/Enums/GlobalEnum';
import CountryWindow, { CountryWindowClass } from '@/components/SelectedWindows/CountryWindow';
import TagWindow, { TagWindowClass } from '@/components/SelectedWindows/TagWindow';

const moment = require('moment');

/**
 * 培训信息编辑
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class TrainingInformationEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'trainingInformation', '培训信息编辑');
  }

  transFormValue(values) {
    if (values.countryTag) {
      values.countryTag = values.countryTag.map((item) => item.countryName).join();
    }
    if (values.productTag) {
      values.productTag = values.productTag.map((item) => item.labelId).join();
    }
    if (values.img) {
      values.img = getAttatchStr(values.img);
    }
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    const readOnly = this.readOnly;
    return [
      {
        label: '培训标题',
        content: getFieldDecorator('trainTitle', { rules: createFormRules(true), initialValue: orgData.trainTitle })(<HInput disabled={readOnly} allowClear={!readOnly} />),
      },
      {
        label: '培训日期',
        content: getFieldDecorator('trainDate', { rules: createFormRules(true, 0), initialValue: orgData.trainDate ? moment(orgData.trainDate) : null })(<DatePicker format='YYYY-MM-DD HH:mm:ss' disabled={readOnly} allowClear={!readOnly} />),
      },
      {
        label: '主讲人',
        content: getFieldDecorator('keynoteSpeaker', { initialValue: orgData.keynoteSpeaker })(<HInput disabled={readOnly} allowClear={!readOnly} />),
      },
      {
        label: '发表作者',
        content: getFieldDecorator('author', { initialValue: orgData.author })(<HInput disabled={readOnly} allowClear={!readOnly} />),
      },
      {
        label: '手机',
        content: getFieldDecorator('contactPhone', { rules: createFormRules(false, null, GlobalEnum.REG_MOBILE_PHONE), initialValue: orgData.contactPhone })(<HInput disabled={readOnly} allowClear={!readOnly} />),
      },
      {
        label: '联系人',
        content: getFieldDecorator('contactPerson', { initialValue: orgData.contactPerson })(<HInput disabled={readOnly} allowClear={!readOnly} />),
      },
      {
        label: '产品标签',
        content: getFieldDecorator('productTag', { initialValue: TagWindowClass.valueStrToState(orgData.productTag) })(<TagWindow disabled={true} />),
      },
      {
        label: '邮箱',
        content: getFieldDecorator('email', { rules: createFormRules(false, null, GlobalEnum.REG_EMAIL), initialValue: orgData.email })(<HInput disabled={readOnly} allowClear={!readOnly} />),
      },
      {
        label: '国家标签',
        content: getFieldDecorator('countryTag', { initialValue: CountryWindowClass.valueStrToState(orgData.countryTag) })(<CountryWindow disabled={true} />),
      },
      {
        label: '公示截止时间',
        content: getFieldDecorator('deadline', { initialValue: moment(orgData.deadline) })(<DatePicker disabled={readOnly} allowClear={!readOnly} />),
      },
      {
        label: '附件上传',
        content: getFieldDecorator('img', { initialValue: createDefaultUploadFile(orgData.img) })(<LimitUpload />),
      },
      {
        label: '培训内容',
        content: getFieldDecorator('trainContent', { initialValue: orgData.trainContent })(<RichEditor disabled={readOnly} />),
      },
    ];
  }
}

export default Form.create()(TrainingInformationEdit);