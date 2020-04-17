import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import { Form, DatePicker, Input, InputNumber } from 'antd';
import { createFormRules, createSelectOptions, createNationList, createPoliticalList, createDefaultUploadFile, createEducationList, createDegreeList, createAcademicianTypeList, createProficiencyList, getAttatchStr } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';

const moment = require('moment');

@connect(({ loading }) => ({
  loading
}))
class RoadManagementEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'guangguBase', '筹建历程新增');
  }

  componentDidUpdate() {
    if (this.state.orgData) {
      this._title = '筹建历程编辑'
    }
  }

  transFormValue(formValues) {
    const values = formValues
    // console.log(values)
    // formValues.img = values.img.map((item)=>{return item.id})[0]
    // formValues.pic = values["pic"] ? values["pic"][0].response.entity[0].id : {}
    formValues.pic = getAttatchStr(values.pic);
    return formValues;
  }

  createFormItemList() {
    const disabled = this.readOnly === '1'
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '发生在哪一年',
        content: getFieldDecorator('yearDate', { rules: createFormRules(true, null, /^(19|20)\d{2}$/), initialValue: orgData.yearDate })(<Input disabled={disabled} />),
      },
      {
        label: '事件名称',
        content: getFieldDecorator('title', { rules: createFormRules(true), initialValue: orgData.title })(<Input disabled={disabled} />),
      },
      {
        label: '事件描述',
        content: getFieldDecorator('mes', { rules: createFormRules(true), initialValue: orgData.mes })(<Input disabled={disabled} />),
      },
      {
        label: '建议人',
        content: getFieldDecorator('createUserName', { initialValue: orgData.createUserName })(<Input disabled={disabled} />),
      },
      {
        label: '第一提案人',
        content: getFieldDecorator('orgName', { initialValue: orgData.orgName })(<Input disabled={disabled} />),
      },
      {
        label: '排序',
        content: getFieldDecorator('sort', { rules: createFormRules(true, null, null, null), initialValue: orgData.sort || 1 })(<InputNumber disabled={disabled} />),
      },
      {
        label: '照片',
        content: getFieldDecorator('pic', { initialValue: createDefaultUploadFile(orgData.pic) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} disabled={disabled} />),
      },
    ];
  }
}

export default Form.create()(RoadManagementEdit);