import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form } from 'antd';
import HSelect from '@/components/Antd/HSelect';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import AptitudeEnum from '@/Enums/AptitudeEnum'
import { createSelectOptions } from '@/utils/AntdUtil';
import { getPropsParams } from '@/utils/SystemUtil';

@connect(({ loading }) => ({
  loading
}))
class FaultProductEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'faultyProduct', '缺陷产品编辑');
  }

  componentDidUpdate(prevProps) {
    let prevParam = getPropsParams(prevProps);
    let param = getPropsParams(this.props);
    const {detail} = this.state
    if (param.type && !detail) {
      // this.getOrgData();
      this.setState({
        detail:true
      })
    }
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    const {detail} = this.state
    return [
      {
        label: '机构名称',
        content: getFieldDecorator('name', { rules: createFormRules(false), initialValue: orgData.name })(<Input disabled={detail} allowClear={!detail}/>),
      },
      {
        label: '检测资质',
        content: getFieldDecorator('aptitude', { rules: createFormRules(false), initialValue: orgData.aptitude })(<HSelect disabled={detail} allowClear={!detail}>
          {
            createSelectOptions(AptitudeEnum.ALL_LIST, AptitudeEnum.toString)
          }
        </HSelect>),
      },
      {
        label: '检测范围',
        content: getFieldDecorator('checkReason', { rules: createFormRules(false), initialValue: orgData.checkReason })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '联系人',
        content: getFieldDecorator('linkman', { rules: createFormRules(false), initialValue: orgData.linkman })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '地址',
        content: getFieldDecorator('addr', { rules: createFormRules(false), initialValue: orgData.addr })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '联系方式',
        content: getFieldDecorator('telephone', { rules: createFormRules(false), initialValue: orgData.telephone })(<HInput disabled={detail} allowClear={!detail} />),
      },
      {
        label: '机构介绍',
        content: getFieldDecorator('description', { rules: createFormRules(false), initialValue: orgData.description })(<HInput disabled={detail} allowClear={!detail} />),
      },
    ];
  }

}

export default Form.create()(FaultProductEdit);