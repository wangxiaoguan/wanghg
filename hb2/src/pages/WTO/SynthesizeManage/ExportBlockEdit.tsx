import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { connect } from 'dva';
import { Form, Input } from 'antd';

@connect(({ loading }) => ({
  loading,
}))
class ExportBlockEdit extends DefaultEditView {
  constructor(props) {
    super(props, "exportBlock", "出口遇阻信息管理", {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    });
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '企业名称',
        content: getFieldDecorator('companyName', { initialValue: orgData.companyName })(<Input disabled={true} />),
      },
      {
        label: '地址',
        content: getFieldDecorator('companyAddress', { initialValue: orgData.companyAddress })(<Input disabled={true} />),
      },
      {
        label: '联系人',
        content: getFieldDecorator('contactPerson', { initialValue: orgData.contactPerson })(<Input disabled={true} />),
      },
      {
        label: '电话',
        content: getFieldDecorator('contactPhone', { initialValue: orgData.contactPhone })(<Input disabled={true} />),
      },
      {
        label: '出口产品类别（HS码)',
        content: getFieldDecorator('hsCode', { initialValue: orgData.hsCode })(<Input disabled={true} />),
      },
      {
        label: '主要出口国',
        content: getFieldDecorator('exportCountry', { initialValue: orgData.exportCountry })(<Input disabled={true} />),
      },
      {
        label: '联系邮箱',
        content: getFieldDecorator('email', { initialValue: orgData.email })(<Input disabled={true} />),
      },
      {
        label: '邮编',
        content: getFieldDecorator('postCode', { initialValue: orgData.postCode })(<Input disabled={true} />),
      },
      {
        label: '涉计具体产品',
        content: getFieldDecorator('involvedProduct', { initialValue: orgData.involvedProduct })(<Input disabled={true} />),
      },
      {
        label: '企业基本情况',
        content: getFieldDecorator('companyBasicInfo', { initialValue: orgData.companyBasicInfo })(<Input.TextArea disabled={true} />),
      },
      {
        label: '涉及的贸易政策',
        content: getFieldDecorator('involvedTradePolicy', { initialValue: orgData.involvedTradePolicy })(<Input.TextArea disabled={true} />),
      },
      {
        label: '技术性贸易壁垒的问题描述',
        content: getFieldDecorator('barrierProblemDesp', { initialValue: orgData.barrierProblemDesp })(<Input.TextArea disabled={true} />),
      },
      {
        label: '问题或损失情况',
        content: getFieldDecorator('problemLossDesp', { initialValue: orgData.problemLossDesp })(<Input.TextArea disabled={true} />),
      },
      {
        label: '是否尝试自行解决相关问题',
        content: getFieldDecorator('ownWay', { initialValue: orgData.ownWay })(<Input.TextArea disabled={true} />),
      },
      {
        label: '需要政府协商解决的内容',
        content: getFieldDecorator('govermentWay', { initialValue: orgData.govermentWay })(<Input.TextArea disabled={true} />),
      },
      {
        label: '其他补充内容',
        content: getFieldDecorator('otherDesp', { initialValue: orgData.otherDesp })(<Input.TextArea disabled={true} />),
      },
    ];
  }
}

export default Form.create()(ExportBlockEdit);