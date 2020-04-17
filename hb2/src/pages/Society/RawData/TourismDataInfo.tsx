import React, { Component } from 'react';
import { Card, Button } from 'antd';
import { createTdItem } from '@/utils/AntdUtil';
import { connect } from 'dva';
import { getPropsParams } from '@/utils/SystemUtil';


@connect(({ loading }) => ({
}))

class TourismDataInfo extends Component<any, any> {

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
        type: 'tourismData/search',
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
      <Card title={<span><span>旅游数据</span><Button onClick={() => {
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
                  createTdItem('数据时间', `${data.dataTime || '---'}`),
                  createTdItem('2011版经济行业', `${data.jjhy2011Name || '---'}`),
                  createTdItem('2011版经济类型', `${data.jjlx2011 || '---'}`),

                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('机构代码', `${data.jgdm || '---'}`),
                  createTdItem('机构名称', `${data.jgmc || '---'}`),
                  createTdItem('法定代表人姓名', `${data.fddbr || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('法定代表人(负责人)移动电话', `${data.fryddh || '---'}`),
                  createTdItem('法定代表人(负责人)固定电话', `${data.frgddh || '---'}`),
                  createTdItem('法定代表人(负责人)电子邮箱', `${data.frdzyx || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('法定代表人(负责人)证件类型', `${data.frZjlxName || '---'}`),
                  createTdItem('法定代表人(负责人)证件号码	', `${data.frzjhm || '---'}`),
                  createTdItem('注册日期', `${data.zcrq || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('主管机构代码', `${data.zgjgdm || '---'}`),
                  createTdItem('批准机构代码', `${data.pzjgdm || '---'}`),
                  createTdItem('行政区划', `${data.xzqh || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('机构地址', `${data.jgdz || '---'}`),
                  createTdItem('电话号码', `${data.dhhm || '---'}`),
                  createTdItem('注册号', `${data.zch || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('主管机构名称', `${data.zgjgmc || '---'}`),
                  createTdItem('批准机构名称', `${data.pzjgmc || '---'}`),
                  createTdItem('录档日期', `${data.inputdate || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('上报日期', `${data.exporttime || '---'}`),
                  createTdItem('审核标记', `${this.getIsCheck(data.ischeck) || '---'}`),
                  createTdItem('最后修改日期', `${data.lastModified || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('统一社会信用代码', `${data.tyshxydm || '---'}`),
                  createTdItem('生产经营地址', `${data.jydz || '---'}`),
                  createTdItem('生产经营地址行政区划', `${data.jydzxzqh || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('经营范围', `${data.jyfw || '---'}`),
                  createTdItem('证照有效期起始日期', `${data.jyqxs || '---'}`),
                  createTdItem('证照有效期终止日期', `${data.jyqxe || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('注册资金', `${data.zczj || '---'}`),
                  createTdItem('外商投资国别', `${data.wstzgb || '---'}`),
                  createTdItem('货币种类', `${data.hbzl || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('财务负责人姓名', `${data.cwxm || '---'}`),
                  createTdItem('财务负责人移动电话', `${data.cwyddh || '---'}`),
                  createTdItem('财务负责人固定电话', `${data.cwgddh || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('财务负责人电子邮箱', `${data.cwdzyx || '---'}`),
                  createTdItem('财务负责人证件类型', `${data.cwZjlxName || '---'}`),
                  createTdItem('财务负责人证件号码', `${data.cwzjhm || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('联络员姓名', `${data.lxrxm || '---'}`),
                  createTdItem('联络员移动电话', `${data.lxryddh || '---'}`),
                  createTdItem('联络员固定电话', `${data.lxrgddh || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('联络员证件类型', `${data.llrZjlxName || '---'}`),
                  createTdItem('联络员证件号码', `${data.lxrzjhm || '---'}`),
                  createTdItem('登记机关', `${data.memo10 || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('企业类型', `${data.qylxName || '---'}`),
                  createTdItem('成立日期', `${data.clrq || '---'}`),
                  createTdItem('核准日期', `${data.hzrq || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('经营状态', `${data.jyztName || '---'}`),
                  createTdItem('错误类型 (问题大类)', `${data.dCwlxName || ''}`),
                  createTdItem('错误类型 (问题小类)', `${data.xCwlxName || ''}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('数据状态', `${this.getDflag(data.dflag)}`),
                  createTdItem('核算方式', `${data.hsfsName || '---'}`),
                  createTdItem('业务类型', `${data.ywlxName || '---'}`),
                ]
              }
            </tr>
            <tr>
              {
                [
                  createTdItem('数据来源', `${data.sjlyName || '---'}`),
                  createTdItem('---', `${data.x || '---'}`),
                  createTdItem('---', `${data.x || '---'}`),
                ]
              }
            </tr>
          </tbody>
        </table>
      </Card>
    );
  }
  private getDflag(type: number) {
    switch (type) {
      case 0:
        return '新增问题数据'
      case 1:
        return '历史问题数据已改'
      default:
        return '未知'
    }
  }
  private getIsCheck(type: string) {
    switch (type) {
      case '0':
        return '未上报'
      case '2':
        return '已上报'
      case '-2':
        return '删除'
      default:
        return '未知'
    }
  }
}

export default TourismDataInfo;