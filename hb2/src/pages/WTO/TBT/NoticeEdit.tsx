import React from 'react';
import { Form, Input, Select, DatePicker, Checkbox, } from 'antd';
import RichEditor from '@/components/RichEditor';
import HInput from '@/components/Antd/HInput';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import HSCodeWindow, { HSCodeWindowClass } from '@/components/SelectedWindows/HSCodeWindow';
import ICSCodeWindow, { ICSCodeWindowClass } from '@/components/SelectedWindows/ICSCodeWindow';
import HInputNumber from '@/components/Antd/HInputNumber';
import HSelect from '@/components/Antd/HSelect';
import { createSelectOptions, createFormRules } from '@/utils/AntdUtil';
import WTONoticeTypeEnum from '@/Enums/WTONoticeTypeEnum';
import WTONoticeStatusEnum from '@/Enums/WTONoticeStatusEnum';
import CountryWindow, { CountryWindowClass } from '@/components/SelectedWindows/CountryWindow';
import TagWindow, { TagWindowClass } from '@/components/SelectedWindows/TagWindow';
import EconomyIndustryWindow, { EconomyIndustryWindowClass } from '@/components/SelectedWindows/EconomyIndustryWindow';
const moment = require('moment');

@connect(({ loading }) => ({
  loading
}))
class NoticeEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'notice', '通报编辑');
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
    if (values.bulletinMember) {
      values.bulletinMember = values.bulletinMember.map((item) => item.countryName).join();
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
        label: '通报序列',
        content: getFieldDecorator('bulletinSerialNo', { initialValue: orgData.bulletinSerialNo })(<HInput />),
      },
      {
        label: '通报号',
        content: getFieldDecorator('bulletinCode', { rules: createFormRules(true, null), initialValue: orgData.bulletinCode })(<HInput />),
      },
      {
        label: '公告类型',
        content: getFieldDecorator('noticeType', { rules: createFormRules(true, null), initialValue: orgData.noticeType })(<Select>
          {
            createSelectOptions(WTONoticeStatusEnum.ALL_LIST, WTONoticeStatusEnum.toString)
          }
        </Select>),
      },
      {
        label: '通报类型',
        content: getFieldDecorator('bulletinType', { rules: createFormRules(true, null), initialValue: orgData.bulletinType })(
          <HSelect>
            {
              createSelectOptions(WTONoticeTypeEnum.ALL_LIST, WTONoticeTypeEnum.toString)
            }
          </HSelect>
        ),
      },
      {
        label: '通报时间',
        content: getFieldDecorator('bulletinTime', { rules: createFormRules(true, null), initialValue: moment(orgData.bulletinTime) })(<DatePicker />),
      },
      {
        label: '通报成员',
        content: getFieldDecorator('bulletinMember', { rules: createFormRules(true, null), initialValue: CountryWindowClass.valueStrToState(orgData.bulletinMember) })(<CountryWindow />),
      },
      {
        label: '负责机构',
        content: getFieldDecorator('bulletinOrg', { initialValue: orgData.bulletinOrg })(<HInput />),
      },
      {
        label: '通报依据条款',
        content: getFieldDecorator('bulletinClause', { initialValue: orgData.bulletinClause })(<HInput />),
      },
      {
        label: '国家标签',
        content: getFieldDecorator('countryTag', { initialValue: CountryWindowClass.valueStrToState(orgData.countryTag) })(<CountryWindow />),
      },
      {
        label: '其他标签',
        content: getFieldDecorator('otherTag', { initialValue: TagWindowClass.valueStrToState(orgData.otherTag) })(<TagWindow />),
      },
      {
        label: '产品标签',
        content: getFieldDecorator('productTag', { initialValue: TagWindowClass.valueStrToState(orgData.productTag) })(<TagWindow />),
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
        label: '国民经济行业',
        content: getFieldDecorator('economyIndustry', { initialValue: EconomyIndustryWindowClass.valueStrToState(orgData.economyIndustry) })(<EconomyIndustryWindow />),
      },
      {
        label: '页数',
        content: getFieldDecorator('pageNumber', { initialValue: orgData.pageNumber })(<HInputNumber />),
      },
      {
        label: '使用语言',
        content: getFieldDecorator('bulletinLanguage', { initialValue: orgData.bulletinLanguage })(<HInput />),
      },
      {
        label: '覆盖产品',
        content: getFieldDecorator('coverProduct', { rules: createFormRules(true, null), initialValue: orgData.coverProduct })(<HInput />),
        span: 24,
      },
      {
        label: '通报标题',
        content: getFieldDecorator('bulletinTitle', { rules: createFormRules(true, null), initialValue: orgData.bulletinTitle })(<HInput />),
        span: 24,
      },
      {
        label: '内容简述',
        content: getFieldDecorator('bulletinContent', { initialValue: orgData.bulletinContent })(<RichEditor />),
        span: 24,
      },
      {
        label: '目标和理由',
        content: getFieldDecorator('goalReason', { initialValue: orgData.goalReason })(<Input.TextArea />),
        span: 24,
      },
      {
        label: '相关文件',
        content: getFieldDecorator('u')(<Input.TextArea />),
        span: 24,
      },
      {
        label: '相关文件附件',
        content: getFieldDecorator('v')(<Input.TextArea />),
        span: 24,
      },
      {
        label: '拟批准日期',
        content: getFieldDecorator('w')(<DatePicker />),
        span: 24,
      },
      {
        label: '拟生效日期',
        content: getFieldDecorator('x')(<DatePicker />),
        span: 24,
      },
      {
        label: '意见截止日期',
        content: getFieldDecorator('y')(<DatePicker />),
        span: 24,
      },
      {
        label: '原文截止日期',
        content: getFieldDecorator('z')(<DatePicker />),
        span: 24,
      },
      {
        label: '备注',
        content: getFieldDecorator('a1')(<Input.TextArea />),
        span: 24,
      },
      {
        label: '发送邮件标识',
        content: getFieldDecorator('a2')(<Checkbox>还未向企业用户发送当前通报邮件，如勿需发送，请将该邮件标识设为选中状态！</Checkbox>),
      },
      {
        label: '公告标题',
        content: getFieldDecorator('a3')(<Input.TextArea />),
        span: 24,
      },
    ];
  }
}

export default Form.create()(NoticeEdit);