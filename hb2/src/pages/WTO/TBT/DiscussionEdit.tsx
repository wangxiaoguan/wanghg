import React from 'react';
import { Form, DatePicker } from 'antd';
import { createDefaultUploadFile, getAttatchStr, createFormRules } from '@/utils/AntdUtil';
import RichEditor from '@/components/RichEditor';
import HInput from '@/components/Antd/HInput';
import LimitUpload from '@/components/LimitUpload';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import NoticeWindow, { NoticeWindowClass } from '@/components/SelectedWindows/NoticeWindow';
const moment = require('moment');

@connect(({ loading }) => ({
  loading,
}))
class DiscussionEdit extends DefaultEditView {
  constructor(props) {
    super(props, "discussion", "评议活动编辑");
  }

  transFormValue(values) {
    values.attachInfo = getAttatchStr(values.attachInfo);
    values.backgroundInfo = getAttatchStr(values.backgroundInfo);
    values.ongoingInfo = getAttatchStr(values.ongoingInfo);

    if (values.relatedBulletin) {
      values.relatedBulletin = values.relatedBulletin.map((item) => item.bulletinCode).join();
    }
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    console.log(orgData.createDate);
    return [
      {
        label: '活动标题',
        content: getFieldDecorator('activityTitle', { rules: createFormRules(true, null), initialValue: orgData.activityTitle })(<HInput />),
      },
      {
        label: '相关通报',
        content: getFieldDecorator('relatedBulletin', { initialValue: NoticeWindowClass.valueStrToState(orgData.relatedBulletin) })(<NoticeWindow />),
      },
      {
        label: '开始时间',
        content: getFieldDecorator('startTime', { initialValue: moment(orgData.startTime) })(<DatePicker allowClear={false} />),
      },
      {
        label: '结束时间',
        content: getFieldDecorator('endTime', { initialValue: moment(orgData.endTime) })(<DatePicker allowClear={false} />),
      },
      {
        label: '内容简述',
        content: getFieldDecorator('commentContent', { initialValue: orgData.commentContent })(<RichEditor />),
      },
      {
        label: '附件上传',
        content: getFieldDecorator('attachInfo', { initialValue: createDefaultUploadFile(orgData.attachInfo) })(<LimitUpload />),
      },
      {
        label: '背景资料',
        content: getFieldDecorator('backgroundInfo', { initialValue: createDefaultUploadFile(orgData.backgroundInfo) })(<LimitUpload />),
      },
      {
        label: '后续进展',
        content: getFieldDecorator('ongoingInfo', { initialValue: createDefaultUploadFile(orgData.ongoingInfo) })(<LimitUpload />),
      },
    ];
  }
}

export default Form.create()(DiscussionEdit);