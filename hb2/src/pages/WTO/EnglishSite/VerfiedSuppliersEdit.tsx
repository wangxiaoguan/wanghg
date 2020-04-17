import React from 'react';
import Form from 'antd/lib/form';
import { createFormRules, getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import { connect } from 'dva';
import DefaultEditView from '@/components/DefaultEditView';
import HInput from '@/components/Antd/HInput';
import RichEditor from '@/components/RichEditor';
import HSelect from '@/components/Antd/HSelect';
import HInputNumber from '@/components/Antd/HInputNumber';
import GlobalEnum from '@/Enums/GlobalEnum';

/**
 * VerfiedSuppliersEdit
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class VerfiedSuppliersEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'verfiedSuppliers', 'VerfiedSuppliersEdit');
  }

  transFormValue(formValues) {
    const result = { ...formValues };
    result.attachInfo = getAttatchStr(result.attachInfo);

    return result;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '企业名称',
        content: getFieldDecorator('supplierName', { rules: createFormRules(true), initialValue: orgData.supplierName })(<HInput />),
      },
      {
        label: '产品类别',
        content: getFieldDecorator('productTypeDic', { initialValue: orgData.productTypeDic })(<HSelect />),
      },
      {
        label: '离岸价',
        content: getFieldDecorator('fobPrice', { initialValue: orgData.fobPrice })(<HInputNumber max={Number.MAX_VALUE} />),
      },
      {
        label: '最小预定量',
        content: getFieldDecorator('minQuantity', { initialValue: orgData.minQuantity })(<HInputNumber min={1} max={Number.MAX_VALUE} />),
      },
      {
        label: '供应能力',
        content: getFieldDecorator('supplyAbility', { initialValue: orgData.supplyAbility })(<HInput />),
      },
      {
        label: '港口',
        content: getFieldDecorator('port', { initialValue: orgData.port })(<HInput />),
      },
      {
        label: '付款方式',
        content: getFieldDecorator('payWay', { initialValue: orgData.payWay })(<HInput />),
      },
      {
        label: '联系方式',
        content: getFieldDecorator('contactPhone', { initialValue: orgData.contactPhone })(<HInput />),
      },
      {
        label: '企业简介',
        content: getFieldDecorator('supplierDesp', { initialValue: orgData.supplierDesp })(<RichEditor />),
      },
      {
        label: '附件',
        content: getFieldDecorator('attachInfo', { initialValue: createDefaultUploadFile(orgData.attachInfo) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} max={1} />),
      },
    ];
  }
}


export default Form.create()(VerfiedSuppliersEdit);