import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import AdvertEnum from '@/Enums/AdvertEnum';
import RadioGroup from 'antd/lib/radio/group';
import { Radio, Form, Switch } from 'antd';
import { connect } from 'dva';
import { getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';

const classNames = require('./ProjectEdit.less');

@connect(({ loading }) => ({
  loading
}))

class ProjectEdit extends DefaultEditView {

  constructor(props) {
    super(props, 'ProjectManage', "项目编辑");
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    // const associateType = this.state.associateType || orgData.associateType || AdvertEnum.URL_AD;

    return [
      // {
      //   label: '显示顺序',
      //   content: getFieldDecorator('priority', { initialValue: orgData.priority })(<HInputNumber />)
      // },
      // {
      //   label: '是否启用',
      //   content: getFieldDecorator('isShow', { valuePropName: 'checked', initialValue: orgData.isShow === 1 })(<Switch />),
      // }
      {
        label: '项目名称',
        content: getFieldDecorator('projectName', { initialValue: orgData.projectName })(<HInput />)
      },
      {
        label: '标准类型',
        content: getFieldDecorator('standardType', { initialValue: orgData.standardType })(<HInput />)
      },
      {
        label: '关联项目',
        content: getFieldDecorator('relatedProjectv', { initialValue: orgData.relatedProject })(<HInput />)
      },
      {
        label: '项目来源',
        content: getFieldDecorator('projectSource', { initialValue: orgData.projectSource })(<HInput />)
      },
      {
        label: '项目类型',
        content: getFieldDecorator('projectType', { initialValue: orgData.projectType })(<HInput />)
      },
      {
        label: '负责人',
        content: getFieldDecorator('head', { initialValue: orgData.head })(<HInput />)
      },
      {
        label: '项目周期',
        content: getFieldDecorator('projectCycle', { initialValue: orgData.projectCycle })(<HInput />)
      },
      {
        label: '项目金额',
        content: getFieldDecorator('projectAmonut', { initialValue: orgData.projectAmonut })(<HInput />)
      },
      {
        label: '业务领域',
        content: getFieldDecorator('businessArea', { initialValue: orgData.businessArea })(<HInput />)
      },
      {
        label: '项目成员',
        content: getFieldDecorator('projectMember', { initialValue: orgData.projectMember })(<HInput />)
      },
    ];
  }

}

export default Form.create()(ProjectEdit);