import React from 'react';
import DefaultEditView from '@/components/DefaultEditView';
import HInput from '@/components/Antd/HInput';
import LimitUpload from '@/components/LimitUpload';
import { Form } from 'antd';
import { connect } from 'dva';
import { getAttatchStr, createDefaultUploadFile } from '@/utils/AntdUtil';
import { getPropsParams } from '@/utils/SystemUtil';

@connect(({ loading }) => ({
  loading
}))
class OfficialDiscussionEdit extends DefaultEditView {
  constructor(props) {
    super(props, "officialDiscussion", "官方评议");
  }

  transFormValue(values) {
    let param = getPropsParams(this.props);
    values.id = param.id;
    values.officialAttach = getAttatchStr(values.officialAttach);
    return values;
  }

  save() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let type = `${this._nameSpace}/add`;
        let payLoad = this.transFormValue(values);
        this.props.dispatch(
          {
            type,
            payLoad,
            callBack: () => {
              window.history.back();
            }
          }
        );
      }
    });
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData? this.state.orgData : {};
    const readOnly = this.readOnly;
    return [
      {
        label: '内容简述',
        content: getFieldDecorator('officialComment', { initialValue: orgData.officialComment })(<HInput.TextArea disabled={readOnly} />),
      },
      {
        label: '附件上传',
        content: getFieldDecorator('officialAttach', { initialValue: createDefaultUploadFile(orgData.officialAttach) })(<LimitUpload disabled={readOnly}/>),
      },
    ];
  }
}

export default Form.create()(OfficialDiscussionEdit);