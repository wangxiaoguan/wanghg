import React from 'react';
import Form from 'antd/lib/form';
import { createFormRules } from '@/utils/AntdUtil';
import { connect } from 'dva';
import DefaultEditView from '@/components/DefaultEditView';
import RichEditor from '@/components/RichEditor';
import { message } from 'antd';

/**
 * 技术贸易措施专题编辑
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class AboutUs extends DefaultEditView {
  constructor(props) {
    super(props, 'aboutUs', 'About Us');
  }

  getOrgData() {
    this.props.dispatch(
      {
        type: `aboutUs/search`,
        payLoad: {},
        callBack: (res) => {
          this.setState({ orgData: res.data });
          this.props.form.resetFields();
        }
      }
    );
  }

  save() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let type = `aboutUs/update`;
        let payLoad = this.transFormValue(values);
        payLoad.id = this.state.orgData.id;
        payLoad.deleteStatus = "1"
        this.props.dispatch(
          {
            type,
            payLoad,
            callBack: () => {
              message.success("修改成功");
            }
          }
        );
      }
    });
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: 'details',
        content: getFieldDecorator('aboutContent', { rules: createFormRules(true, null), initialValue: orgData.aboutContent })(<RichEditor />),
      },
    ];
  }
}


export default Form.create()(AboutUs);