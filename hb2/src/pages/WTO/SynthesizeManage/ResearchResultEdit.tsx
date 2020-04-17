import React, { Component } from 'react';
import { Card, Form, Input, Button, DatePicker, Spin } from 'antd';
import BackButton from '@/components/BackButton';
import RichEditor from '@/components/RichEditor';
import { createFormRules, getAttatchStr, createDefaultUploadFile, } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import { UPLOAD_API } from '@/services/api';
import { getPropsParams, translateFormValues } from '@/utils/SystemUtil';
import { connect } from 'dva';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import GlobalEnum from '@/Enums/GlobalEnum';
import HInput from '@/components/Antd/HInput';

const moment = require('moment');

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const NAMESPACE = 'researchResult';

@connect(({ loading, researchResult }) => (
  {
    researchResult,
    loading: loading.effects[`${NAMESPACE}/add`] || loading.effects[`${NAMESPACE}/update`],
    loadingGet: Boolean(loading.effects[`${NAMESPACE}/search`]),
  }
))
class ResearchResultEdit extends Component<IFormAndDvaInterface, any> {
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
      console.log(translateFormValues(values));
      if (!errors) {
        let type = `${NAMESPACE}/add`;
        let payLoad = values;

        //设置附件
        payLoad.attachInfo = getAttatchStr(payLoad.attachInfo);

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
            console.log(res);
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
        label: '标题',
        content: getFieldDecorator('researchTitle', { rules: createFormRules(true), initialValue: orgData.researchTitle })(<HInput />),
      },
      {
        label: '项目研究方',
        content: getFieldDecorator('researchOrg', { initialValue: orgData.researchOrg })(<HInput maxLength={100} />),
      },
      {
        label: '立项时间',
        content: getFieldDecorator('beginTime', { initialValue: orgData.beginTime ? moment(orgData.beginTime) : null })(<DatePicker />),
      },
      {
        label: '结项时间',
        content: getFieldDecorator('endTime', { initialValue: orgData.endTime ? moment(orgData.endTime) : null })(<DatePicker />),
      },
      {
        label: '研究成果简介',
        content: getFieldDecorator('briefIntroduction', { initialValue: orgData.briefIntroduction })(<Input.TextArea />),
      },
      {
        label: '项目成果',
        content: getFieldDecorator('researchResult', { initialValue: orgData.researchResult })(<RichEditor />),
      },
      {
        label: '附件上传',
        content: getFieldDecorator('attachInfo', {
          initialValue: createDefaultUploadFile(orgData.attachInfo)
        })(<LimitUpload action={UPLOAD_API} type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />
        ),
      },
    ];
    return (
      <Card title="研究成果编辑">
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

export default Form.create()(ResearchResultEdit);