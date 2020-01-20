import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import { connect } from 'dva';
import { getAttatchStr } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import HInput from '@/components/Antd/HInput';
import GlobalEnum from '@/Enums/GlobalEnum';
import { createFormRules } from '@/utils/SystemUtil';

@connect(({ loading, global }) => ({ loading, global }))
class EnterpriseEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'searchNew', '新增');
  }

  transFormValue(values) {
    const { user } = this.props.global;
    const result = { ...values };
    result.noveltySearchSource = '0'; //默认为内部
    result.createUserId = user.workerName;
    result.applyFormInfo = getAttatchStr(result.applyFormInfo);
    result.compilationNotes = getAttatchStr(result.compilationNotes);
    result.standardDraft = getAttatchStr(result.standardDraft);
    result.noveltySearchDelegateInfo = getAttatchStr(result.noveltySearchDelegateInfo);
    return result;
  }

  getClassName() {
    return ''
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    return [
      {
        label: '企业名称',
        content: getFieldDecorator('enterpriseName', {
          rules: createFormRules(true, null, null, '请输入企业名称'),
        })(<HInput />),
      },
      {
        label: '标准名称',
        content: getFieldDecorator('standardName', {
          rules: createFormRules(true, null, null, '请输入标准名称'),
        })(<HInput />),
      },
      {
        label: '申报表',
        content: getFieldDecorator('applyFormInfo')(<LimitUpload type={LimiteTypeEnum.NORMAL} accept={GlobalEnum.UPLOAD_FILE_ACCEPTS} max={5} />),
      },
      {
        label: '编制说明',
        content: getFieldDecorator('compilationNotes')(<LimitUpload type={LimiteTypeEnum.NORMAL} accept={GlobalEnum.UPLOAD_FILE_ACCEPTS} max={5} />),
      },
      {
        label: '标准草案',
        content: getFieldDecorator('standardDraft')(<LimitUpload type={LimiteTypeEnum.NORMAL} accept={GlobalEnum.UPLOAD_FILE_ACCEPTS} max={5} />),
      },
      {
        label: '查新报告委托单',
        content: getFieldDecorator('noveltySearchDelegateInfo')(
          <LimitUpload type={LimiteTypeEnum.NORMAL} accept={GlobalEnum.UPLOAD_FILE_ACCEPTS} max={5} />
        ),
      },
    ];
  }
}

export default Form.create()(EnterpriseEdit);
