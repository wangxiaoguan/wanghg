import React, { Component } from 'react';
import Form from 'antd/lib/form';
import { Card, Button, Spin } from 'antd';
import BackButton from '@/components/BackButton';
import { createFormRules } from '@/utils/AntdUtil';
import RichEditor from '@/components/RichEditor';
import { connect } from 'dva';
import { getPropsParams } from '@/utils/SystemUtil';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import HInput from '@/components/Antd/HInput';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const NAMESPACE = 'caseLibrary';

@connect(({ loading }) => (
  {
    loading: loading.effects[`${NAMESPACE}/add`] || loading.effects[`${NAMESPACE}/update`],
    loadingGet: Boolean(loading.effects[`${NAMESPACE}/search`]),
  }
))
class CaseLibraryEdit extends Component<IFormAndDvaInterface, any> {
  constructor(props) {
    super(props);
    this.state = {
      orgData: null,
    };
  }

  componentDidMount() {
    this.getOrgData();
  }

  componentDidUpdate(prevProps) {
    let prevParam = getPropsParams(prevProps);
    let param = getPropsParams(this.props);
    if (param.id && param.id !== prevParam.id) {
      this.getOrgData();
    }
  }

  save() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let type = `${NAMESPACE}/add`;
        let payLoad = values;
        if (this.state.orgData) {
          type = `${NAMESPACE}/update`;
          payLoad.id = this.state.orgData.id;
        }

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

  getOrgData() {
    let param = getPropsParams(this.props);
    if (param.id) {
      this.props.dispatch(
        {
          type: `${NAMESPACE}/search`,
          payLoad: param.id,
          callBack: (res) => {
            this.setState({ orgData: res.data });
            this.props.form.resetFields();
          }
        }
      );
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const orgData = this.state.orgData || {};
    const FORM_ITEMS = [
      {
        label: '案例名称',
        content: getFieldDecorator('title', { rules: createFormRules(true), initialValue: orgData.title })(<HInput />),
      },
      {
        label: '案例内容',
        content: getFieldDecorator('content', { rules: createFormRules(true, null), initialValue: orgData.content })(<RichEditor />),
      },
    ];
    return (
      <Card title="案例编辑">
        <Spin spinning={this.props.loadingGet}>
          <Form>
            {
              FORM_ITEMS.map((item) => {
                return (
                  <FormItem key={item.label} {...FormItemLayout} label={item.label}>{item.content}</FormItem>
                );
              })
            }
            <FormItem wrapperCol={{ offset: 3 }}>
              <Button loading={this.props.loading} type="primary" onClick={() => this.save()}>保存</Button>
              <BackButton />
            </FormItem>
          </Form>
        </Spin>
      </Card>
    );
  }
}


export default Form.create()(CaseLibraryEdit);