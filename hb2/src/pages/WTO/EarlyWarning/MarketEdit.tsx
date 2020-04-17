import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form, DatePicker } from 'antd';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';
import RichEditor from '@/components/RichEditor';
import { createFormRules, createSelectOptions } from '@/utils/AntdUtil';
import CountryWindow, { CountryWindowClass } from '@/components/SelectedWindows/CountryWindow';
import TagWindow, { TagWindowClass } from '@/components/SelectedWindows/TagWindow';
import HSCodeWindow, { HSCodeWindowClass } from '@/components/SelectedWindows/HSCodeWindow';
import ICSCodeWindow, { ICSCodeWindowClass } from '@/components/SelectedWindows/ICSCodeWindow';
import HSelect from '@/components/Antd/HSelect';
import NewsTypeEnum from '@/Enums/NewsTypeEnum';
import EconomyIndustryWindow, { EconomyIndustryWindowClass } from '@/components/SelectedWindows/EconomyIndustryWindow';

const moment = require('moment');

@connect(({ loading }) => ({
  loading
}))
class MarketEdit extends DefaultEditView {
  constructor(props) {
    super(props, "market", "市场准入动态编辑");
  }

  transFormValue(values) {
    if (values.hsCode) {
      values.hsCode = values.hsCode.map((item) => item.hsCode).join();
    }
    if (values.icsCode) {
      values.icsCode = values.icsCode.map((item) => item.icsCode).join();
    }
    if (values.countryTag) {
      values.countryTag = values.countryTag.map((item) => item.countryName).join();
    }
    if (values.productTag) {
      values.productTag = values.productTag.map((item) => item.labelId).join();
    }
    if (values.otherTag) {
      values.otherTag = values.otherTag.map((item) => item.labelId).join();
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
        label: '新闻标题',
        content: getFieldDecorator('title', { rules: createFormRules(true, null), initialValue: orgData.title })(<HInput />),
      },
      {
        label: '来源',
        content: getFieldDecorator('source', { initialValue: orgData.source })(<HInput />),
      },
      {
        label: '发布时间',
        content: getFieldDecorator('publishTime', { initialValue: moment(orgData.publishTime) })(<DatePicker />),
      },
      {
        label: '新闻类型',
        content: getFieldDecorator('newsType', { rules: createFormRules(true, null), initialValue: orgData.newsType })(<HSelect>
          {
            createSelectOptions(NewsTypeEnum.ALL_LIST, NewsTypeEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '产品标签',
        content: getFieldDecorator('productTag', { initialValue: TagWindowClass.valueStrToState(orgData.productTag) })(<TagWindow />),
      },
      {
        label: 'HS编码',
        content: getFieldDecorator('hsCode', { initialValue: HSCodeWindowClass.valueStrToState(orgData.hsCode) })(<HSCodeWindow />),
      },
      {
        label: '发布国',
        content: getFieldDecorator('publishCountry', { initialValue: orgData.publishCountry })(<HInput />),
      },
      {
        label: '其他标签',
        content: getFieldDecorator('otherTag', { initialValue: TagWindowClass.valueStrToState(orgData.otherTag) })(<TagWindow />),
      },
      {
        label: '国家标签',
        content: getFieldDecorator('countryTag', { initialValue: CountryWindowClass.valueStrToState(orgData.countryTag) })(<CountryWindow />),
      },
      {
        label: 'ICS编码',
        content: getFieldDecorator('icsCode', { initialValue: ICSCodeWindowClass.valueStrToState(orgData.icsCode) })(<ICSCodeWindow />),
      },
      {
        label: '国民经济行业',
        content: getFieldDecorator('economyIndustry', { initialValue: EconomyIndustryWindowClass.valueStrToState(orgData.economyIndustry) })(<EconomyIndustryWindow />),
      },
      {
        label: '内容简述',
        content: getFieldDecorator('newsContent', { initialValue: orgData.newsContent })(<RichEditor />),
      },
    ];
  }
}

export default Form.create()(MarketEdit);