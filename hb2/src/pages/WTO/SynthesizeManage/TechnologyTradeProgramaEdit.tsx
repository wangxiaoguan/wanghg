import React from 'react';
import RefModal from '../../../components/RefModal';
import { Form } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { createFormRules } from '@/utils/AntdUtil';
import { connect } from 'dva';
import HInput from '@/components/Antd/HInput';

/**
 * props-subjectId
 */
@connect(({ loading }) => ({
  loading
}))
class TechnologyTradeProgramaEdit extends RefModal {

  constructor(props) {
    super(props, {
      title: '技术贸易栏目编辑',
      onOk: () => {
        this.onOk();
      }
    });
  }

  onOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let type: string = 'technologyTradePrograma/add';
        let payLoad: any = {
          "subjectId": this.props.subjectid,
          "scName": values.scName,

          //下面两个参数是根据服务器接口固定的
          "deleteStatus": "1",
          "scPID": 0,
        };
        if (this.props.orgData) {
          type = 'technologyTradePrograma/update';
          payLoad.id = this.props.orgData.id;
        }
        this.props.dispatch(
          {
            type,
            payLoad,
            callBack: () => {
              this.close();
              if (this.props.completeHandler) {
                this.props.completeHandler();
              }
            }
          }
        );
      }
    });
  }

  renderChildren() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.props.orgData || {};
    return (
      <Form>
        <FormItem label='专题栏目名称' labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {
            getFieldDecorator('scName', { rules: createFormRules(true), initialValue: orgData.scName })(<HInput />)
          }
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(TechnologyTradeProgramaEdit);

export { TechnologyTradeProgramaEdit as TechnologyTradeProgramaEditClass }