import {Form, Switch} from 'antd';

import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import RefModal from '@/components/RefModal';
import {createFormRules, getAttatchStr, createDefaultUploadFile} from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';
import LimitUpload, {LimiteTypeEnum} from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';
import {connect} from 'dva';

const FORM_ITEM_LAYOUT = {
  wrapperCol: {span: 19},
  labelCol: {span: 5}
};

@Form.create()
@connect(({loading}) => ({
  loading: loading.effects['quickFunction/add'] || loading.effects['quickFunction/update'],
}))
class FriendLinkEdit extends RefModal {
  constructor(props) {
    super(props, {
      title: '友情链接编辑',
      onOk: () => {
        this.save();
      }
    });
  }

  close() {
    this.props.form.resetFields();
    super.close();
  }

  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const payLoad = {
          ...values,
          type: 'friendLink',
          module: 'index',
          visible: values.visible ? 1 : 0,
        }
        let type = 'friendLink/add';
        if (this.props.orgData) {
          type = 'friendLink/update';
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
        <FormItem {...FORM_ITEM_LAYOUT} label='链接名称'>
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
        <FormItem {...FORM_ITEM_LAYOUT} label='链接地址'>
          {
            getFieldDecorator('skipUrl', {
              rules: createFormRules(true),
              initialValue: orgData.skipUrl,
            })(<HInput placeholder='输入友情链接的地址' />)
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

export default FriendLinkEdit;