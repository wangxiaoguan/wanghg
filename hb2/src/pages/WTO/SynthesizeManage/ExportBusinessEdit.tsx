import React from 'react';
import RefModal from '@/components/RefModal';
import { Form } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { createFormRules } from '@/utils/AntdUtil';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';

const FORM_ITEM_LAYOUT = {
  wrapperCol: { span: 19 },
  labelCol: { span: 5 }
};

@connect(({ loading }) => ({
  loading: loading.effects['exportBusiness/add'] || loading.effects['exportBusiness/update'],
}))
class ExportBusinessEdit extends RefModal {
  constructor(props) {
    super(props, {
      title: '出口企业编辑',
      onOk: () => {
        this.save();
      }
    });
  }

  createModalProps() {
    return {
      confirmLoading: this.props.loading,
    }
  }

  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const payLoad = values;
        let type = 'exportBusiness/add';
        if (this.props.orgData) {
          type = 'exportBusiness/update';
          payLoad.id = this.props.orgData.id;
        }
        this.props.dispatch(
          {
            type,
            payLoad,
            callBack: () => {
              this.close();
              if (this.props.successHandler) {
                this.props.successHandler();
              }
            }
          }
        );
      }
    });
  }

  renderChildren() {
    const orgData = this.props.orgData || {};
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem label='公司名称' {...FORM_ITEM_LAYOUT}>
          {
            getFieldDecorator('companyName', { rules: createFormRules(true), initialValue: orgData.companyName })(<HInput />)
          }
        </FormItem>
        <FormItem label='地址：' {...FORM_ITEM_LAYOUT}>
          {
            getFieldDecorator('companyAddress', { initialValue: orgData.companyAddress })(<HInput />)
          }
        </FormItem>
        <FormItem label='主营行业' {...FORM_ITEM_LAYOUT}>
          {
            getFieldDecorator('companyIndustry', { initialValue: orgData.companyIndustry })(<HInput />)
          }
        </FormItem>
        <FormItem label='主营产品或服务' {...FORM_ITEM_LAYOUT}>
          {
            getFieldDecorator('companyProduct', { initialValue: orgData.companyProduct })(<HInput />)
          }
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(ExportBusinessEdit);

export { ExportBusinessEdit as ExportBusinessEditClass }