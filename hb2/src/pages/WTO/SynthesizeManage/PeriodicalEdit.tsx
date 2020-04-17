import React, { Component } from 'react';
import Form from 'antd/lib/form';
import { Card, Button, Select, Radio, Spin } from 'antd';
import BackButton from '@/components/BackButton';
import { createFormRules, getAttatchStr, createYearOption, createDefaultUploadFile } from '@/utils/AntdUtil';
import LimitUpload, { LimiteTypeEnum } from '@/components/LimitUpload';
import RadioGroup from 'antd/lib/radio/group';
import { connect } from 'dva';
import { getPropsParams } from '@/utils/SystemUtil';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import GlobalEnum from '@/Enums/GlobalEnum';
import HInput from '@/components/Antd/HInput';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const { Option } = Select;

const NAMESPACE = 'periodical';

@connect(({ loading, periodical }) => (
  {
    periodical,
    loading: loading.effects[`${NAMESPACE}/add`] || loading.effects[`${NAMESPACE}/update`],
    loadingGet: Boolean(loading.effects[`${NAMESPACE}/search`]),
  }
))
class PeriodicalEdit extends Component<IFormAndDvaInterface, any> {
  constructor(props) {
    super(props);
    this.state = {
      orgData: null,
    };
    console.log(props);
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
        payLoad.journalCover = getAttatchStr(payLoad.journalCover);
        payLoad.journalFile = getAttatchStr(payLoad.journalFile);
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
        label: '期刊标题',
        content: getFieldDecorator('journalTitle', { rules: createFormRules(true), initialValue: orgData.journalTitle })(<HInput />),
      },
      {
        label: '所属年份',
        content: getFieldDecorator('journalYear', { initialValue: orgData.journalYear })(
          <Select>
            {
              createYearOption().map((item) => {
                return <Option key={item.toString()} value={item}>{item}</Option>
              })
            }
          </Select>
        ),
      },
      {
        label: '期刊号',
        content: getFieldDecorator('journalNo', { initialValue: orgData.journalNo })(<HInput />),
      },
      {
        label: '封面',
        content: getFieldDecorator('journalCover', { initialValue: createDefaultUploadFile(orgData.journalCover) })(<LimitUpload type={LimiteTypeEnum.IMAGE} accept={GlobalEnum.UPLOAD_IMAGE_ACCEPTS} />),
      },
      {
        label: 'PDF文档',
        content: getFieldDecorator('journalFile', { initialValue: createDefaultUploadFile(orgData.journalFile) })(<LimitUpload accept='.pdf' />),
      },
      {
        label: '所属分类',
        content: getFieldDecorator('journalType', { initialValue: orgData.journalType || '0' })(
          <RadioGroup>
            <Radio value='0'>期刊信息</Radio>
            <Radio value='1'>预警快讯</Radio>
          </RadioGroup>
        ),
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


export default Form.create()(PeriodicalEdit);