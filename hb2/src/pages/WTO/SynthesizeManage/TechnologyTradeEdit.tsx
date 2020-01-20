import React from 'react';
import Form from 'antd/lib/form';
import { Input } from 'antd';
import { createFormRules, getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import { connect } from 'dva';
import DefaultEditView from '@/components/DefaultEditView';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';
import CountryWindow, { CountryWindowClass } from '@/components/SelectedWindows/CountryWindow';
import ICSCodeWindow, { ICSCodeWindowClass } from '@/components/SelectedWindows/ICSCodeWindow';
import HSCodeWindow, { HSCodeWindowClass } from '@/components/SelectedWindows/HSCodeWindow';

/**
 * 技术贸易措施专题编辑
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class TechnologyTradeEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'technologyTrade', '技术贸易编辑');
  }

  transFormValue(values) {
    values.attachInfo = getAttatchStr(values.attachInfo);
    if (values.hsCode) {
      values.hsCode = values.hsCode.map((item) => item.hsCode).join();
    }
    if (values.icsCode) {
      values.icsCode = values.icsCode.map((item) => item.icsCode).join();
    }
    if (values.country) {
      values.country = values.country.map((item) => item.countryName).join();
    }
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '专题号',
        content: getFieldDecorator('subjectNo', { rules: createFormRules(true), initialValue: orgData.subjectNo })(<HInput />),
      },
      {
        label: '专题名称',
        content: getFieldDecorator('subjectName', { initialValue: orgData.subjectName })(<HInput />),
      },
      {
        label: '专题内容简介',
        content: getFieldDecorator('subjectContent', { initialValue: orgData.subjectContent })(<Input.TextArea />),
      },
      {
        label: '排序',
        content: getFieldDecorator('sortIndex', { initialValue: orgData.sortIndex })(<HInputNumber />),
      },
      {
        label: '国家',
        content: getFieldDecorator('country', { initialValue: CountryWindowClass.valueStrToState(orgData.country) })(<CountryWindow />),
      },
      {
        label: 'ICS码',
        content: getFieldDecorator('icsCode', { initialValue: ICSCodeWindowClass.valueStrToState(orgData.icsCode) })(<ICSCodeWindow />),
      },
      {
        label: 'HS码',
        content: getFieldDecorator('hsCode', { initialValue: HSCodeWindowClass.valueStrToState(orgData.hsCode) })(<HSCodeWindow />),
      },
      {
        label: '专题图片',
        content: getFieldDecorator('attachInfo', { initialValue: createDefaultUploadFile(orgData.attachInfo) })(<LimitUpload type={LimiteTypeEnum.IMAGE} />),
      },
    ];
  }
}


export default Form.create()(TechnologyTradeEdit);