import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import { Input, Form } from 'antd';
import RichEditor from '@/components/RichEditor';
import { connect } from 'dva';
import { createFormRules } from '@/utils/AntdUtil';
import { getPropsParams } from '@/utils/SystemUtil';

@connect(({ loading }) => ({
  loading
}))
class NewsEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'faultyIntroduction', '中心简介');
  }

  transFormValue(formValues) {
    const result = { ...formValues };
    return result;
  }

  getOrgData() {
    let param = getPropsParams(this.props);
    // if (param.id) {
      
    // }
    this.props.dispatch(
      {
        type: `${this._nameSpace}/search`,
        payLoad: param.id,
        callBack: (res) => {
          this.setState({ orgData: res.data });
          this.props.form.resetFields();
        }
      }
    );
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '标题',
        content: getFieldDecorator('title', { rules: createFormRules(true), initialValue: orgData.title })(<Input />),
      },
      // {
      //   label: '封面',
      //   content: getFieldDecorator('imgPath',{ initialValue: createDefaultUploadFile(orgData.filePath) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />),
      // },
      // {
      //   label: '附件',
      //   content: getFieldDecorator('filePath',{ initialValue: createDefaultUploadFile(orgData.filePath) })(<LimitUpload />),
      // },
      {
        label: '内容',
        content: getFieldDecorator('content', { initialValue: orgData.content })(<RichEditor />),
      },
    ];
  }

}

export default Form.create()(NewsEdit);