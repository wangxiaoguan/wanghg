import { Form, Switch } from 'antd';

import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import RefModal from '@/components/RefModal';
import { createFormRules, getAttatchStr, createDefaultUploadFile,createSelectOptions } from '@/utils/AntdUtil';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import GlobalEnum from '@/Enums/GlobalEnum';
import { connect } from 'dva';
import LinkEnum from '@/Enums/LinkEnum';
import HSelect from '@/components/Antd/HSelect';

const FORM_ITEM_LAYOUT = {
  wrapperCol: { span: 19 },
  labelCol: { span: 5 }
};

@Form.create()
@connect(({ loading }) => ({
  loading: loading.effects['faultyFriend/add'] || loading.effects['faultyFriend/update'],
}))
class FriendLinkEdit extends RefModal {
  constructor(props) {
    super(props, {
      title: '友情链接',
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
        let type = 'faultyFriend/add';
        payLoad.imgUrl = getAttatchStr(values.imgUrl)
        if (this.props.orgData) {
          type = 'faultyFriend/update';
          payLoad.id = this.props.orgData.id;
        } else {
          payLoad.deleteStatus = '1'
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
            getFieldDecorator('linkName', {
              rules: createFormRules(true),
              initialValue: orgData.linkName,
            })(<HInput />)
          }
        </FormItem>
        {/* <FormItem {...FORM_ITEM_LAYOUT} label='显示顺序'>
          {
            getFieldDecorator('priority', {
              initialValue: orgData.priority,
            })(<HInputNumber />)
          }
        </FormItem> */}
        <FormItem {...FORM_ITEM_LAYOUT} label='链接地址'>
          {
            getFieldDecorator('linkAddress', {
              rules: createFormRules(true),
              initialValue: orgData.linkAddress,
            })(<HInput placeholder='输入友情链接的地址' />)
          }
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label='链接类型'>
          {
            getFieldDecorator('linkType', {
              rules: createFormRules(true),
              initialValue: orgData.linkType,
            })(<HSelect>
              {
                createSelectOptions(LinkEnum.ALL_LIST, LinkEnum.toString)
              }
            </HSelect>)
          }
        </FormItem>
        {/* <FormItem {...FORM_ITEM_LAYOUT} label='是否启用'>
          {
            getFieldDecorator('visible', {
              valuePropName: 'checked',
              initialValue: orgData.visible === 1,
            })(<Switch />)
          }
        </FormItem> */}
        <FormItem {...FORM_ITEM_LAYOUT} label="链接图片">
          {
            getFieldDecorator('imgUrl', {rules: createFormRules(true,null),initialValue: createDefaultUploadFile(orgData.imgUrl)})(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />)
          }
        </FormItem>
      </Form>
    );
  }
}

export default FriendLinkEdit;