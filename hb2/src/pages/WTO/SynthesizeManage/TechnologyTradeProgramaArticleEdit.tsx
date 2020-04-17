import React from 'react';
import Form from 'antd/lib/form';
import { createFormRules } from '@/utils/AntdUtil';
import { connect } from 'dva';
import DefaultEditView from '@/components/DefaultEditView';
import RichEditor from '@/components/RichEditor';
import HInput from '@/components/Antd/HInput';

/**
 * 技术贸易措施专题编辑
 */
@connect(({ loading }) => (
  {
    loading,
  }
))
class TechnologyTradeProgramaArticleEdit extends DefaultEditView {
  constructor(props) {
    super(props, 'technologyTradePrograma', '技术文章编辑');
  }

  transFormValue(values) {
    console.log(this.props);
    values.scPid = this.props.match.params.programaId;
    return values;
  }

  createFormItemList() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    return [
      {
        label: '文章标题',
        content: getFieldDecorator('scName', { rules: createFormRules(true), initialValue: orgData.scName })(<HInput />),
      },
      {
        label: '文章内容',
        content: getFieldDecorator('scContent', { initialValue: orgData.scContent })(<RichEditor />),
      },
    ];
  }
}


export default Form.create()(TechnologyTradeProgramaArticleEdit);