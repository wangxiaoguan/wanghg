import { Form, Switch } from 'antd';

import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import RefModal from '@/components/RefModal';
import { createFormRules, getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';
import { connect } from 'dva';
import LinkEnum from '@/Enums/LinkEnum';
import HSelect from '@/components/Antd/HSelect';
import { createSelectOptions } from '@/utils/AntdUtil';


const FORM_ITEM_LAYOUT = {
  wrapperCol: { span: 19 },
  labelCol: { span: 5 }
};

@Form.create()
@connect(({ loading }) => ({
  loading: loading.effects['friendManagement/add'] || loading.effects['friendManagement/update'],
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
        }
        let type = 'friendManagement/add';
        if (this.props.orgData) {
          type = 'friendManagement/update';
          payLoad.id = this.props.orgData.id;
        } else {
          payLoad.module = 'code'
          payLoad.type = 'enter'
        }
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
    const { getFieldDecorator } = this.props.form;
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
        {/* <FormItem {...FORM_ITEM_LAYOUT} label='链接类型'>
          {
            getFieldDecorator('linkType', {
              rules: createFormRules(true),
              initialValue: orgData.linkType,
            })(<HSelect>
              {
                createSelectOptions(LinkEnum.ALL_LIST, LinkEnum.toString)
              }
            </HSelect>)
          } */}
        {/* </FormItem> */}
        <FormItem {...FORM_ITEM_LAYOUT} label='是否启用'>
          {
            getFieldDecorator('visible', {
              valuePropName: 'checked',
              initialValue: orgData.visible === 1,
            })(<Switch />)
          }
        </FormItem>
        {/* <FormItem {...FORM_ITEM_LAYOUT} label="图片">
          {
            getFieldDecorator('imgUrl', {initialValue: createDefaultUploadFile(orgData.imgUrl)})(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />)
          }
        </FormItem> */}
      </Form>
    );
  }
}

export default FriendLinkEdit;