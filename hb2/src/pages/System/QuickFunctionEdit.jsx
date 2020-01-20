import RefModal from '@/components/RefModal';
import {Form, Switch} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import {createFormRules, createDefaultUploadFile, getAttatchStr} from '@/utils/AntdUtil';
import {connect} from 'dva';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';
import LimitUpload, {LimiteTypeEnum} from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';

const FORM_ITEM_LAYOUT = {
  wrapperCol: {span: 19},
  labelCol: {span: 5}
};

/**
 * 快捷入口编辑
 * successHandler()--编辑成功的回调函数，
 */
@Form.create()
@connect(({loading, quickFunction}) => ({
  quickFunction,
  loading: loading.effects['quickFunction/add'] || loading.effects['quickFunction/update'],
}))
class QuickFunctionEdit extends RefModal {
  constructor(props) {
    super(
      props,
      {
        title: '快捷入口编辑',
        onOk: () => {
          this.save();
        },
      });
  }

  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const payLoad = {
          ...values,
          type: 'enter',
          module: 'index',
          visible: values.visible ? 1 : 0,
        }
        let type = 'quickFunction/add';
        if (this.props.orgData) {
          type = 'quickFunction/update';
          payLoad.id = this.props.orgData.id;
        }
        payLoad.imgUrl = getAttatchStr(payLoad.imgUrl);
        this.props.dispatch(
          {
            type,
            payLoad,
            callBack: () => {
              this.close();
              if (this.props.successHandler)
                this.props.successHandler();
            }
          }
        );
      }
    });
  }

  renderChildren() {
    const orgData = this.props.orgData || {
      priority: 1,
      visible: 1,
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <Form>
        <FormItem {...FORM_ITEM_LAYOUT} label='入口名称'>
          {
            getFieldDecorator('name', {
              rules: createFormRules(true),
              initialValue: orgData.name,
            })(<HInput />)
          }
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label='显示顺序'>
          {
            getFieldDecorator('priority', {
              initialValue: orgData.priority,
            })(<HInputNumber />)
          }
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label='入口链接'>
          {
            getFieldDecorator('skipUrl', {
              rules: createFormRules(true),
              initialValue: orgData.skipUrl,
            })(<HInput placeholder='输入快捷入口对应的链接' />)
          }
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label='是否启用'>
          {
            getFieldDecorator('visible', {
              valuePropName: 'checked',
              initialValue: orgData.visible === 1,
            })(<Switch />)
          }
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="图片">
          {
            getFieldDecorator('imgUrl', {initialValue: createDefaultUploadFile(orgData.imgUrl)})(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />)
          }
        </FormItem>
      </Form>
    );
  }
}

export default QuickFunctionEdit;