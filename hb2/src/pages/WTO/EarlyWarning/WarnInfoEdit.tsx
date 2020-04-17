import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form, DatePicker } from 'antd';
import HInput from '@/components/Antd/HInput';
import { connect } from 'dva';
import { createSelectOptions, createFormRules , createDefaultUploadFile, getAttatchStr, } from '@/utils/AntdUtil';
import HSelect from '@/components/Antd/HSelect';
import RichEditor from '@/components/RichEditor';
import LimitUpload, {LimiteTypeEnum} from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';

import HSCodeWindow, { HSCodeWindowClass } from '@/components/SelectedWindows/HSCodeWindow';
import ICSCodeWindow, { ICSCodeWindowClass } from '@/components/SelectedWindows/ICSCodeWindow';
import WarnInfoLevelEnum from '@/Enums/WarnInfoLevelEnum';
import CountryWindow, { CountryWindowClass } from '@/components/SelectedWindows/CountryWindow';
import TagWindow, { TagWindowClass } from '@/components/SelectedWindows/TagWindow';
import EconomyIndustryWindow, { EconomyIndustryWindowClass } from '@/components/SelectedWindows/EconomyIndustryWindow';

const moment = require('moment');

@connect(({ loading }) => ({
  loading
}))
class WarnInfoEdit extends DefaultEditView {
  constructor(props) {
    super(props, "WarnInfo", "预警信息编辑");
  }

  transFormValue(values) {
    console.log(values);
    if (values.hsCode) {
      values.hsCode = values.hsCode.map((item) => item.hsCode).join();
    }
    if (values.icsCode) {
      values.icsCode = values.icsCode.map((item) => item.icsCode).join();
    }
    if (values.warnCountry) {
      values.warnCountry = values.warnCountry.map((item) => item.countryName).join();
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
    if (values.attachUrl) {
      values.attachUrl = getAttatchStr(values.attachUrl)
    }
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '预警标题',
        content: getFieldDecorator('warnTitle', { rules: createFormRules(true), initialValue: orgData.warnTitle })(<HInput />),
      },
      {
        label: '来源',
        content: getFieldDecorator('warnSource', { initialValue: orgData.warnSource })(<HInput />),
      },
      {
        label: '发布时间',
        content: getFieldDecorator('warnPublishTime', { initialValue: moment(orgData.warnPublishTime) })(<DatePicker />),
      },
      {
        label: '国民经济行业',
        content: getFieldDecorator('economyIndustry', { initialValue: EconomyIndustryWindowClass.valueStrToState(orgData.economyIndustry) })(<EconomyIndustryWindow />),
      },
      {
        label: '通报国家',
        content: getFieldDecorator('warnCountry', { initialValue: CountryWindowClass.valueStrToState(orgData.warnCountry) })(<CountryWindow />),
      },
      {
        label: '关联HS码',
        content: getFieldDecorator('hsCode', { initialValue: HSCodeWindowClass.valueStrToState(orgData.hsCode) })(<HSCodeWindow />),
      },
      {
        label: '关联ICS码',
        content: getFieldDecorator('icsCode', { initialValue: ICSCodeWindowClass.valueStrToState(orgData.icsCode) })(<ICSCodeWindow />),
      },
      {
        label: '产品标签',
        content: getFieldDecorator('productTag', { initialValue: TagWindowClass.valueStrToState(orgData.productTag) })(<TagWindow />),
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
        label: '预警等级',
        content: getFieldDecorator('warnLevel', { initialValue: orgData.warnLevel })(<HSelect>
          {
            createSelectOptions(WarnInfoLevelEnum.ALL_LIST, WarnInfoLevelEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '内容简述',
        content: getFieldDecorator('warnContent', { initialValue: orgData.warnContent })(<RichEditor />),
      },
      {
        label: '图片',
        content: getFieldDecorator('attachUrl', { initialValue: createDefaultUploadFile(orgData.attachUrl) })(
          <LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />
        )
      },
    ];
  }
}
export default Form.create()(WarnInfoEdit);