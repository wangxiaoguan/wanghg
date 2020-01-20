import React from 'react';
import { Form, DatePicker } from 'antd';
import { createYearOption, createFormRules } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import HSelect from '@/components/Antd/HSelect';
import RichEditor from '@/components/RichEditor';

const moment = require('moment');

const { Option } = HSelect;

@connect(({ loading }) => ({
  loading,
}))
class EventsEdit extends DefaultEditView {
  constructor(props) {
    super(props, "FranceEvents", "中法大事记编辑");
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '标题',
        content: getFieldDecorator('title', { rules: createFormRules(true), initialValue: orgData.title })(<HInput />),
      },
      {
        label: '来源',
        content: getFieldDecorator('source', { initialValue: orgData.source })(<HInput />),
      },
      {
        label: '作者',
        content: getFieldDecorator('author', { initialValue: orgData.author })(<HInput />),
      },
      {
        label: '所属年度',
        content: getFieldDecorator('year', { initialValue: orgData.year })(<HSelect>
          {
            createYearOption().map((item) => {
              return <Option key={item.toString()} value={item}>{item}</Option>
            })
          }
        </HSelect>),
      },
      {
        label: '审核时间',
        content: getFieldDecorator('auditTime', { initialValue: moment(orgData.auditTime) })(<DatePicker />),
      },
      {
        label: '审核人',
        content: getFieldDecorator('auditUser', { initialValue: orgData.auditUser })(<HInput />),
      },
      {
        label: '内容简述',
        content: getFieldDecorator('content', { initialValue: orgData.content })(<RichEditor />),
      },
    ];
  }
}

export default Form.create()(EventsEdit);