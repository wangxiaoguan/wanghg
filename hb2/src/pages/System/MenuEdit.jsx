import RefModal from '@/components/RefModal';
import {Form, Switch} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import {createFormRules} from '@/utils/AntdUtil';
import {connect} from 'dva';
import HInput from '@/components/Antd/HInput';
import HInputNumber from '@/components/Antd/HInputNumber';


const FORM_ITEM_LAYOUT = {
  wrapperCol: {span: 19},
  labelCol: {span: 5}
};

/**
 * 菜单编辑
 * successHandler()--编辑成功的回调函数，
 */
@Form.create()
@connect(({loading, systemMenu}) => ({
  systemMenu,
  loading: loading.effects['systemMenu/add'] || loading.effects['systemMenu/update'],
}))
class MenuEdit extends RefModal {
  constructor(props) {
    super(
      props,
      {
        title: '菜单编辑',
        onOk: () => {
          this.save();
        }
      });
  }

  save() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const payLoad = {
          ...values,
          type: 'menu',
          module: 'index',
          visible: values.visible ? 1 : 0,
        }
        let type = 'systemMenu/add';
        if (this.state.orgData) {
          type = 'systemMenu/update';
          payLoad.id = this.state.orgData.id;
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
    const {orgData} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <Form>
        <FormItem {...FORM_ITEM_LAYOUT} label='菜单名称'>
          {
            getFieldDecorator('name', {
              rules: createFormRules(true),
              initialValue: orgData ? orgData.name : '',
            })(<HInput />)
          }
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label='显示顺序'>
          {
            getFieldDecorator('priority', {
              initialValue: orgData ? orgData.priority : 1,
            })(<HInputNumber />)
          }
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label='菜单链接'>
          {
            getFieldDecorator('skipUrl', {
              rules: createFormRules(true),
              initialValue: orgData ? orgData.skipUrl : '',
            })(<HInput placeholder='输入菜单对应的链接' />)
          }
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label='是否启用'>
          {
            getFieldDecorator('visible', {
              valuePropName: 'checked',
              initialValue: orgData ? orgData.visible === 1 : true,
            })(<Switch />)
          }
        </FormItem>
      </Form>
    );
  }
}

export default MenuEdit;