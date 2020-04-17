import React, { Component } from 'react';
import { Card, Button } from 'antd';
import { createTdItem } from '@/utils/AntdUtil';
import { connect } from 'dva';
import { getPropsParams } from '@/utils/SystemUtil';


@connect(({ loading }) => ({
}))

class InquiryCodeBaseInfo extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    this.requestData()
  }

  private requestData = () => {
    const { id } = getPropsParams(this.props)
    if (!id) { return }
    this.props.dispatch(
      {
        type: 'inquiryCodeBase/search',
        payLoad: id,
        callBack: (res) => {
          this.setState({ data: res.data })
        }
      }
    );
  }


  render() {
    const { data = {} } = this.state
    return (
      <Card title={<span><span>原始机构代码库</span><Button onClick={() => {
        window.history.back();
      }} type="primary" style={{ float: 'right' }}>返回</Button></span>}>
        <table className="InfoTable">
          <thead>
            <tr><th colSpan={6}>机构详情</th></tr>
          </thead>
          <tbody>
            <tr>
              {
                [
                  createTdItem('组织机构代码', `${data.jgdm || '---'}`),
                  createTdItem('机构名称', `${data.jgmc || '---'}`),
                  createTdItem('法定代表人', `${data.fddbr || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('法定代表人身份证类型', `${data.frZjlxName || '---'}`),
                  createTdItem('法定代表人身份证号码', `${data.zjhm || '---'}`),
                  createTdItem('经营范围', `${data.jyfw || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('机构类型', `${data.jglx || '---'}`),
                  createTdItem('新机构类型', `${data.njglx || '---'}`),
                  createTdItem('经济行业', `${data.jjhy || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('新经济行业', `${data.njjhy || '---'}`),
                  createTdItem('机构地址', `${data.jgdz || '---'}`),
                  createTdItem('经济行业2011', `${data.jjhy2011Name || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('办证日期', `${data.bzrq || '---'}`),
                  createTdItem('作废日期', `${data.zfrq || '---'}`),
                  createTdItem('注册日期', `${data.zcrq || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('电话号码', `${data.dhhm || '---'}`),
                  createTdItem('手机', `${data.mobile || '---'}`),
                  createTdItem('行政区划', `${data.xzqh || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('最新更新日期', `${data.lastdate || '---'}`),
                  createTdItem('办证机构代码', `${data.bzjgdm || '---'}`),
                  createTdItem('', ``),
                ]
              }
            </tr>
          </tbody>
        </table>
      </Card>
    );
  }
}

export default InquiryCodeBaseInfo;