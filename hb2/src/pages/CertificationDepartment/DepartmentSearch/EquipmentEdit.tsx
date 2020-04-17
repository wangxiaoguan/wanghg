import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Form, Input, Upload } from 'antd';
import { connect } from 'dva';
import { createFormRules, orgId } from '@/utils/SystemUtil';
import { getPropsParams } from '@/utils/SystemUtil';
import GlobalEnum from '@/Enums/GlobalEnum';
import LimitUpload from '@/components/LimitUpload'

@connect(({ loading }) => ({
  loading
}))
class EquipmentEdit extends DefaultEditView {
  constructor(props) {
    super(props, "EquipmentDetail", '仪器设备信息', {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    });
    this.setState({
      detail:true
    })
  }

  transFormValue(formValues) {
    const { attachInfo } = formValues
    const file = attachInfo ? attachInfo[0].response.entity[0] : {}
    return { ...formValues, attachInfo: file.id, orgId: getPropsParams(this.props).id }
  }

  createFormItemList() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const {
      apparatusName, standardNumber, model, validTime, attachInfo
    } = this.state.orgData || {}
    
    return [
      {
        label: '仪器设备名称',
        content: getFieldDecorator('apparatusName', { initialValue: apparatusName, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '标准编号',
        content: getFieldDecorator('standardNumber', { initialValue: standardNumber, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '型号规格',
        content: getFieldDecorator('model', { initialValue: model, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      {
        label: '有效截止日期',
        content: getFieldDecorator('validTime', { initialValue: validTime, rules: createFormRules(true, null) })(<Input disabled allowClear={false} />),
      },
      // {
      //   label: '附件',
      //   content: getFieldDecorator('attachInfo', { initialValue: attachInfo, rules: createFormRules(false, null) })(<LimitUpload disabled allowClear={false} />),
      // },
    ];
  }
}

export default Form.create()(EquipmentEdit);