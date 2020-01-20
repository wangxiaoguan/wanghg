import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form } from 'antd';
import { connect } from 'dva';
import { createFormRules, createDefaultUploadFile,getAttatchStr,createSelectOptions } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import HSelect from '@/components/Antd/HSelect';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';
import BusineseScopeEnum from '@/Enums/BusineseScopeEnum'
@connect(({ loading, global }) => ({
  loading,
  global
}))
class PointCheckEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'pointCheck', '你点我检编辑');
  }

  transFormValue(formValues) {
    const result = {  ...formValues };
    result.productImg = getAttatchStr(result.productImg);
    return result;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '姓名',
        content: getFieldDecorator('contactsName', { rules: createFormRules(true), initialValue: orgData.contactsName })(<Input />),
      },
      // {
      //   label: '经济行业',
      //   content: getFieldDecorator('busineseScope', { rules: createFormRules(true), initialValue: orgData.busineseScope })(<HSelect>
      //     {
      //       createSelectOptions(BusineseScopeEnum.ALL_LIST, BusineseScopeEnum.toString)
      //     }
      //   </HSelect>),
      // },
      {
        label: '手机号码',
        content: getFieldDecorator('contactsTelephone', { rules: createFormRules(true), initialValue: orgData.contactsTelephone })(<HInput />),
      },
      {
        label: '电子邮箱',
        content: getFieldDecorator('productName', { rules: createFormRules(true), initialValue: orgData.productName })(<HInput />),
      },
      {
        label: '产品名称',
        content: getFieldDecorator('productName', { rules: createFormRules(true), initialValue: orgData.productName })(<HInput />),
      },
      {
        label: '产品问题',
        content: getFieldDecorator('problemDescription', { rules: createFormRules(true), initialValue: orgData.problemDescription })(<HInput />),
      },
      {
        label: '生产厂家',
        content: getFieldDecorator('manufacturer', { rules: createFormRules(true), initialValue: orgData.manufacturer })(<HInput />),
      },
      {
        label: '生产批次',
        content: getFieldDecorator('productBatch', { rules: createFormRules(true), initialValue: orgData.productBatch })(<HInput />),
      },
      {
        label: '生产地址',
        content: getFieldDecorator('factoryAddr', { rules: createFormRules(true), initialValue: orgData.factoryAddr })(<HInput />),
      },
      {
        label: '品牌',
        content: getFieldDecorator('brand', { rules: createFormRules(true), initialValue: orgData.brand })(<HInput />),
      },
      {
        label: '产品型号',
        content: getFieldDecorator('productModel', { rules: createFormRules(true), initialValue: orgData.productModel })(<HInput />),
      },
      {
        label: '产品图片',
        content: getFieldDecorator('productImg', { rules: createFormRules(true,null,null,null), initialValue: createDefaultUploadFile(orgData.productImg) })(<LimitUpload  type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS}/>),
      },
      // {
      //   label: '质量负责人',
      //   content: getFieldDecorator('qaManager', { rules: createFormRules(true), initialValue: orgData.qaManager })(<HInput />),
      // },
      // {
      //   label: '电子邮箱',
      //   content: getFieldDecorator('email', { rules: createFormRules(false, null, GlobalEnum.REG_EMAIL), initialValue: orgData.email })(<HInput />),
      // },
      // {
      //   label: '电话',
      //   content: getFieldDecorator('telephone', { rules: createFormRules(false, null, GlobalEnum.REG_PHONE), initialValue: orgData.telephone })(<HInput />),
      // },
      // {
      //   label: '手机',
      //   content: getFieldDecorator('mobelPhone', { rules: createFormRules(false, null, GlobalEnum.REG_MOBILE_PHONE), initialValue: orgData.mobelPhone })(<HInput />),
      // },
      // {
      //   label: '营业执照',
      //   content: getFieldDecorator('licenceImg', { initialValue: createDefaultUploadFile(orgData.licenceImg) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />),
      // },
    ];
  }

}

export default Form.create()(PointCheckEdit);