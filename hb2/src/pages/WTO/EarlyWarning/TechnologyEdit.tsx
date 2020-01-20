import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { getAttatchStr, createFormRules } from '@/utils/AntdUtil';
import LimitUpload from '@/components/LimitUpload';
import HSCodeWindow, { HSCodeWindowClass } from '@/components/SelectedWindows/HSCodeWindow';
import ICSCodeWindow, { ICSCodeWindowClass } from '@/components/SelectedWindows/ICSCodeWindow';
import CountryWindow, { CountryWindowClass } from '@/components/SelectedWindows/CountryWindow';
import TagWindow, { TagWindowClass } from '@/components/SelectedWindows/TagWindow';
import LawDepartmentWindow, { LawDepartmentWindowClass } from '@/components/SelectedWindows/LawDepartmentWindow';
import EconomyIndustryWindow, { EconomyIndustryWindowClass } from '@/components/SelectedWindows/EconomyIndustryWindow';

@connect(({ loading }) => ({
  loading
}))
class TechnologyEdit extends DefaultEditView {
  constructor(props) {
    super(props, "Technology", "技术法规编辑");
  }

  transFormValue(values) {
    values.attachInfo = getAttatchStr(values.attachInfo);
    if (values.hsCode) {
      values.hsCode = values.hsCode.map((item) => item.hsCode).join();
    }
    if (values.icsCode) {
      values.icsCode = values.icsCode.map((item) => item.icsCode).join();
    }
    if (values.countryTag) {
      values.countryTag = values.countryTag.map((item) => item.countryName).join();
    }
    if (values.lawPublishCountry) {
      values.lawPublishCountry = values.lawPublishCountry.map((item) => item.countryName).join();
    }
    if (values.productTag) {
      values.productTag = values.productTag.map((item) => item.labelId).join();
    }
    if (values.otherTag) {
      values.otherTag = values.otherTag.map((item) => item.labelId).join();
    }
    if (values.lawPublishOrg) {
      values.lawPublishOrg = values.lawPublishOrg.map((item) => item.id).join();
    }
    if (values.economyIndustry) {
      values.economyIndustry = values.economyIndustry.map((item) => item.industryCode).join();
    }
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '法规名称',
        content: getFieldDecorator('lawTitle', { rules: createFormRules(true), initialValue: orgData.lawTitle })(<HInput />),
      },
      {
        label: '法规查询地址',
        content: getFieldDecorator('lawQueryUrl', { initialValue: orgData.lawQueryUrl })(<HInput />),
      },
      {
        label: '发布国家',
        content: getFieldDecorator('lawPublishCountry', { rules: createFormRules(true, null), initialValue: CountryWindowClass.valueStrToState(orgData.lawPublishCountry) })(<CountryWindow />),
      },
      {
        label: '发布机构',
        content: getFieldDecorator('lawPublishOrg', { initialValue: LawDepartmentWindowClass.valueStrToState(orgData.lawPublishOrg) })(<LawDepartmentWindow />),
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
        label: '国民经济行业分类',
        content: getFieldDecorator('economyIndustry', { initialValue: EconomyIndustryWindowClass.valueStrToState(orgData.economyIndustry) })(<EconomyIndustryWindow />),
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
        label: 'ICS码',
        content: getFieldDecorator('icsCode', { initialValue: ICSCodeWindowClass.valueStrToState(orgData.icsCode) })(<ICSCodeWindow />),
      },
      {
        label: '其他',
        content: getFieldDecorator('otherInfo', { initialValue: orgData.otherInfo })(<HInput />),
      },
      {
        label: '附件',
        content: getFieldDecorator('attachInfo')(<LimitUpload />),
      },
    ];
  }
}
export default Form.create()(TechnologyEdit);