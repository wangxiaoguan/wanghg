import React, { Component } from 'react';
import Form from 'antd/lib/form';
import { Card, Button, Spin } from 'antd';
import BackButton from '@/components/BackButton';
import { getPropsParams } from '@/utils/SystemUtil';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';

const FormItem = Form.Item;
const FormItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

/**
 * 根据需求整理出的通用的编辑页面
 * + 默认为新增状态；当props.match.params包含id参数时，先根据id获取数据，获取成功，则进入编辑状态。
 * 
 * + 对应的model需要包含 save,update,get三个方法
 * 
 * + 如果表单数据和实际要发给服务器的数据不一样，需要重写transFormValue方法，并返回需要发给服务器的数据
 */
class DefaultEditView extends Component<IFormAndDvaInterface, any> {
  /**
   * 表示使用哪个model，必须和model的命名空间一样
   */
  protected _nameSpace: string;

  /**
   * card标题
   */
  private _title: string;

  private _formLayout: any;

  /**
   * 
   * @param props 
   * @param nameSpace 表示使用哪个model，必须和model的命名空间一样
   * @param title card标题
   */
  constructor(props, nameSpace, title, formLayout = null) {
    super(props);
    this._nameSpace = nameSpace;
    this._title = title;
    this._formLayout = formLayout;
    this.state = {
      orgData: null,
      detail:false,
    };
  }

  getClassName() {
    return ''
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

  /**
   * 把form表单的数据，转换为要提交到服务器的格式
   * 如果form表单的数据和最终要发出的数据不一致，需要重写此函数
   * @param formValues 
   */
  transFormValue(formValues) {
    return formValues;
  }

  createFormItemList() {
    return [];
  }

  save() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let type = `${this._nameSpace}/add`;
        let payLoad = this.transFormValue(values);
        if (this.state.orgData) {
          type = `${this._nameSpace}/update`;
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
          type: `${this._nameSpace}/search`,
          payLoad: param.id,
          callBack: (res) => {
            this.setState({ orgData: res.data });
            this.props.form.resetFields();
          }
        }
      );
    }
  }

  get readOnly() {
    return getPropsParams(this.props).readOnly;
  }

  render() {
    const formLayout = this._formLayout || FormItemLayout;
    const loadingGet = Boolean(this.props.loading.effects[`${this._nameSpace}/search`]);
    const loadingEdit = this.props.loading.effects[`${this._nameSpace}/add`] || this.props.loading.effects[`${this._nameSpace}/update`];
    const formItems = this.createFormItemList();
    const {detail} = this.state
    return (
      <Card title={this._title} className={this.getClassName()}>
        <Spin spinning={loadingGet}>
          <Form>
            {
              formItems &&
              formItems.map((item) => {
                return (
                  <FormItem key={item.label} {...formLayout} label={item.label}>{item.content}</FormItem>
                );
              })
            }
            {detail || <FormItem wrapperCol={{ offset: formLayout.labelCol.span || 3 }}>
              {
                !this.readOnly &&
                <Button loading={loadingEdit} type="primary" onClick={() => this.save()}>保存</Button>
              }
              <BackButton />
            </FormItem>}
          </Form>
        </Spin>
      </Card>
    );
  }
}


export default DefaultEditView;