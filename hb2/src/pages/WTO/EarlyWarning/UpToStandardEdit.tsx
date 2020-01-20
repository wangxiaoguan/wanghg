import React from 'react';
import { Form, DatePicker } from 'antd';
import { createFormRules, createDefaultUploadFile, getAttatchStr } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import HSCodeWindow, { HSCodeWindowClass } from '@/components/SelectedWindows/HSCodeWindow';
import LimitUpload from '@/components/LimitUpload';
import CountryWindow, { CountryWindowClass } from '@/components/SelectedWindows/CountryWindow';
import TagWindow, { TagWindowClass } from '@/components/SelectedWindows/TagWindow';

const moment = require('moment');

@connect(({ loading }) => ({
  loading,
}))
class UpToStandardEdit extends DefaultEditView {
  constructor(props) {
    super(props, "UpToStandard", "合格评定程序编辑");
  }
  transFormValue(values) {
    if (values.attachInfo) {
      values.attachInfo = getAttatchStr(values.attachInfo);
    }
    if (values.hsCode) {
      values.hsCode = values.hsCode.map((item) => item.hsCode).join();
    }
    if (values.countryTag) {
      values.countryTag = values.countryTag.map((item) => item.countryName).join();
    }
    if (values.countryName) {
      values.countryName = values.countryName.map((item) => item.countryName).join();
    }
    if (values.productTag) {
      values.productTag = values.productTag.map((item) => item.labelId).join();
    }
    if (values.otherTag) {
      values.otherTag = values.otherTag.map((item) => item.labelId).join();
    }
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '认证名称',
        content: getFieldDecorator('auName', { rules: createFormRules(true), initialValue: orgData.auName })(<HInput />),
      },
      {
        label: '国内代理认证机构',
        content: getFieldDecorator('auAgentOrg', { initialValue: orgData.auAgentOrg })(<HInput />),
      },
      {
        label: '认证机构',
        content: getFieldDecorator('auOrg', { initialValue: orgData.auOrg })(<HInput />),
      },
      {
        label: '认证性质',
        content: getFieldDecorator('auNature', { initialValue: orgData.auNature })(<HInput />),
      },
      {
        label: '国内代理检测机构',
        content: getFieldDecorator('agentDetectOrg', { initialValue: orgData.agentDetectOrg })(<HInput />),
      },
      {
        label: '适用范围',
        content: getFieldDecorator('auApplyArea', { initialValue: orgData.auApplyArea })(<HInput />),
      },
      {
        label: '录入时间',
        content: getFieldDecorator('noteDate', { initialValue: moment(orgData.noteDate) })(<DatePicker />),
      },
      {
        label: '产品标签',
        content: getFieldDecorator('productTag', { initialValue: TagWindowClass.valueStrToState(orgData.productTag) })(<TagWindow />),
      },
      {
        label: '国家标签',
        content: getFieldDecorator('countryTag', { initialValue: CountryWindowClass.valueStrToState(orgData.countryTag) })(<CountryWindow />),
      },
      {
        label: '国家',
        content: getFieldDecorator('countryName', { initialValue: CountryWindowClass.valueStrToState(orgData.countryName) })(<CountryWindow />),
      },
      {
        label: '其他标签',
        content: getFieldDecorator('otherTag', { initialValue: TagWindowClass.valueStrToState(orgData.otherTag) })(<TagWindow />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode', { rules: createFormRules(true, null), initialValue: HSCodeWindowClass.valueStrToState(orgData.hsCode) })(<HSCodeWindow />),
      },
      {
        label: '认证简介',
        content: getFieldDecorator('auBriefIntroduction', { initialValue: orgData.auBriefIntroduction })(<HInput.TextArea autosize={{ minRows: 4, maxRows: 6 }} />),
      },
      {
        label: '认证产品范围',
        content: getFieldDecorator('auProductArea', { initialValue: orgData.auProductArea })(<HInput.TextArea autosize={{ minRows: 4, maxRows: 6 }} />),
      },
      {
        label: '附件',
        content: getFieldDecorator('attachInfo', { initialValue: createDefaultUploadFile(orgData.attachInfo) })(<LimitUpload />),
      },
    ];
  }
}

export default Form.create()(UpToStandardEdit);