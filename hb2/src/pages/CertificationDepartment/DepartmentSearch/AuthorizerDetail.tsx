import React, { Component } from 'react';
import { Card, Button, Spin } from 'antd';
import { getPropsParams } from '@/utils/SystemUtil';
import IFormAndDvaInterface from '@/base/Interface/IFormAndDvaInterface';
import AuthorizedDetailTable from './AuthorizedDetailTable'
import { connect } from 'dva';


@connect(({ loading }) => ({ loading }))

class AuthorizedDetail extends Component<IFormAndDvaInterface, any> {
  /**
   * 表示使用哪个model，必须和model的命名空间一样
   */
  protected _nameSpace: string;

  /**
   * card标题
   */
  private _title: string;


  constructor(props) {
    super(props);

    this._nameSpace = "AuthorizerDetial";
    this._title = '授权签字人信息';
    this.state = {
      orgData: null,
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

  getOrgData() {
    let param = getPropsParams(this.props);
    if (param.id) {
      this.props.dispatch(
        {
          type: `${this._nameSpace}/search`,
          payLoad: param.id,
          callBack: (res) => {
            this.setState({ orgData: res.data });
          }
        }
      );
    }
  }

  get readOnly() {
    return getPropsParams(this.props).readOnly;
  }

  render() {
    const loadingGet = Boolean(this.props.loading.effects[`${this._nameSpace}/search`]);
    return (
      <Card title={this._title} className={this.getClassName()}>
        <Spin spinning={loadingGet}>
          <AuthorizedDetailTable data={this.state.orgData} />
        </Spin>
      </Card>
    );
  }
}

export default AuthorizedDetail;